import assert from "node:assert/strict";
import { buildLoginId, companyInitials } from "./loginId.ts";

assert.equal(companyInitials("Odoo India"), "OI");
assert.equal(companyInitials("Dayflow Technologies"), "DT");

assert.equal(
  buildLoginId({
    companyName: "Odoo India",
    firstName: "John",
    lastName: "Doe",
    joiningYear: 2022,
    serial: 1,
  }),
  "OIJODO20220001",
);

assert.equal(
  buildLoginId({
    companyName: "Odoo India",
    firstName: "John",
    lastName: "Doe",
    joiningYear: 2022,
    serial: 2,
  }),
  "OIJODO20220002",
);

assert.equal(
  buildLoginId({
    companyName: "Odoo India",
    firstName: "Jane",
    lastName: "Roe",
    joiningYear: 2023,
    serial: 1,
  }),
  "OIJARO20230001",
);

console.log("loginId tests passed");
