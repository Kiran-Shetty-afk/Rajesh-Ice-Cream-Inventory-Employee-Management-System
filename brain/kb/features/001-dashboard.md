# Dashboard

Last updated: 2026-07-21
Status: implemented-incremental

## Confirmed facts

- Route: `/`.
- Displays total products, factory stock, inventory value, low stock count, employees, salary liability, bonus liability, and total loans.
- Displays homepage chart summaries for factory category distribution, shop inventory comparison, top products, and flavor distribution.
- Shows product and employee snapshots.
- Card data comes from `getDashboardData()` in `lib/dashboard.ts`; chart data comes from `getAnalyticsData()` in `lib/analytics.ts`.

## Important files inspected

- `app/page.tsx` — dashboard UI.
- `components/DashboardSummaryCharts.tsx` — Recharts homepage chart summaries.
- `lib/dashboard.ts` — aggregate data.
- `lib/analytics.ts` — analytics/chart data.
- `lib/finance.ts` — money formatting and salary summary.

## Assumptions

- Dashboard cards should eventually link to filtered detail pages.

## Unknowns / documentation gaps

- Dashboard chart drill-down actions are not implemented yet.

## Maintenance notes

- Update when dashboard metrics, cards, or links change.
