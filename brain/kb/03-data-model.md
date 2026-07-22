# Data Model

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Prisma datasource is SQLite via `DATABASE_URL`.
- Models: `Product`, `RawMaterial`, `Shop`, `ShopInventory`, `StockTransfer`, `StockTransferItem`, `Employee`, `EmployeeLoan`, `AppSetting`, `BackupLog`.
- Enums: `EmployeeStatus` with `ACTIVE`/`INACTIVE`, and `ProductStatus` with `ACTIVE`/`LOW_STOCK`/`INACTIVE`.
- `ShopInventory` has a unique pair on `shopId` and `productId`.
- `StockTransfer.transferNo` is unique.
- `Employee.employeeCode` is unique.
- Product, category, flavor, employee name/status, transfer date, and loan date have indexes.
- Seed data creates sample products, raw materials, one shop, shop inventory, two employees, loans, and `businessName`.

## Important files inspected

- `prisma/schema.prisma` — full database schema.
- `prisma/seed.ts` — sample data and upsert/create behavior.
- `lib/dashboard.ts` — dashboard aggregate calculations.
- `lib/finance.ts` — salary, bonus, and currency helpers.

## Assumptions

- Product hard delete may be risky once transfers exist; inactive status may be safer.
- Stock transfer mutation should be the canonical stock movement mechanism.

## Unknowns / documentation gaps

- No migrations were inspected.
- No production database path strategy is implemented yet.

## Maintenance notes

- Update this file for every Prisma model, enum, relation, index, or migration change.
