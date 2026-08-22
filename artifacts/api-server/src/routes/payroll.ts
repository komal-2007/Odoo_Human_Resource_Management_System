import { Prisma } from "@prisma/client";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
import { publicUser } from "./auth";

const router: IRouter = Router();

/** Component types: EARNING increases gross salary; DEDUCTION decreases net salary. */
const COMPONENT_TYPE_EARNING = "EARNING";
const COMPONENT_TYPE_DEDUCTION = "DEDUCTION";

const salaryComponentInputSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum([COMPONENT_TYPE_EARNING, COMPONENT_TYPE_DEDUCTION]),
  amount: z.number().finite().nonnegative(),
});

export const createPayrollSchema = z
  .object({
    employeeId: z.string().min(1),
    payPeriodStart: z.string().date(),
    payPeriodEnd: z.string().date(),
    basicSalary: z.number().finite().nonnegative(),
    components: z.array(salaryComponentInputSchema).default([]),
  })
  .strict();

const updatePayrollSchema = z
  .object({
    payPeriodStart: z.string().date().optional(),
    payPeriodEnd: z.string().date().optional(),
    basicSalary: z.number().finite().nonnegative().optional(),
    components: z.array(salaryComponentInputSchema).optional(),
  })
  .strict();

type SalaryComponentInput = z.infer<typeof salaryComponentInputSchema>;

export function parseDateOnly(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    const error = new Error("Dates must be valid calendar dates.");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
  return date;
}

export function validatePayPeriod(payPeriodStart: string, payPeriodEnd: string) {
  const start = parseDateOnly(payPeriodStart);
  const end = parseDateOnly(payPeriodEnd);
  if (start > end) {
    const error = new Error("payPeriodStart cannot be after payPeriodEnd.");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
  return { start, end };
}

function dateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function moneyNumber(value: Prisma.Decimal | number | string): number {
  return Number(value);
}

/**
 * grossSalary = basicSalary + sum(EARNING)
 * deductions = sum(DEDUCTION)
 * netSalary = grossSalary - deductions
 */
export function calculatePayrollTotals(
  basicSalary: number,
  components: SalaryComponentInput[],
) {
  const earnings = components
    .filter((component) => component.type === COMPONENT_TYPE_EARNING)
    .reduce((sum, component) => sum + component.amount, 0);
  const deductions = components
    .filter((component) => component.type === COMPONENT_TYPE_DEDUCTION)
    .reduce((sum, component) => sum + component.amount, 0);
  const grossSalary = basicSalary + earnings;
  const netSalary = grossSalary - deductions;
  return {
    basicSalary: new Prisma.Decimal(basicSalary.toFixed(2)),
    grossSalary: new Prisma.Decimal(grossSalary.toFixed(2)),
    deductions: new Prisma.Decimal(deductions.toFixed(2)),
    netSalary: new Prisma.Decimal(netSalary.toFixed(2)),
  };
}

function serializeComponent(component: {
  id: string;
  payrollId: string;
  name: string;
  type: string;
  amount: Prisma.Decimal;
}) {
  return {
    id: component.id,
    payrollId: component.payrollId,
    name: component.name,
    type: component.type,
    amount: moneyNumber(component.amount),
  };
}

function serializePayroll(record: {
  id: string;
  employeeId: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  basicSalary: Prisma.Decimal;
  grossSalary: Prisma.Decimal;
  deductions: Prisma.Decimal;
  netSalary: Prisma.Decimal;
  createdAt: Date;
  components: Array<{
    id: string;
    payrollId: string;
    name: string;
    type: string;
    amount: Prisma.Decimal;
  }>;
  employee?: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    user: {
      id: string;
      loginId: string;
      email: string;
      role: "ADMIN" | "EMPLOYEE";
      mustChangePassword: boolean;
    };
  } | null;
}) {
  return {
    id: record.id,
    employeeId: record.employeeId,
    payPeriodStart: dateOnly(record.payPeriodStart),
    payPeriodEnd: dateOnly(record.payPeriodEnd),
    basicSalary: moneyNumber(record.basicSalary),
    grossSalary: moneyNumber(record.grossSalary),
    deductions: moneyNumber(record.deductions),
    netSalary: moneyNumber(record.netSalary),
    createdAt: record.createdAt.toISOString(),
    components: record.components.map(serializeComponent),
    employee: record.employee
      ? {
          id: record.employee.id,
          employeeCode: record.employee.employeeCode,
          firstName: record.employee.firstName,
          lastName: record.employee.lastName,
          user: publicUser(record.employee.user),
        }
      : undefined,
  };
}

const payrollInclude = {
  components: true,
} as const;

const payrollWithEmployeeInclude = {
  components: true,
  employee: { include: { user: true } },
} as const;

export function isUniquePayPeriodConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function handleDateValidationError(error: unknown, res: { status: (code: number) => { json: (body: unknown) => void } }): boolean {
  if (error instanceof Error && (error as Error & { status?: number }).status === 400) {
    res.status(400).json({ error: error.message });
    return true;
  }
  return false;
}

router.get("/payroll/me", requireAuth, requireRole("EMPLOYEE"), async (_req, res, next) => {
  try {
    const auth = res.locals.auth as { userId: string };
    const employee = await prisma.employeeProfile.findUnique({ where: { userId: auth.userId } });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const records = await prisma.payrollRecord.findMany({
      where: { employeeId: employee.id },
      include: payrollInclude,
      orderBy: [{ payPeriodStart: "desc" }, { payPeriodEnd: "desc" }, { createdAt: "desc" }],
    });
    res.json(records.map(serializePayroll));
  } catch (error) {
    next(error);
  }
});

router.get("/payroll/me/:id", requireAuth, requireRole("EMPLOYEE"), async (req, res, next) => {
  try {
    const auth = res.locals.auth as { userId: string };
    const employee = await prisma.employeeProfile.findUnique({ where: { userId: auth.userId } });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const record = await prisma.payrollRecord.findFirst({
      where: { id: String(req.params.id), employeeId: employee.id },
      include: payrollInclude,
    });
    if (!record) {
      res.status(404).json({ error: "Payroll record not found." });
      return;
    }
    res.json(serializePayroll(record));
  } catch (error) {
    next(error);
  }
});

router.get("/payroll", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const records = await prisma.payrollRecord.findMany({
      include: payrollWithEmployeeInclude,
      orderBy: [{ payPeriodStart: "desc" }, { payPeriodEnd: "desc" }, { createdAt: "desc" }],
    });
    res.json(records.map(serializePayroll));
  } catch (error) {
    next(error);
  }
});

router.post("/payroll", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const input = createPayrollSchema.parse(req.body);
    let period;
    try {
      period = validatePayPeriod(input.payPeriodStart, input.payPeriodEnd);
    } catch (error) {
      if (handleDateValidationError(error, res)) return;
      throw error;
    }
    const employee = await prisma.employeeProfile.findUnique({ where: { id: input.employeeId } });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const totals = calculatePayrollTotals(input.basicSalary, input.components);
    try {
      const record = await prisma.payrollRecord.create({
        data: {
          employeeId: input.employeeId,
          payPeriodStart: period.start,
          payPeriodEnd: period.end,
          ...totals,
          components: {
            create: input.components.map((component) => ({
              name: component.name,
              type: component.type,
              amount: new Prisma.Decimal(component.amount.toFixed(2)),
            })),
          },
        },
        include: payrollWithEmployeeInclude,
      });
      res.status(201).json(serializePayroll(record));
    } catch (error) {
      if (isUniquePayPeriodConflict(error)) {
        res.status(409).json({
          error: "A payroll record already exists for this employee and pay period.",
        });
        return;
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

router.get("/payroll/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const record = await prisma.payrollRecord.findUnique({
      where: { id: String(req.params.id) },
      include: payrollWithEmployeeInclude,
    });
    if (!record) {
      res.status(404).json({ error: "Payroll record not found." });
      return;
    }
    res.json(serializePayroll(record));
  } catch (error) {
    next(error);
  }
});

router.patch("/payroll/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const input = updatePayrollSchema.parse(req.body);
    if (Object.keys(input).length === 0) {
      res.status(400).json({ error: "At least one payroll field is required." });
      return;
    }
    const existing = await prisma.payrollRecord.findUnique({
      where: { id: String(req.params.id) },
      include: payrollInclude,
    });
    if (!existing) {
      res.status(404).json({ error: "Payroll record not found." });
      return;
    }
    const payPeriodStart = input.payPeriodStart ?? dateOnly(existing.payPeriodStart);
    const payPeriodEnd = input.payPeriodEnd ?? dateOnly(existing.payPeriodEnd);
    let period;
    try {
      period = validatePayPeriod(payPeriodStart, payPeriodEnd);
    } catch (error) {
      if (handleDateValidationError(error, res)) return;
      throw error;
    }
    const components: SalaryComponentInput[] =
      input.components ??
      existing.components.map((component) => ({
        name: component.name,
        type: component.type as SalaryComponentInput["type"],
        amount: moneyNumber(component.amount),
      }));
    const basicSalary =
      input.basicSalary ?? moneyNumber(existing.basicSalary);
    const totals = calculatePayrollTotals(basicSalary, components);
    try {
      const record = await prisma.$transaction(async (transaction) => {
        if (input.components !== undefined) {
          await transaction.salaryComponent.deleteMany({
            where: { payrollId: existing.id },
          });
        }
        return transaction.payrollRecord.update({
          where: { id: existing.id },
          data: {
            payPeriodStart: period.start,
            payPeriodEnd: period.end,
            ...totals,
            ...(input.components !== undefined
              ? {
                  components: {
                    create: input.components.map((component) => ({
                      name: component.name,
                      type: component.type,
                      amount: new Prisma.Decimal(component.amount.toFixed(2)),
                    })),
                  },
                }
              : {}),
          },
          include: payrollWithEmployeeInclude,
        });
      });
      res.json(serializePayroll(record));
    } catch (error) {
      if (isUniquePayPeriodConflict(error)) {
        res.status(409).json({
          error: "A payroll record already exists for this employee and pay period.",
        });
        return;
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

export default router;
