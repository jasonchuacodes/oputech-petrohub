# Petromate

Petromate is a mobile-first, multi-tenant station operations application centered on shift report generation. Reports capture financial entries, fuel disposal readings, item sales, assigned employees, and immutable submitted totals.

## Stack

- Client: Next.js, React, TanStack Query, React Hook Form, Zod, Tailwind CSS, and Radix primitives.
- Server: NestJS with REST authentication and a GraphQL domain API.
- Database: MongoDB through Mongoose. A replica set is mandatory for report transactions.
- Authentication: short-lived bearer access tokens with rotating, path-scoped HTTP-only refresh cookies and persisted session revocation.

## Workspace

```text
app/client  Next.js application
app/server  NestJS application
docs        Product and architecture documentation
```

## Local setup

Requirements: Node.js 20.19+, pnpm, Docker, and Docker Compose.

```bash
pnpm install
docker compose up -d
cp app/server/.env.example app/server/.env
cp app/client/.env.example app/client/.env
pnpm --dir app/server db:indexes
pnpm dev
```

To clear selected development collections while preserving their indexes, pass one or more
collection flags. Clearing tenants also hard-deletes their tenant-owned records and cleans up
account assignments.

```bash
pnpm db:clear -- --sessions --member-activities
pnpm db:clear -- --tenants
pnpm db:clear -- --all
```

After the server starts, register the initial superadmin from another terminal:

```bash
pnpm register-superadmin -- --username admin --password 'StrongPassword123'
```

Set a strong `SUPERADMIN_SCRIPT_SECRET` in `app/server/.env` before running the command. The command only creates the superadmin account; after signing in, the onboarding flow creates its first tenant. The client runs on `http://localhost:5173`; the server runs on `http://localhost:3000` by default.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The server integration tests provision an isolated in-memory MongoDB replica set.

## GraphQL Codegen

The server schema is the source of truth for generated backend resolver contracts and frontend typed operation documents.

```bash
pnpm generate:graphql
pnpm generate:graphql:watch
```

Client operations are colocated as `.graphql` files under their owning feature. Generated files under `app/server/src/generated` and `app/client/src/generated` must not be edited manually. Root `dev`, `typecheck`, `test`, and `build` commands regenerate them automatically.
