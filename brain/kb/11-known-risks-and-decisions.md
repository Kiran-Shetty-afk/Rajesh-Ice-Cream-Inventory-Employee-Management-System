# Known Risks and Decisions

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Electron currently loads the development server URL.
- Backup currently targets `prisma/dev.db`.
- CRUD workflows and transaction-safe transfer creation are not implemented yet.
- Optional admin login is not implemented yet.

## Important files inspected

- `electron/main.ts` — dev URL load.
- `scripts/backup.ts` — dev database backup path.
- `README.md` — next build steps and product goal.
- `prisma/schema.prisma` — data model.

## Assumptions

- Hard deleting products after transfer history exists may be unsafe; inactive status may be preferable.
- Reports should reuse shared calculation code to avoid mismatched totals.

## Unknowns / documentation gaps

- No formal architecture decision records exist yet.
- Exact production database path and migration flow are undecided.

## Maintenance notes

- Add decision files under `brain/kb/decisions/` for major architecture choices.
