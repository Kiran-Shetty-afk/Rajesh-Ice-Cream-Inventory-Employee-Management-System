# Backup and Security

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Route: `/settings`.
- Settings page describes backup/restore and optional admin security.
- Manual backup script copies `prisma/dev.db` into `backups/`.
- Backup script keeps the latest 30 `.db` backup files.
- `.env`, database files, and backups are gitignored.

## Important files inspected

- `app/settings/page.tsx` — settings UI.
- `scripts/backup.ts` — backup implementation.
- `.gitignore` — ignored sensitive/generated files.
- `prisma/schema.prisma` — `BackupLog` and `AppSetting` models.

## Assumptions

- Backup Now, Restore Backup, Export Database, and Import Database should eventually be available from the UI.

## Unknowns / documentation gaps

- Automatic daily backup is not wired into Electron startup.
- Restore/import flows are not implemented.
- Optional admin login is not implemented.

## Maintenance notes

- Update when backup, restore, database import/export, or login behavior changes.
