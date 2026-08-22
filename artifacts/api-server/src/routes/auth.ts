import { Router, type IRouter } from "express";
import { z } from "zod";
import { prisma } from "@workspace/db";
import { comparePassword, createAccessToken, hashPassword } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();
const loginSchema = z.object({
  loginId: z.string().trim().min(1),
  password: z.string().min(8),
});
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

function publicUser(user: {
  id: string;
  loginId: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  mustChangePassword: boolean;
}) {
  return {
    id: user.id,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
}

router.post("/auth/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { OR: [{ loginId: input.loginId }, { email: input.loginId }] },
    });
    if (!user || !(await comparePassword(input.password, user.passwordHash))) {
      res.status(401).json({ error: "Invalid Login ID/email or password." });
      return;
    }
    res.json({
      token: createAccessToken({ userId: user.id, role: user.role }),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/auth/me", requireAuth, async (_req, res, next) => {
  try {
    const auth = res.locals.auth as { userId: string };
    const user = await prisma.user.findUniqueOrThrow({ where: { id: auth.userId } });
    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

router.post("/auth/change-password", requireAuth, async (req, res, next) => {
  try {
    const input = changePasswordSchema.parse(req.body);
    const auth = res.locals.auth as { userId: string };
    const user = await prisma.user.findUniqueOrThrow({ where: { id: auth.userId } });
    if (!(await comparePassword(input.currentPassword, user.passwordHash))) {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(input.newPassword), mustChangePassword: false },
    });
    res.json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
});

export { publicUser };
export default router;