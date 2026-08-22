import { Router, type IRouter } from "express";
import { z } from "zod";

import { prisma } from "@workspace/db";

import { requireAuth, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

const dateQuerySchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function todayDate(): Date {
  const now = new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
}

function serializeAttendance(record: {
  id: string;
  employeeId: string;
  workDate: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const workedMinutes =
    record.checkIn && record.checkOut
      ? Math.max(
          0,
          Math.round(
            (record.checkOut.getTime() - record.checkIn.getTime()) / 60000,
          ),
        )
      : null;

  const extraMinutes =
    workedMinutes === null ? null : Math.max(0, workedMinutes - 480);

  return {
    id: record.id,
    employeeId: record.employeeId,
    workDate: record.workDate.toISOString().slice(0, 10),
    checkIn: record.checkIn?.toISOString() ?? null,
    checkOut: record.checkOut?.toISOString() ?? null,
    status: record.status,
    workedMinutes,
    workedHours:
      workedMinutes === null
        ? null
        : Number((workedMinutes / 60).toFixed(2)),
    extraMinutes,
    extraHours:
      extraMinutes === null
        ? null
        : Number((extraMinutes / 60).toFixed(2)),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/**
 * Employee: check in for today.
 */
router.post(
  "/attendance/check-in",
  requireAuth,
  requireRole("EMPLOYEE"),
  async (_req, res, next) => {
    try {
      const auth = res.locals.auth as { userId: string };

      const employee = await prisma.employeeProfile.findUnique({
        where: { userId: auth.userId },
      });

      if (!employee) {
        res.status(404).json({ error: "Employee profile not found." });
        return;
      }

      const workDate = todayDate();

      const existing = await prisma.attendanceRecord.findUnique({
        where: {
          employeeId_workDate: {
            employeeId: employee.id,
            workDate,
          },
        },
      });

      if (existing?.checkIn) {
        res.status(409).json({
          error: "You have already checked in for today.",
        });
        return;
      }

      const record = existing
        ? await prisma.attendanceRecord.update({
            where: { id: existing.id },
            data: {
              checkIn: new Date(),
              status: "PRESENT",
            },
          })
        : await prisma.attendanceRecord.create({
            data: {
              employeeId: employee.id,
              workDate,
              checkIn: new Date(),
              status: "PRESENT",
            },
          });

      res.status(201).json(serializeAttendance(record));
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Employee: check out for today.
 */
router.post(
  "/attendance/check-out",
  requireAuth,
  requireRole("EMPLOYEE"),
  async (_req, res, next) => {
    try {
      const auth = res.locals.auth as { userId: string };

      const employee = await prisma.employeeProfile.findUnique({
        where: { userId: auth.userId },
      });

      if (!employee) {
        res.status(404).json({ error: "Employee profile not found." });
        return;
      }

      const workDate = todayDate();

      const existing = await prisma.attendanceRecord.findUnique({
        where: {
          employeeId_workDate: {
            employeeId: employee.id,
            workDate,
          },
        },
      });

      if (!existing?.checkIn) {
        res.status(409).json({
          error: "You must check in before checking out.",
        });
        return;
      }

      if (existing.checkOut) {
        res.status(409).json({
          error: "You have already checked out for today.",
        });
        return;
      }

      const record = await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: {
          checkOut: new Date(),
        },
      });

      res.json(serializeAttendance(record));
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Employee: view own attendance.
 */
router.get(
  "/attendance/me",
  requireAuth,
  requireRole("EMPLOYEE"),
  async (req, res, next) => {
    try {
      const filters = dateQuerySchema.safeParse(req.query);

      if (!filters.success) {
        res.status(400).json({
          error: "Invalid date filters.",
          details: filters.error.message,
        });
        return;
      }

      if (
        filters.data.from &&
        filters.data.to &&
        filters.data.from > filters.data.to
      ) {
        res.status(400).json({
          error: "The from date cannot be after the to date.",
        });
        return;
      }

      const auth = res.locals.auth as { userId: string };

      const employee = await prisma.employeeProfile.findUnique({
        where: { userId: auth.userId },
      });

      if (!employee) {
        res.status(404).json({ error: "Employee profile not found." });
        return;
      }

      const requests = await prisma.attendanceRecord.findMany({
        where: {
          employeeId: employee.id,
          ...(filters.data.from || filters.data.to
            ? {
                workDate: {
                  ...(filters.data.from
                    ? { gte: parseDateOnly(filters.data.from) }
                    : {}),
                  ...(filters.data.to
                    ? { lte: parseDateOnly(filters.data.to) }
                    : {}),
                },
              }
            : {}),
        },
        orderBy: { workDate: "desc" },
      });

      res.json(requests.map(serializeAttendance));
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Admin: view attendance for all employees.
 */
router.get(
  "/attendance",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res, next) => {
    try {
      const employeeId =
        typeof req.query.employeeId === "string"
          ? req.query.employeeId
          : undefined;

      const date =
        typeof req.query.date === "string" ? req.query.date : undefined;

      if (date && !z.string().date().safeParse(date).success) {
        res.status(400).json({ error: "Invalid date." });
        return;
      }

      const records = await prisma.attendanceRecord.findMany({
        where: {
          ...(employeeId ? { employeeId } : {}),
          ...(date ? { workDate: parseDateOnly(date) } : {}),
        },
        include: {
          employee: {
            include: {
              user: true,
            },
          },
        },
        orderBy: [{ workDate: "desc" }, { createdAt: "desc" }],
      });

      res.json(
        records.map((record) => ({
          ...serializeAttendance(record),
          employee: {
            id: record.employee.id,
            employeeCode: record.employee.employeeCode,
            firstName: record.employee.firstName,
            lastName: record.employee.lastName,
            user: {
              id: record.employee.user.id,
              loginId: record.employee.user.loginId,
              email: record.employee.user.email,
              role: record.employee.user.role,
            },
          },
        })),
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;