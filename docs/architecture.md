# Petromate architecture

## Boundaries

- `/api/auth/*` is the cookie-based REST authentication boundary.
- `/graphql` serves authenticated domain queries and mutations.
- Every tenant-owned domain operation is protected by session and membership guards and remains tenant-scoped in its database query.
- TanStack Query is the client source of truth for remote state.

## Server

The server uses NestJS feature modules and Mongoose. Controllers and resolvers validate transport input, guards establish the actor and tenant context, and use cases own transactions and domain transitions. Models are not exported across feature boundaries.

MongoDB must run as a replica set. Application startup and readiness checks reject a deployment that cannot support transactions. Production indexes are created explicitly with `pnpm --dir app/server db:indexes`; application startup does not drop or synchronize indexes.

Opaque session tokens are hashed before storage. Session expiry, user status, credential version, CSRF, and tenant membership are checked server-side. Sensitive REST and GraphQL responses are marked `no-store`.

## Client

The client uses Vite and React Router. Phone layouts use bottom navigation, tablet layouts use a compact rail, and wide desktop layouts use a sidebar. UI primitives are adapted from Oputech Sales while retaining Petromate-specific workflows.

Server data belongs in TanStack Query. Form drafts belong in React Hook Form. Shareable filters belong in the URL. Sheets and menus use local state.

## Report direction

Reports are aggregate documents. Draft content is editable with revision checks. Submission creates an immutable snapshot and applies inventory and meter effects in one transaction. Submitted reports are corrected through void/replacement workflows rather than edits or deletion.

Dashboard values will be aggregated directly from effective submitted snapshots; there are no rollup collections.

`MemberActivity` is currently limited to idempotent `report.created` records and is not a security audit log.
