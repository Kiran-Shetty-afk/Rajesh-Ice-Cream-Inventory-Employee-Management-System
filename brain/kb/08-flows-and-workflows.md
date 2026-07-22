# Flows and Workflows

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- The README defines factory inventory, shop inventory, factory-to-shop transfers, employee salary/bonus, employee loans, reports, analytics, and backups as core workflows.
- Transfer history is displayed, but transfer creation is not implemented yet.
- Backup can be run from `npm run backup`, but not from the UI.

## Important files inspected

- `README.md` — workflow requirements and next build steps.
- `app/transfers/page.tsx` — transfer history view.
- `scripts/backup.ts` — manual backup behavior.

## Assumptions

- Transfers should be transactional: transfer record, item records, factory deduction, and shop addition should commit or fail together.
- Reports should share calculation helpers with dashboard logic.

## Unknowns / documentation gaps

- No restore/import workflow is implemented.
- No UI flow exists for product/shop/employee/loan creation.

## Maintenance notes

- Update this file when adding or changing owner/admin workflows.
