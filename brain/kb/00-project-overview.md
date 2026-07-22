# Project Overview

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- The project is named `thakur-ice-cream-manager` in `package.json`.
- It is an offline desktop inventory and employee management system for Thakur Ice Cream.
- The app targets a single owner/admin and local data storage.
- Current modules include dashboard, inventory, shops, transfers, employees, reports, analytics, and settings.
- The README says the app uses local SQLite at `prisma/dev.db` during first run.

## Important files inspected

- `README.md` — project purpose, first-run commands, current modules, next build steps.
- `package.json` — app metadata, scripts, dependencies, Electron Builder config.
- `app/page.tsx` — dashboard summary and snapshots.
- `components/Sidebar.tsx` — navigation modules.

## Assumptions

- The owner/admin is the only user for the initial release.
- The app is intended for Windows packaging first.

## Unknowns / documentation gaps

- Exact production installation and database location are not finalized.
- Optional admin login requirements are not finalized.

## Maintenance notes

- Update this file when the product scope, target user, or major modules change.
