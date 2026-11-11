# Petromate architecture

## Boundaries

- `/api/auth/session` is the REST session boundary. It issues bearer access tokens and rotates a path-scoped HTTP-only refresh cookie.
- `/graphql` serves authenticated domain queries and mutations.
- Every tenant-owned domain operation is protected by access-token and tenant-access guards and remains tenant-scoped in its database query.
- TanStack Query is the client source of truth for remote state.

## Server

The server uses NestJS feature modules and Mongoose. Controllers and resolvers validate transport input, guards establish the actor and tenant context, and use cases own transactions and domain transitions. Models are not exported across feature boundaries.

MongoDB must run as a replica set. Application startup and readiness checks reject a deployment that cannot support transactions. Production indexes are created explicitly with `pnpm --dir app/server db:indexes`; application startup does not drop or synchronize indexes.

Short-lived bearer access tokens are paired with rotating, path-scoped HTTP-only refresh cookies. Persisted sessions enforce refresh rotation, absolute expiry, user status, credential version, revocation, and tenant access server-side. Sensitive REST and GraphQL responses are marked `no-store`.

### Roles and tenant ownership

- `superadmin` is the account holder. A tenant stores its required `accountHolderId`, giving one superadmin ownership of many tenants.
- `admin` has tenant administration permissions but is not the account holder. An admin requires an `accountHolderId` and at least one assigned `tenantIds` entry.
- `member` represents station staff and employees. A member requires an `accountHolderId` and exactly one assigned tenant.
- Superadmin access derives from owned tenants; admin and member access derives from assignments under the same account holder.

Mongo identifiers use `Types.ObjectId` internally and the shared GraphQL `ObjectId` scalar. The scalar validates ObjectId inputs and serializes them as canonical hexadecimal strings.

### GraphQL Codegen

`app/server/src/graphql/**/*.graphql` is the GraphQL source of truth. Running `pnpm generate:graphql` creates:

- Backend schema and resolver contracts in `app/server/src/generated/graphql.ts`.
- Frontend operation types and typed document nodes in `app/client/src/generated/graphql.ts`.

Frontend operations are colocated under `app/client/src/features/<feature>/graphql/*.graphql`. Backend resolvers use generated schema result contracts, while frontend query functions pass generated typed documents directly to `graphql-request`. Generated files are never edited manually.

### Code conventions

TypeScript enum keys are uppercase and their persisted string values are lowercase, for example `SUPERADMIN = 'superadmin'` and `IN_PROGRESS = 'in_progress'`.

Tenant discovery and authorization use `TenantService.listForUser(user)` and `TenantService.assertAccess(user, tenantId)`. The tenant-access guard attaches the validated tenant so downstream operations do not repeat the lookup.

## Client

The client uses the Next.js App Router. Public, protected, and private route groups separate sign-in, authenticated transition flows, and the station-aware application shell. Phone layouts use bottom navigation, tablet layouts use a compact rail, and wide desktop layouts use a sidebar. UI primitives are adapted from Oputech Sales while retaining Petromate-specific workflows.

Server data belongs in TanStack Query. Form drafts belong in React Hook Form. Shareable filters belong in the URL. Sheets and menus use local state.

## Report direction

Reports are aggregate documents. Draft content is editable with revision checks. Submission creates an immutable snapshot and applies inventory and meter effects in one transaction. Submitted reports are corrected through void/replacement workflows rather than edits or deletion. Tenant-configured recurring income fields are copied into reports at creation with stable source identifiers; archived or renamed configuration never rewrites existing reports.

Dashboard values will be aggregated directly from effective submitted snapshots; there are no rollup collections.

`MemberActivity` is currently limited to idempotent `report.created` records and is not a security audit log.
