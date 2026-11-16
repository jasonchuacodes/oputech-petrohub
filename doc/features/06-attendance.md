# Phase 6: Attendance

## Goal

Track tenant-scoped employee attendance and make it available to station operations and reporting.

## Overview

- Record employee check-in and check-out events.
- Display daily attendance and timesheet summaries.
- Handle missing, corrected, and manually entered attendance records with permissions and history.
- Associate attendance with the correct tenant and employee.
- Preserve former employees' attendance after tenant deactivation. Authorized administrators may
  review this history, but inactive timesheets are read-only and inactive employees are excluded from
  operational rosters.
- Optionally surface attendance when assigning employees to a report shift.
- Keep attendance independent from payroll unless payroll becomes a separate approved phase.

## Outcome

Stations can review reliable attendance records and use them as operational context without coupling the feature to payroll calculations.
