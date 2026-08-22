import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { Prisma } from "@prisma/client";

process.env.DATABASE_URL ||=
  "postgresql://payroll:payroll@127.0.0.1:5432/payroll_test";
process.env.JWT_SECRET ||= "payroll-test-jwt-secret";

const {
  calculatePayrollTotals,
  createPayrollSchema,
  isUniquePayPeriodConflict,
  parseDateOnly,
  validatePayPeriod,
} = await import("./payroll.ts");

function money(totals: {
  grossSalary: Prisma.Decimal;
  deductions: Prisma.Decimal;
  netSalary: Prisma.Decimal;
}) {
  return {
    grossSalary: Number(totals.grossSalary),
    deductions: Number(totals.deductions),
    netSalary: Number(totals.netSalary),
  };
}

const validCreateBody = {
  employeeId: "emp-1",
  payPeriodStart: "2026-01-01",
  payPeriodEnd: "2026-01-31",
  basicSalary: 50000,
  components: [] as Array<{ name: string; type: "EARNING" | "DEDUCTION"; amount: number }>,
};

{
  const totals = calculatePayrollTotals(50000, [
    { name: "Allowance", type: "EARNING", amount: 5000 },
    { name: "Deduction", type: "DEDUCTION", amount: 2000 },
  ]);
  assert.deepEqual(money(totals), {
    grossSalary: 55000,
    deductions: 2000,
    netSalary: 53000,
  });
}

{
  const totals = calculatePayrollTotals(40000, [
    { name: "Housing", type: "EARNING", amount: 3000 },
    { name: "Travel", type: "EARNING", amount: 1500 },
    { name: "Advance", type: "DEDUCTION", amount: 800 },
    { name: "Loan", type: "DEDUCTION", amount: 1200 },
  ]);
  assert.deepEqual(money(totals), {
    grossSalary: 44500,
    deductions: 2000,
    netSalary: 42500,
  });
}

{
  const totals = calculatePayrollTotals(50000, []);
  assert.deepEqual(money(totals), {
    grossSalary: 50000,
    deductions: 0,
    netSalary: 50000,
  });
}

assert.throws(() =>
  createPayrollSchema.parse({
    ...validCreateBody,
    basicSalary: -1,
  }),
);

assert.throws(() =>
  createPayrollSchema.parse({
    ...validCreateBody,
    components: [{ name: "Bonus", type: "EARNING", amount: -5 }],
  }),
);

{
  let threw = false;
  try {
    validatePayPeriod("2026-02-01", "2026-01-01");
  } catch (error) {
    threw = true;
    assert.equal((error as Error).message, "payPeriodStart cannot be after payPeriodEnd.");
    assert.equal((error as Error & { status?: number }).status, 400);
  }
  assert.equal(threw, true);
}

assert.throws(() =>
  createPayrollSchema.parse({
    ...validCreateBody,
    payPeriodStart: "not-a-date",
  }),
);
assert.throws(() =>
  createPayrollSchema.parse({
    ...validCreateBody,
    payPeriodEnd: "2026-13-40",
  }),
);
{
  let threw = false;
  try {
    parseDateOnly("2026-02-30");
  } catch (error) {
    threw = true;
    assert.equal((error as Error).message, "Dates must be valid calendar dates.");
    assert.equal((error as Error & { status?: number }).status, 400);
  }
  assert.equal(threw, true);
}

{
  const duplicate = new Prisma.PrismaClientKnownRequestError(
    "Unique constraint failed",
    {
      code: "P2002",
      clientVersion: "6.19.0",
      meta: {
        modelName: "PayrollRecord",
        target: ["employeeId", "payPeriodStart", "payPeriodEnd"],
      },
    },
  );
  assert.equal(isUniquePayPeriodConflict(duplicate), true);
  assert.equal(isUniquePayPeriodConflict(new Error("other")), false);
}

const { prisma } = await import("@workspace/db");
const { createAccessToken } = await import("../lib/auth.ts");
const { default: app } = await import("../app.ts");

const originalFindUnique = prisma.employeeProfile.findUnique;
const originalCreate = prisma.payrollRecord.create;

prisma.employeeProfile.findUnique = (async () => ({
  id: "emp-1",
})) as typeof prisma.employeeProfile.findUnique;

prisma.payrollRecord.create = (async () => {
  throw new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "6.19.0",
    meta: {
      modelName: "PayrollRecord",
      target: ["employeeId", "payPeriodStart", "payPeriodEnd"],
    },
  });
}) as typeof prisma.payrollRecord.create;

const server = app.listen(0);
try {
  const address = server.address() as AddressInfo;
  const token = createAccessToken({ userId: "admin-1", role: "ADMIN" });
  const response = await fetch(`http://127.0.0.1:${address.port}/api/payroll`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      employeeId: "emp-1",
      payPeriodStart: "2026-01-01",
      payPeriodEnd: "2026-01-31",
      basicSalary: 50000,
      components: [],
    }),
  });
  assert.equal(response.status, 409);
  const body = (await response.json()) as { error: string };
  assert.equal(
    body.error,
    "A payroll record already exists for this employee and pay period.",
  );
} finally {
  prisma.employeeProfile.findUnique = originalFindUnique;
  prisma.payrollRecord.create = originalCreate;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

console.log("payroll tests passed");
