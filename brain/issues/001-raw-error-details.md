---
id: 001
title: Raw error details returned to client in server actions
severity: P2
area: security
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - app/actions/employees.ts
  - app/actions/materials.ts
  - app/actions/products.ts
  - app/actions/sales.ts
  - app/actions/shops.ts
  - app/actions/transfers.ts
  - app/actions/backup.ts
related: []
---

## Summary

Many server actions catch exceptions and return the raw `err.message` to the client. This can potentially leak database structure details, query shapes, or internal file paths to the user.

## Evidence

- `app/actions/employees.ts:26` — `return { error: err.message };`
- `app/actions/materials.ts:26` — `return { error: err.message };`
- `app/actions/products.ts:26` — `return { error: err.message };`
- `app/actions/sales.ts:111` — `return { error: err.message };`
- `app/actions/shops.ts:24` — `return { error: err.message };`
- `app/actions/transfers.ts:95` — `return { error: err.message };`
- `app/actions/backup.ts:58` — `return { error: err.message };`

## Suggested fix

1. Implement a structured error handling approach (e.g. returning standard user-friendly error messages).
2. Log the raw error on the server side using `console.error` or a logging tool.
3. Replace `{ error: err.message }` with `{ error: "An unexpected error occurred." }` unless it's a known, safe validation error message.

## Acceptance criteria

- [ ] All server actions returning `err.message` are updated to log the error internally and return a safe message.
- [ ] Ensure validation errors (if any) remain descriptive but do not leak system internals.
