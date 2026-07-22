# Features

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- The codebase has foundations for dashboard, inventory, shops, transfers, employees, reports, analytics, settings, and backups.
- Most modules are read-only at initialization time.

## Feature index

| ID | Feature | Doc | Status |
| --- | --- | --- | --- |
| 001 | Dashboard | [features/001-dashboard.md](features/001-dashboard.md) | draft |
| 002 | Inventory | [features/002-inventory.md](features/002-inventory.md) | draft |
| 003 | Shops and Transfers | [features/003-shops-and-transfers.md](features/003-shops-and-transfers.md) | draft |
| 004 | Employees and Finance | [features/004-employees-and-finance.md](features/004-employees-and-finance.md) | draft |
| 005 | Reports and Analytics | [features/005-reports-and-analytics.md](features/005-reports-and-analytics.md) | draft |
| 006 | Backup and Security | [features/006-backup-and-security.md](features/006-backup-and-security.md) | draft |

## Important files inspected

- `README.md` — current modules and next build steps.
- `app/*/page.tsx` — current feature pages.
- `lib/dashboard.ts`, `lib/finance.ts`, `scripts/backup.ts` — feature logic.

## Assumptions

- Product management should be the next implementation slice because it feeds stock, transfers, reports, and analytics.

## Unknowns / documentation gaps

- No detailed acceptance tests exist for the features yet.

## Maintenance notes

- Link every new feature document here.
