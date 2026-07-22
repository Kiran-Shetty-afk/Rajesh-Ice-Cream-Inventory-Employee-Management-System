---
id: 003
title: Missing return type annotations on exported functions
severity: P2
area: dx
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - app/actions/backup.ts
  - app/actions/transfers.ts
  - app/analytics/page.tsx
  - app/employees/page.tsx
  - app/inventory/page.tsx
  - app/reports/page.tsx
  - app/sales/page.tsx
  - app/settings/page.tsx
  - app/shops/page.tsx
  - app/transfers/page.tsx
related: []
---

## Summary

Many exported functions and top-level Page/Component components lack explicit return type annotations (e.g. `export async function createManualBackup() { ... }`). Adding return types improves developer experience, prevents accidental return type changes, and ensures stricter type-checking across the repository.

## Evidence

- `app/actions/backup.ts:8` — `export async function createManualBackup() {`
- `app/actions/transfers.ts:8` — `function generateTransferNo() {`
- `app/analytics/page.tsx:7` — `export default async function AnalyticsPage() {`
- `app/employees/page.tsx:10` — `export default async function EmployeesPage() {`
- `app/inventory/page.tsx:10` — `export default async function InventoryPage() {`

## Suggested fix

1. Audit all `export function` and `export async function` declarations.
2. Add explicit return types (e.g. `Promise<React.JSX.Element>` for async pages/components, or `Promise<ActionResult>` for server actions).
3. Enable or configure ESLint rules (`@typescript-eslint/explicit-function-return-type` or similar) to enforce this continuously if desired.

## Acceptance criteria

- [ ] All exported functions in `app/` have explicit return types.
- [ ] Internal utility functions in `actions/` and `lib/` also feature return types.
