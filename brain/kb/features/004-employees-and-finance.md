# Employees and Finance

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Route: `/employees`.
- Employee table displays ID, name, mobile, months, total salary, bonus, loans, and balance.
- `monthsWorked()` uses calendar month difference plus one, clamped to zero.
- Employees with more than 6 months receive an 8% bonus on total salary.
- Current balance is total earnings minus total loans.

## Important files inspected

- `app/employees/page.tsx` — employee finance table.
- `lib/finance.ts` — salary/bonus/loan calculations.
- `prisma/schema.prisma` — `Employee` and `EmployeeLoan` models.

## Assumptions

- Loan history should be editable per employee.

## Unknowns / documentation gaps

- No employee CRUD or loan CRUD forms exist yet.
- No salary period closing workflow exists.

## Maintenance notes

- Update when employee fields, salary rules, loan rules, or finance summary behavior changes.
