# Architecture

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- UI routes live under `app/` using Next.js App Router.
- Shared UI components live under `components/`.
- Data helpers live under `lib/`.
- Prisma schema and seed data live under `prisma/`.
- Electron files live under `electron/`.
- The Electron main process creates one BrowserWindow and loads `http://localhost:3000`.
- Electron preload exposes `window.thakurApp.version` with version `0.1.0`.
- Database access uses a singleton Prisma client from `lib/prisma.ts`.

## Important files inspected

- `app/layout.tsx` — sidebar and main layout.
- `electron/main.ts` — desktop window creation and dev-server load.
- `electron/preload.ts` — minimal context bridge.
- `lib/prisma.ts` — Prisma client singleton.

## Assumptions

- Server components currently query Prisma directly for read-only pages.
- Mutations should probably use server actions or route handlers colocated by domain.

## Unknowns / documentation gaps

- Production Electron loading strategy is unresolved.
- No route handlers or server actions exist yet for CRUD workflows.

## Maintenance notes

- Update this file when data flow, Electron startup, routing, or module boundaries change.
