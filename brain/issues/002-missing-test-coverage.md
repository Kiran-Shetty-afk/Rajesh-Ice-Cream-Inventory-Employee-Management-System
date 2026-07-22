---
id: 002
title: Missing test coverage for all core areas
severity: P2
area: testing
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - app/
  - components/
  - lib/
related: []
---

## Summary

There are currently zero test files (*.test.ts, *.spec.ts, etc.) in the `app/`, `components/`, and `lib/` directories. This introduces a risk of undetected regressions as the codebase grows.

## Evidence

- Scanning for `*.test.ts*` or `*.spec.ts*` across the repository yielded no results.
- `app/` contains critical business logic in Server Actions (e.g. `actions/sales.ts`, `actions/employees.ts`).

## Suggested fix

1. Install and configure a testing framework (e.g. Vitest or Jest, plus React Testing Library).
2. Add a `test` script in `package.json`.
3. Create unit tests for critical shared utilities in `lib/`.
4. Create integration tests for the primary server actions.

## Acceptance criteria

- [ ] A test runner is configured and working in the repository.
- [ ] At least one test exists for a core library function.
- [ ] At least one test exists for a core server action.
