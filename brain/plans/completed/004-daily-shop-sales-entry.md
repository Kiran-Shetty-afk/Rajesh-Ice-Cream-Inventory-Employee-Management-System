---
id: "004"
title: "Daily Shop Sales Entry Module"
tier: full-feature
type: feature
status: done
source: kenmark-plan
created: 2026-07-22
completed: 2026-07-22
files:
  - prisma/schema.prisma
  - src/app/(dashboard)/sales/page.tsx
  - src/app/(dashboard)/sales/new/page.tsx
  - src/components/sales/SalesDashboard.tsx
  - src/components/sales/DailySalesForm.tsx
  - src/lib/actions/sales.ts
related_issues: []
related_plans: []
---

## Summary

Add a Daily Shop Sales Entry module for the owner to manually enter daily sales summaries for each shop. The system will automatically calculate totals and decrease shop inventory, and provide a rich analytics dashboard with charts and reports.

## Goal

Provide a streamlined daily sales entry interface tailored for a single owner/admin, avoiding the complexity of a full POS system while still generating robust sales analytics, KPI cards, and reports.

## Current understanding

The app currently tracks factory stock, shop stock, and stock transfers. It does not yet track sales. The owner needs a way to record sales at the end of the day, which will decrease the shop stock and generate revenue analytics. Factory stock should remain unaffected by sales.

## Recommended approach

1. Add `DailySale` and `DailySaleItem` models to Prisma schema to store the sales data.
2. Build a server action `createDailySale` that:
   - Validates the input (quantity > 0, price > 0, sufficient shop stock).
   - Creates the sale record.
   - Decrements `ShopInventory` for the sold items.
3. Build the UI:
   - **Sales Entry Form**: A page to select date, shop, and add multiple product rows (similar to the stock transfer form).
   - **Sales Dashboard**: A comprehensive analytics page with filters, KPI cards (Today/Weekly/Monthly sales, top products, etc.), and charts (using `recharts`).
   - **Reports**: Generate and export reports (PDF/Excel) for sales data.

## Phased plan

### Phase 1 — Database & API
- [x] Add `DailySale` and `DailySaleItem` models to `prisma/schema.prisma`.
- [x] Run `npx prisma db push` and `npx prisma generate`.
- [x] Create server actions for fetching and creating sales (`src/lib/actions/sales.ts`).

### Phase 2 — Sales Entry UI
- [x] Create `/sales/new` page.
- [x] Build `DailySalesForm` component supporting dynamic product rows.
- [x] Implement validation (stock limits, non-zero values) and submit logic.

### Phase 3 — Analytics Dashboard
- [x] Create `/sales` dashboard page.
- [x] Build KPI cards component.
- [x] Integrate `recharts` for visual analytics (Trend lines, Bar charts, Pie charts).
- [x] Implement filters (Date range, Shop, Category).

### Phase 4 — Reports & Export
- [x] Add tabular report views for Daily, Shop-wise, Product-wise sales.
- [x] Implement export functionality (CSV/Excel/PDF).

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Stock mismatch | High | Ensure database transaction wraps both the sale creation and inventory decrement. Validate stock levels before transaction. |
| Performance with large datasets | Medium | Optimize database queries using Prisma aggregations and add necessary indexes to the new models. |

## Acceptance criteria

- [x] Admin can create a daily sales entry for a shop with multiple products.
- [x] Submitting a sale successfully decrements the corresponding `ShopInventory`.
- [x] Factory stock is unchanged by sales.
- [x] Sales dashboard displays correct KPI totals and charts based on actual data.
- [x] Form prevents entering a sale quantity greater than the shop's current stock.

## Commands/checks to run

- `npm run lint`
- `npm run build`
