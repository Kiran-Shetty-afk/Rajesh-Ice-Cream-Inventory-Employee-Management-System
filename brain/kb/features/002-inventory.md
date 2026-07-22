# Inventory

Last updated: 2026-07-12
Status: draft

## Confirmed facts

- Route: `/inventory`.
- Displays factory products with product, category, flavor, quantity, unit price, stock value, and status.
- Displays raw materials with material, quantity/unit, unit cost, and value.
- Product low-stock display is calculated from `factoryQuantity <= lowStockQuantity`.

## Important files inspected

- `app/inventory/page.tsx` — inventory tables.
- `prisma/schema.prisma` — `Product` and `RawMaterial` models.

## Assumptions

- Product CRUD is the best next implementation slice.

## Unknowns / documentation gaps

- No product or raw material forms exist yet.
- No category/flavor management UI exists yet.

## Maintenance notes

- Update when product/raw material workflows, validations, categories, or flavors change.
