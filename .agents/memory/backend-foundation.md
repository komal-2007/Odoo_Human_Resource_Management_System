---
name: Backend foundation
description: Durable choices for the Dayflow HRMS backend foundation.
---

Dayflow uses Prisma with PostgreSQL as the source of truth for persistence. The initial schema intentionally covers identity, employee profiles, attendance, leave, payroll, and salary components while business endpoints are added incrementally.

**Why:** The project explicitly requested a beginner-friendly Node/Express/PostgreSQL/Prisma stack and asked to defer full feature implementation.

**How to apply:** Keep future API work behind the existing `/api` mount, use the shared Prisma client, and update the OpenAPI contract before adding client-facing endpoints.

Authentication is Admin-created only: employees do not self-register, and JWT payloads carry the user ID and role. Initial employee passwords are returned only in the creation response and are stored as bcrypt hashes.

**Why:** HR controls account provisioning and employees must be restricted to their own protected data.

**How to apply:** Use `requireAuth` for protected routes and `requireRole("ADMIN")` for HR management routes; never include password hashes in responses.

Employee Login IDs use company initials from each word of `COMPANY_NAME`, two uppercase letters from each of the first and last names, the UTC joining year, and a four-digit serial that restarts per year; joining date/year/serial are persisted.

**Why:** HRMS requires IDs such as `OIJODO20220001` (Odoo India, John Doe, 2022, first that year) to be deterministic and sequential rather than random.

**How to apply:** Require `dateOfJoining` on employee creation and allocate the next serial inside the Prisma transaction; preserve the explicit `COMPANY_NAME` environment setting. Do not rewrite Login IDs of existing users.