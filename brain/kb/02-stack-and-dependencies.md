# Stack and Dependencies

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Runtime stack: Electron, Next.js, React, TypeScript, Tailwind CSS, Prisma, SQLite.
- UI/data libraries include `lucide-react`, `date-fns`, `recharts`, `xlsx`, `clsx`, and `zod`.
- Dev tooling includes `electron-builder`, `concurrently`, `wait-on`, `tsx`, ESLint, and TypeScript.
- Scripts include `dev`, `dev:web`, `build`, `build:electron`, Prisma generate/migrate/studio, seed, backup, and lint.

## Important files inspected

- `package.json` — dependencies, scripts, build config.
- `next.config.mjs` — Next config exists.
- `tailwind.config.ts` — Tailwind config exists.
- `tsconfig.json` — TypeScript config exists.

## Assumptions

- `npm` is the current package manager because no lockfile from another manager was found in the inspected file list.

## Unknowns / documentation gaps

- Exact installed dependency versions are `latest` in `package.json`, so reproducibility depends on the lockfile state.
- No CI configuration was found during initialization.

## Maintenance notes

- Update this file when adding dependencies, scripts, or build tools.
