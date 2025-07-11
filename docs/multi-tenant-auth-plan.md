# Multi-Tenant Authentication & Authorization Plan

This document outlines the step-by-step plan to evolve the existing authentication system into a fully multi-tenant solution with roles, invite-only employee signup, and seamless context propagation.

---

## 1. Database & Schema Changes

1.1. Add `Role` enum and fields on **User**  
```prisma
enum Role {
  SUPERADMIN
  ADMIN
  USER
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(USER)
  orgId         String?   // null for SUPERADMIN
  invitedBy     String?   // userId of the admin who invited
  inviteToken   String?   @unique
  inviteExpires DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

1.2. (Optional) Create an **Invite** table instead of embedding on User:  
```prisma
model Invite {
  id         String   @id @default(uuid())
  orgId      String
  email      String
  token      String   @unique
  expiresAt  DateTime
  createdBy  String   // admin userId
  createdAt  DateTime @default(now())
}
```

1.3. Ensure **Organization** model exists with:
```prisma
model Organization {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]
}
```

---

## 2. Invite-Only Employee Signup

2.1. **Admin creates invite**  
- Endpoint: `POST /api/orgs/:orgId/invites`  
- Payload: `{ email: string }`  
- Action: generate `token` + `expiresAt`, persist (User or Invite table), send email:  
  `https://app.example.com/signup/invite/{token}`  

2.2. **Invite landing page**  
- Front-end route: `GET /signup/invite/:token`  
- Call `GET /api/invites/:token` or `GET /api/auth/validate-invite?token=`  
- If valid, render signup form (password, name).  

2.3. **Complete signup**  
- Endpoint: `POST /api/auth/signup-invite`  
- Payload: `{ token, name, password }`  
- Server actions:
  - Validate token and expiry.
  - Create User with `role: USER`, `orgId` from invite, `invitedBy`.
  - Clear or delete the invite record.
  - Issue JWT containing `{ userId, role, orgId }`.

---

## 3. Admin & SuperAdmin Onboarding

3.1. **SuperAdmin**  
- Seeded via migration or environment script.  
- Has `role: SUPERADMIN`, `orgId: null`.

3.2. **Creating Admins**  
- SuperAdmin UI: `POST /api/admins`  
  - Payload: `{ email: string, orgIds: string[] }`  
  - Creates Users with `role: ADMIN`, no invite token.  
  - Sends “set password” link (`/auth/reset-password?token=`).

---

## 4. Login & Session Flow

4.1. **Login endpoint**  
- `POST /api/auth/login` with `{ email, password }`.  
- Verify credentials, load User.  
- Include in JWT:
  ```json
  {
    "userId": "...",
    "role": "ADMIN|USER|SUPERADMIN",
    "orgId": "..."   // null for SUPERADMIN
  }
  ```

4.2. **Middleware**  
- `requireAuth`:
  - Decodes JWT, attaches `req.user = { userId, role, orgId }`.
  - Denies access if missing/expired.
- `requireRole(roles[])`:
  - Ensures `req.user.role` is allowed.
- All data-access services use `req.user.orgId` to scope queries.

---

## 5. Front-End Routing & UI

5.1. **Public routes**  
- `/login`  
- `/signup/invite/:token`

5.2. **Post-login redirect**  
- Employees (`role: USER`):
  - Redirect to `/dashboard`.
  - Front-end fetches `/api/auth/me` to get `orgId`.
- Admins (`role: ADMIN`):
  - If single `orgId`, redirect to `/admin/overview`.
  - If multiple, show `/admin/select-org` listing assigned orgs.
- SuperAdmin:
  - Redirect to `/superadmin/orgs`.

5.3. **Route structure (no orgId in path)**  
```
/dashboard/...        # employee interface, scoped via state
/admin/...            # admin interface, scoped via state
/superadmin/...       # global management
```

---

## 6. API Endpoint Overview

- `POST /api/orgs`               (SUPERADMIN)  
- `POST /api/orgs/:orgId/invites`(ADMIN)  
- `GET  /api/invites/:token`     (public)  
- `POST /api/auth/signup-invite` (public)  
- `POST /api/auth/login`         (public)  
- `GET  /api/auth/me`            (requiresAuth)  
- `GET  /api/users`              (ADMIN, scopes by orgId)  
- `GET  /api/posts`              (USER/Admin, scopes by orgId)  
- etc.

---

## 7. Implementation Steps & Milestones

1. **Schema migration**: add Role, invite fields, Organization relation.  
2. **Invite APIs**: build invite-create & validation endpoints.  
3. **Signup UI**: implement `/signup/invite/:token` page and form.  
4. **Signup endpoint**: implement token-based signup.  
5. **Login changes**: extend JWT payload, update middleware.  
6. **Front-end routing**: adjust redirect logic, remove orgId from URLs.  
7. **Admin workflows**: implement org-management UI (SuperAdmin & Admin).  
8. **Testing**: unit & integration tests for invite flow and RBAC.  
9. **Documentation**: update README, add multi-tenant auth guide.

---

End of plan.
