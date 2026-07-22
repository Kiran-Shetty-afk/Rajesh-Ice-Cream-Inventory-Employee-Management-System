---
id: "007"
title: "Production Release Final Sprint (Auth, Packaging, CRUD)"
tier: full-feature
type: feature
status: proposed
source: kenmark-plan
created: 2026-07-22
files:
  - electron/main.ts
  - electron/preload.ts
  - app/actions/auth.ts
  - app/actions/employees.ts
  - app/actions/shops.ts
  - components/LoginForm.tsx
  - package.json
related_issues: []
related_plans:
  - "006"
---

# Plan — Production Release Final Sprint (Auth, Packaging, CRUD)

## Summary
The final push to make the application 100% production-ready for the factory. We will introduce a local PIN/Password lock screen to protect sensitive routes, fully flesh out the missing Edit/Delete UI for entities, and package the final Windows `.exe` installer using Electron Builder.

## Goal
To deliver a secure, standalone, easily installable desktop application that offers full CRUD operations for all entities and requires authentication to access financials and stock data.

## Current understanding
- The app uses Next.js 16 and Electron.
- All core business logic (transfers, dashboard, operations calendar) is complete.
- There is currently no authentication layer; opening the app grants full admin access.
- `package.json` contains `build:electron` but a robust `electron-builder` configuration for Windows (`.exe`) needs to be fully tested and executed.
- Creation forms exist, but older modules lack inline edit/delete modals or actions.

## Recommended approach
- **Authentication**: Create a hardcoded (or DB-stored single-user) Admin PIN hash using standard bcrypt/cookie-based session in Next.js Server Actions, or an Electron IPC lock screen. Given it's a local desktop app, a Next.js middleware + cookie approach is the simplest and most robust.
- **CRUD**: Audit existing components and inject a standard "Edit" and "Delete" dropdown menu into the tables.
- **Packaging**: Update `electron-builder.yml` to target Windows NSIS, run the build pipeline, and generate the final `Setup.exe` in a `dist/` folder.

## Phased plan

### Phase 1 — Authentication & Security
- [ ] Add `Admin` table or a simple `.env` hashed PIN.
- [ ] Create a `/login` route with a `LoginForm` component.
- [ ] Implement Next.js Middleware to protect all routes (except `/login` and API routes) by checking for an auth cookie.
- [ ] Implement `app/actions/auth.ts` to handle login and cookie setting.

### Phase 2 — Full Edit/Delete Support
- [ ] Audit `Shops`, `Employees`, and `Products` tables.
- [ ] Add `lucide-react` edit/trash icons to table rows.
- [ ] Implement Server Actions for Edit and Delete (with referential integrity checks).
- [ ] Hook UI components to actions using `withErrorHandling`.

### Phase 3 — Electron Windows Packaging
- [ ] Ensure `electron-builder` is installed as a devDependency.
- [ ] Configure Windows NSIS installer in `package.json` or `electron-builder.yml`.
- [ ] Test the production build (`npm run build` -> `tsc electron` -> `electron-builder`).
- [ ] Verify `dist/` folder contains a working `RajeshIcecream-Setup.exe`.

### Phase 4 — Documentation / KB update
- [ ] Update `README.md` with final installation instructions for the `.exe`.
- [ ] Update `brain/CHANGELOG.md` with final release notes.
- [ ] Mark this plan as completed in `INDEX.md`.

## Files likely involved

| File/area | Expected change |
| --- | --- |
| `middleware.ts` | **NEW** Route protection logic |
| `app/actions/auth.ts` | **NEW** Login logic |
| `app/login/page.tsx` | **NEW** Lock screen UI |
| `components/*Table.tsx` | Add edit/delete buttons |
| `package.json` | Add `electron-builder` configuration |

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Electron SQLite Pathing** | High | The Prisma SQLite database path might break when packaged inside an `app.asar`. We must ensure the `DATABASE_URL` resolves to the `userData` folder dynamically in `main.ts` so the DB persists across updates. |
| **Middleware conflicts** | Med | Next.js middleware might block Electron IPC or static asset requests if not scoped correctly. Exclude `/_next/`, `/static`, and `/api/` from the matcher. |

## Acceptance criteria

- [ ] Unauthenticated users are redirected to a lock screen.
- [ ] Authorized admin can log in and view the dashboard.
- [ ] Users can edit and delete Employees, Shops, and Products.
- [ ] `npm run dist` produces a functioning `.exe` installer.

## Commands/checks to run
- `npm run build`
- `npm run dist`
- `npm start` (to test the packaged app)
