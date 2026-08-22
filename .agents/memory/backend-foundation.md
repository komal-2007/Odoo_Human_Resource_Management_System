---
name: Backend foundation
description: Durable choices for the Dayflow HRMS backend foundation.
---

Dayflow uses Prisma with PostgreSQL as the source of truth for persistence. The initial schema intentionally covers identity, employee profiles, attendance, leave, payroll, and salary components while business endpoints are added incrementally.

**Why:** The project explicitly requested a beginner-friendly Node/Express/PostgreSQL/Prisma stack and asked to defer full feature implementation.

**How to apply:** Keep future API work behind the existing `/api` mount, use the shared Prisma client, and update the OpenAPI contract before adding client-facing endpoints.