import { randomBytes } from "node:crypto";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "@workspace/db";
import { hashPassword } from "../lib/auth";
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

function initialPassword(): string {
  return `Df!${randomBytes(9).toString("base64url")}`;
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

export default router;