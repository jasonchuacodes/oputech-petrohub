# Phase 2: User provisioning

## Goal

Allow account holders and authorized administrators to create and manage station users.

## Overview

- Create admin and member accounts under the superadmin's account.
- Assign admins to one or more tenants.
- Assign each member to exactly one tenant.
- Allow authorized administrators to set user passwords and users to change their own password.
- Allow permitted role, status, and tenant-assignment updates.
- Revoke active sessions when credentials or access-sensitive fields change.
- Provide tenant-scoped user lists and mobile-friendly management forms.

## Outcome

Each station can be staffed without direct database changes, while ownership and assignment constraints remain enforced by the server and database schema.
