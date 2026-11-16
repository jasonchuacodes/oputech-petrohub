# Phase 2: User provisioning

## Goal

Allow account holders and authorized administrators to create and manage station users.

## Overview

- Create admin and member accounts under the superadmin's account.
- Assign admins to one or more tenants.
- Assign each member to exactly one tenant.
- Allow authorized administrators to set user passwords and users to change their own password.
- Allow permitted role and tenant-assignment updates.
- Allow owners and administrators to deactivate manageable users for the current tenant with an
  immutable reason and tenant-local effective date. Scheduled deactivations remain operational until
  their cutoff; inactive assignments remain available through the management history view.
- Revoke active sessions when credentials or global access-sensitive fields change. Tenant
  deactivation removes only that tenant from effective access and leaves other tenant access intact.
- Provide tenant-scoped user lists and mobile-friendly management forms.

## Outcome

Each station can be staffed without direct database changes, while ownership and assignment constraints remain enforced by the server and database schema.
