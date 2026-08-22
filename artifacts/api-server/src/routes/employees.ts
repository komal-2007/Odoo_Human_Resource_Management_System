import { randomBytes } from "node:crypto";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "@workspace/db";
import { hashPassword } from "../lib/auth";
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
});

async function uniqueLoginId(): Promise<string> {
  for (;;) {
    const loginId = `DF-${randomBytes(4).toString("hex").toUpperCase()}`;
    if (!(await prisma.user.findUnique({ where: { loginId } }))) return loginId;
  }
}

function initialPassword(): string {
  return `Df!${randomBytes(9).toString("base64url")}`;
}

router.use(requireAuth, requireRole("ADMIN"));

router.get("/employees", async (_req, res, next) => {
  try {
    const employees = await prisma.employeeProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(employees.map(({ user, ...employee }) => ({ ...employee, user: publicUser(user) })));
  } catch (error) {
    next(error);
  }
});

router.post("/employees", async (req, res, next) => {
  try {
    const input = createEmployeeSchema.parse(req.body);
    const password = initialPassword();
    const user = await prisma.user.create({
      data: {
        email: input.email,
        loginId: await uniqueLoginId(),
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
          },
        },
      },
      include: { employee: true },
    });
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

export default router;