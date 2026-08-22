import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "@workspace/db";
import { hashPassword, type AuthTokenPayload } from "../lib/auth";
import { loginIdFor } from "../lib/loginId";
import { requireAuth, requireRole } from "../middlewares/auth";
import { publicUser } from "./auth";

const router: IRouter = Router();
const createEmployeeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  employeeCode: z.string().trim().min(1).max(40),
  phone: z.string().max(30).optional(),
  department: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  dateOfJoining: z.string().date(),
});
const updateMyProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    phone: z.string().max(30).optional(),
  })
  .strict();
const updateEmployeeSchema = z
  .object({
    email: z.string().email().optional(),
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    phone: z.string().max(30).optional(),
    department: z.string().max(100).optional(),
    jobTitle: z.string().max(100).optional(),
    employeeCode: z.string().trim().min(1).max(40).optional(),
  })
  .strict();

function initialPassword(): string {
  return `Df!${randomBytes(9).toString("base64url")}`;
}

function hasUpdateFields(input: object): boolean {
  return Object.keys(input).length > 0;
}

function uniqueConflictMessage(error: Prisma.PrismaClientKnownRequestError): string {
  const target = error.meta?.target;
  const fields = Array.isArray(target) ? target.map(String) : [];
  if (fields.includes("email")) {
    return "An employee with this email already exists.";
  }
  if (fields.includes("employeeCode")) {
    return "An employee with this employee code already exists.";
  }
  return "An employee with these details already exists.";
}

function serializeEmployee(employee: {
  user: {
    id: string;
    loginId: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
    mustChangePassword: boolean;
  };
}) {
  const { user, ...profile } = employee;
  return { ...profile, user: publicUser(user) };
}

async function createEmployeeWithSerial(
  input: z.infer<typeof createEmployeeSchema>,
  password: string,
) {
  const joiningDate = new Date(`${input.dateOfJoining}T00:00:00.000Z`);
  const joiningYear = joiningDate.getUTCFullYear();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const latest = await transaction.employeeProfile.findFirst({
          where: { joiningYear },
          orderBy: { joiningSerial: "desc" },
          select: { joiningSerial: true },
        });
        const joiningSerial = (latest?.joiningSerial ?? 0) + 1;
        return transaction.user.create({
          data: {
            email: input.email,
            loginId: loginIdFor(input.firstName, input.lastName, joiningYear, joiningSerial),
            passwordHash: await hashPassword(password),
            role: "EMPLOYEE",
            employee: {
              create: {
                employeeCode: input.employeeCode,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                department: input.department,
                jobTitle: input.jobTitle,
                dateOfJoining: joiningDate,
                joiningYear,
                joiningSerial,
              },
            },
          },
          include: { employee: true },
        });
      });
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  throw new Error("Could not allocate a unique employee Login ID.");
}

router.get("/employees/me", requireAuth, requireRole("EMPLOYEE"), async (_req, res, next) => {
  try {
    const auth = res.locals.auth as AuthTokenPayload;
    const employee = await prisma.employeeProfile.findUnique({
      where: { userId: auth.userId },
      include: { user: true },
    });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    res.json(serializeEmployee(employee));
  } catch (error) {
    next(error);
  }
});

router.patch("/employees/me", requireAuth, requireRole("EMPLOYEE"), async (req, res, next) => {
  try {
    const input = updateMyProfileSchema.parse(req.body);
    if (!hasUpdateFields(input)) {
      res.status(400).json({ error: "At least one profile field is required." });
      return;
    }
    const auth = res.locals.auth as AuthTokenPayload;
    const existing = await prisma.employeeProfile.findUnique({ where: { userId: auth.userId } });
    if (!existing) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const employee = await prisma.employeeProfile.update({
      where: { userId: auth.userId },
      data: input,
      include: { user: true },
    });
    res.json(serializeEmployee(employee));
  } catch (error) {
    next(error);
  }
});

router.get("/employees", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(employees.map(serializeEmployee));
  } catch (error) {
    next(error);
  }
});

router.post("/employees", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const input = createEmployeeSchema.parse(req.body);
    const password = initialPassword();
    const user = await createEmployeeWithSerial(input, password);
    res.status(201).json({
      employee: user.employee,
      user: publicUser(user),
      initialPassword: password,
      message: "Share the initial password securely. It will not be shown again.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/employees/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const employee = await prisma.employeeProfile.findUnique({
      where: { id: String(req.params.id) },
      include: { user: true },
    });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    res.json(serializeEmployee(employee));
  } catch (error) {
    next(error);
  }
});

router.patch("/employees/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const input = updateEmployeeSchema.parse(req.body);
    if (!hasUpdateFields(input)) {
      res.status(400).json({ error: "At least one profile field is required." });
      return;
    }
    const existing = await prisma.employeeProfile.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const { email, ...profile } = input;
    const employee = await prisma.employeeProfile.update({
      where: { id: existing.id },
      data: {
        ...profile,
        ...(email !== undefined ? { user: { update: { email } } } : {}),
      },
      include: { user: true },
    });
    res.json(serializeEmployee(employee));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      res.status(409).json({ error: uniqueConflictMessage(error) });
      return;
    }
    next(error);
  }
});

export default router;
