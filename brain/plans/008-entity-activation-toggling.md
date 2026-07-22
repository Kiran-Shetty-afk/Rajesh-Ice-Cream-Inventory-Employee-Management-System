---
id: "008"
title: "Entity Activation Toggling and Employee Exit Logging"
tier: full-feature
type: feature
status: proposed
source: kenmark-plan
created: 2026-07-22
files:
  - prisma/schema.prisma
  - app/actions/employees.ts
  - app/actions/products.ts
  - app/employees/page.tsx
  - app/inventory/page.tsx
---

## Summary
Implement UI toggles to mark Products and Employees as ACTIVE or INACTIVE, supporting seasonal business models and returning employees. Includes a new schema model to log employee exits along with their outstanding loan balance.

## Goal
Allow business owners to cleanly hide inactive seasonal products from daily operations without deleting them, and cleanly offboard employees while retaining their loan history in a dedicated exit log for when they return.

## Current understanding
- `ProductStatus` and `EmployeeStatus` enums already exist in Prisma with `ACTIVE` and `INACTIVE` states.
- The UI currently lacks buttons to toggle these states.
- There is no table to track *when* an employee left and how much loan they owed at that time.

## Recommended approach
Option A (Chosen): Use existing `INACTIVE` enums. Add a new Prisma model `EmployeeExitLog` to record the exact date of deactivation and the captured loan amount. Add Server Actions to handle toggling and create the log entry transactionally.

## Phased plan

### Phase 1 — Database & Actions
- [ ] Add `EmployeeExitLog` model to `schema.prisma`.
- [ ] Run `npx prisma db push` to apply changes.
- [ ] Update `app/actions/employees.ts` with `toggleEmployeeStatus(id)` which calculates remaining loan and creates an `EmployeeExitLog` if marked `INACTIVE`.
- [ ] Update `app/actions/products.ts` with `toggleProductStatus(id)`.

### Phase 2 — UI Integration
- [ ] Update Employee table in `app/employees/page.tsx` with an Active/Inactive toggle button or badge.
- [ ] Update Product table in `app/inventory/page.tsx` with an Active/Inactive toggle button.
- [ ] (Optional) Add a view to see the Employee's past exit logs in their detail modal.

## Files likely involved
| File/area | Expected change |
| --- | --- |
| `prisma/schema.prisma` | Add `EmployeeExitLog` model |
| `app/actions/employees.ts` | Add toggle logic and exit logging |
| `app/actions/products.ts` | Add toggle logic |
| `app/employees/page.tsx` | Add UI toggles |
| `app/inventory/page.tsx` | Add UI toggles |

## Risks
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Data consistency | Medium | Use Prisma transactions when toggling employee status and creating the log entry simultaneously. |

## Acceptance criteria
- [ ] Products can be marked INACTIVE and ACTIVE.
- [ ] Employees can be marked INACTIVE and ACTIVE.
- [ ] Marking an employee INACTIVE creates a record of their current outstanding loan balance and the date.

## Commands/checks to run
- `npm run prisma:push`
- `npm run build`
