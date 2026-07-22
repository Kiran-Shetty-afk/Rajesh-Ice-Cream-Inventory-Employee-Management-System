# Testing and Quality

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- No test directories or test config files were found during initialization.
- `package.json` provides `npm run build` and `npm run lint`.
- Business logic helpers exist in `lib/finance.ts` and `lib/dashboard.ts`.

## Important files inspected

- `package.json` — scripts and dev dependencies.
- `lib/finance.ts` — salary, bonus, currency formatting.
- `lib/dashboard.ts` — aggregate calculations.

## Assumptions

- Initial tests should focus on salary/bonus calculations and stock transfer validation once mutations are added.

## Unknowns / documentation gaps

- The project has no documented test strategy.
- The current lint command may need confirmation against the installed Next.js version.

## Maintenance notes

- Update this file when adding test tooling, QA workflows, or quality gates.

## Unit and Component Testing

Vitest and @testing-library/react are used for tests. Run tests via 
pm run test. Configuration is in itest.config.ts. Tests are co-located with files (e.g. ile.test.ts).

