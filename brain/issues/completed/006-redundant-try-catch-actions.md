---
id: 006
title: Redundant try/catch error handling boilerplate in Server Actions
severity: P2
area: dx
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - app/actions/employees.ts
  - app/actions/materials.ts
  - app/actions/products.ts
  - app/actions/purchases.ts
  - app/actions/sales.ts
  - app/actions/shops.ts
  - app/actions/suppliers.ts
  - app/actions/transfers.ts
  - app/actions/wastage.ts
related: []
---

## Summary

Across all Server Actions, there is extreme boilerplate repetition of `try/catch` blocks which simply log the error via `console.error("[Action Error]:", err);` and return `{ error: "Something went wrong" }`. This bloats the codebase and makes it harder to implement uniform error reporting or observability (like Sentry) in the future.

## Evidence

- `app/actions/shops.ts:24` — `catch (err) { console.error("[Action Error]:", err); return { error: "Something went wrong" }; }`
- (And 20+ other instances across all the action files).

## Suggested fix

Create a higher-order wrapper utility (e.g., `withErrorHandling` in `lib/actions.ts`) that accepts the server action function. The wrapper will automatically execute the try/catch block, log the error, and return the standard error payload. Refactor all simple CRUD actions to be wrapped in this utility to dry up the code.

## Acceptance criteria

- [ ] `lib/actions.ts` introduces a unified `withErrorHandling` wrapper.
- [ ] At least the `app/actions/shops.ts` file is successfully refactored as a proof of concept.
