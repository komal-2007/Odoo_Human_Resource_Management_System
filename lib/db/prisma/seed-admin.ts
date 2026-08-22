import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an admin.");
}

if (password.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", mustChangePassword: false },
    create: {
      email,
      loginId: email,
      passwordHash,
      role: "ADMIN",
      mustChangePassword: false,
    },
  });
  console.log(`Admin account ready: ${user.email}`);
} finally {
  await prisma.$disconnect();
}