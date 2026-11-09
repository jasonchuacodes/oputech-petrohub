# Petromate

Petromate is a mobile-first, multi-tenant station operations application centered on shift report generation. Reports capture financial entries, fuel disposal readings, item sales, assigned employees, and immutable submitted totals.

## Stack

- Client: React, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, and Radix primitives.
- Server: NestJS with REST authentication and a GraphQL domain API.
- Database: MongoDB through Mongoose. A replica set is mandatory for report transactions.
- Authentication: opaque server sessions in secure HTTP-only cookies with session-bound CSRF tokens.

## Workspace

```text
app/client  React application
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
pnpm --dir app/server bootstrap:admin
pnpm dev
```

Before running `bootstrap:admin`, replace the bootstrap password and tenant values in `app/server/.env`. The client runs on `http://localhost:5173`; the server runs on `http://localhost:3000` by default.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The server integration tests provision an isolated in-memory MongoDB replica set.
