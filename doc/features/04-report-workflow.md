# Phase 4: Report workflow

## Goal

Deliver the primary Petromate workflow for preparing, submitting, reviewing, and correcting shift reports.

## Overview

- Create and list tenant-scoped draft reports.
- Capture shift details, assigned employees, fuel readings, financial entries, and item sales.
- Save drafts with revision checks to prevent lost updates.
- Calculate totals on the server using decimal-safe arithmetic.
- Submit a report in a MongoDB transaction and store an immutable snapshot.
- Apply inventory and meter effects in the same transaction.
- Emit report activity only after successful creation or submission.
- Prohibit edits and deletion after submission.
- Correct submitted reports through void and replacement operations.

## Outcome

Users can complete the full report lifecycle with auditable, immutable submitted data and transactionally consistent operational effects.
