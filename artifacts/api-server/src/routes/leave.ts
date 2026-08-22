import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "@workspace/db";
import { requireAuth, requireRole } from "../middlewares/auth";
import { publicUser } from "./auth";

const router: IRouter = Router();

const leaveTypeSchema = z.enum(["ANNUAL", "SICK", "CASUAL", "UNPAID", "OTHER"]);
const createLeaveSchema = z.object({
  leaveType: leaveTypeSchema,
  startDate: z.string().date(),
  endDate: z.string().date(),
  reason: z.string().trim().min(1).max(1000),
});
const decisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

function parseDateOnly(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    const error = new Error("Dates must be valid calendar dates.");
(error as Error & { status?: number }).status = 400;
throw error;
  }
  return date;
}

function validateDateRange(startDate: string, endDate: string) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (start > end) {
    const error = new Error("startDate cannot be after endDate.");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
  return { start, end };
}

function serializeLeaveRequest(request: {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
  reviewedAt: Date | null;
  reviewedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  employee?: { id: string; user: { id: string; loginId: string; email: string; role: "ADMIN" | "EMPLOYEE"; mustChangePassword: boolean }; firstName: string; lastName: string; employeeCode: string } | null;
}) {
  return {
    ...request,
    startDate: request.startDate.toISOString().slice(0, 10),
    endDate: request.endDate.toISOString().slice(0, 10),
    employee: request.employee
      ? {
          id: request.employee.id,
          employeeCode: request.employee.employeeCode,
          firstName: request.employee.firstName,
          lastName: request.employee.lastName,
          user: publicUser(request.employee.user),
        }
      : undefined,
  };
}

router.post("/leave-requests", requireAuth, requireRole("EMPLOYEE"), async (req, res, next) => {
  try {
    const input = createLeaveSchema.parse(req.body);
    const { start, end } = validateDateRange(input.startDate, input.endDate);
    const auth = res.locals.auth as { userId: string };
    const employee = await prisma.employeeProfile.findUnique({ where: { userId: auth.userId } });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const request = await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveType: input.leaveType,
        startDate: start,
        endDate: end,
        reason: input.reason,
      },
    });
    res.status(201).json(serializeLeaveRequest(request));
  } catch (error) {
    next(error);
  }
});

router.get("/leave-requests/me", requireAuth, requireRole("EMPLOYEE"), async (_req, res, next) => {
  try {
    const auth = res.locals.auth as { userId: string };
    const employee = await prisma.employeeProfile.findUnique({ where: { userId: auth.userId } });
    if (!employee) {
      res.status(404).json({ error: "Employee profile not found." });
      return;
    }
    const requests = await prisma.leaveRequest.findMany({
      where: { employeeId: employee.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests.map(serializeLeaveRequest));
  } catch (error) {
    next(error);
  }
});

router.get("/leave-requests", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      include: {
        employee: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests.map(serializeLeaveRequest));
  } catch (error) {
    next(error);
  }
});

router.patch("/leave-requests/:id/status", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const input = decisionSchema.parse(req.body);
    const auth = res.locals.auth as { userId: string };
    const existing = await prisma.leaveRequest.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      res.status(404).json({ error: "Leave request not found." });
      return;
    }
    if (existing.status !== "PENDING") {
      res.status(409).json({ error: "Only pending leave requests can be decided." });
      return;
    }
    const request = await prisma.leaveRequest.update({
      where: { id: existing.id },
      data: { status: input.status, reviewedAt: new Date(), reviewedById: auth.userId },
    });
    res.json(serializeLeaveRequest(request));
  } catch (error) {
    next(error);
  }
});

export default router;