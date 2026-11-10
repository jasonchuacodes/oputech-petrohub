# Phase 1: Tenant onboarding and selection

## Goal

Allow a newly registered superadmin to create a station and enter the application without manual database setup.

## Overview

- Add a superadmin-only tenant creation operation.
- Collect the station name, key, timezone, and currency.
- Show a station creation flow instead of “No station access” when a superadmin owns no tenants.
- Persist the selected station through `currentTenantId`.
- Use `tenantSelectionVersion` for optimistic concurrency when changing the selected station.
- Keep `TenantService.assertAccess()` as the authorization boundary for station selection.

## Outcome

Superadmins can create and switch between owned stations. Admins and members can switch only among assigned stations, and the selection remains consistent across devices and sessions.
