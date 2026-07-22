# Infra and Deployment

Last updated: 2026-07-12
Status: verified

## Confirmed facts

- Electron Builder is configured for Windows NSIS packaging.
- The build script runs `next build` followed by compiling the Electron typescript wrapper.
- **Production Mode:** `electron/main.ts` spawns a programmatic Next.js server instance (`require("next")({ dev: false })`) on an ephemeral port.
- **Database Path:** In production, Prisma uses a dynamic `DATABASE_URL` pointing to `app.getPath("userData")` (`thakur-ice-cream.db`).
- **Backup Logic:** `app/actions/backup.ts` handles manual backups to the `backups/` directory located in the same data folder, keeping the latest 30 backups.

## Important files inspected

- `package.json` — build and Electron Builder configuration.
- `electron/main.ts` — Electron setup, window creation, Next.js server initialization.
- `app/actions/backup.ts` - Backup creation and retention logic.

## Assumptions

- Windows installer (`.exe`) is the sole deployment artifact. 

## Unknowns / documentation gaps

- Database migrations inside the packaged Electron app are currently not automated via Prisma CLI, so we assume `prisma db push` or similar must be run before packaging, and SQLite migrations in production might require a custom script in the future if schema changes.

## Maintenance notes

- Update this file when packaging, installer behavior, database location, env handling, or CI changes.
