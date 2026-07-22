# Reports and Analytics

Last updated: 2026-07-21
Status: implemented-incremental

## Confirmed facts

- Routes: `/reports` and `/analytics`.
- Reports page lists the expanded report catalog and shows Print and Export buttons.
- Analytics page uses an interactive Recharts dashboard with filters, KPI cards, chart panels, low-stock alerts, raw material analytics, transfer history, and a current stock table.
- Analytics filters include date range, shop, product, category, flavor, stock status, product search, and min/max quantity.
- Report catalog includes factory stock, shop stock, transfer, inventory valuation, raw material, product, category, flavor, daily/weekly/monthly/yearly inventory, low stock, out of stock, transfer history, employee salary, bonus, loan, and financial summary reports.
- CSV exports are wired through `/api/export` for the current report catalog.

## Important files inspected

- `app/reports/page.tsx` — report catalog UI.
- `app/analytics/page.tsx` — analytics route.
- `components/AnalyticsDashboard.tsx` — client-side filters, charts, tables, and KPI presentation.
- `lib/analytics.ts` — server-side analytics data shaping from Prisma.
- `lib/reportCatalog.ts` — report names.
- `app/api/export/route.ts` — CSV report generation.

## Assumptions

- CSV is the current spreadsheet-safe export format because it avoids the unresolved `xlsx` advisory noted elsewhere in the brain.
- PDF export currently uses browser/Electron print-to-PDF from the visible report/dashboard pages.

## Unknowns / documentation gaps

- Report page filter controls are presentational. Filtered report generation by query parameters can be added when exact print/export layouts are finalized.
- Advanced chart behaviors such as zoom, pan, and drill-down are not yet implemented beyond Recharts hover tooltips and legends.

## Maintenance notes

- Update when report data generators, export functions, print views, or charts are added.
