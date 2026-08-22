# Dayflow - Human Resource Management System

Backend foundation for employee management, attendance, leave, and payroll workflows.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run generate` — generate Prisma Client
- `pnpm --filter @workspace/db run push` — push the Prisma schema to a development database
- Required env: `DATABASE_URL` — PostgreSQL connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Prisma ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/` — Express application, routes, and server entry point
- `lib/db/prisma/schema.prisma` — source of truth for the database schema
- `lib/db/src/index.ts` — shared Prisma client and connectivity check
- `lib/api-spec/` — OpenAPI contracts for future API expansion

## Architecture decisions

- The API is mounted at `/api`; the initial health endpoint is `/api/healthz`.
- Database failures are reported as HTTP 503 with `status: "degraded"` rather than hidden.
- The schema is intentionally foundational: it models identity, employee profiles, attendance, leave, payroll, and salary components without implementing all business endpoints yet.

## Product

Dayflow will support HR officers and employees with role-aware employee management, attendance, leave approvals, and payroll data.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
