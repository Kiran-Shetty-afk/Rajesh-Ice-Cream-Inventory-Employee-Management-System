---
id: "006"
title: "Enterprise ERP Features Roadmap (Purchasing, Analytics, Alerts)"
tier: ultrathink
type: feature
status: in-progress
source: kenmark-plan
created: 2026-07-22
files: []
approved: 2026-07-22
related_issues: []
related_plans:
  - "005"
---

# Plan — Enterprise ERP Features Roadmap

## Summary
The goal is to elevate the Rajesh Icecream Management System to a full-fledged ERP. This includes a comprehensive suite of new modules such as Purchase Management, Supplier Management, Reorder/Expiry Alerts, Damage/Wastage Tracking, a comprehensive Daily Sales Module, Advanced Business Intelligence, and UX improvements (Dark mode, Global Search, etc).

## Goal
Implement a scalable, maintainable architecture for a massive new suite of ERP features, prioritizing offline functionality, rich ECharts visualizations, and robust data tracking to transform the local app into a professional business management tool.

## Current understanding
The system currently has core features for Shops, Employees, Inventory, and Sales. The app uses Next.js, Prisma (SQLite), and Electron. The new feature set introduces complex relational data tracking (e.g., Suppliers, Purchases, Expiries) and requires robust visualization libraries (ECharts) and layout enhancements (Dark mode, Calendar).

## Options

| Option | Summary | Pros | Cons | Risk | When to choose |
| --- | --- | --- | --- | --- | --- |
| **A: Monolithic Rollout** | Build all modules concurrently and release them as a single massive update. | Cohesive user experience upon release. | High risk of bugs; huge PR size; long time to value. | High | If the current version is not used in production. |
| **B: Phased Modular Rollout** | Release features in logically grouped phases (e.g., Supply Chain first, then Analytics, then UX). | Faster time to value; easier testing; isolated risk. | Requires careful schema migration management across phases. | Low | Recommended for active production systems. |

**Recommended: Option B (Phased Modular Rollout)**

Why:
- The sheer volume of features requires breaking them down to ensure stability.
- We can deliver high-value operational features (Purchase, Wastage) immediately before building the complex ECharts analytics dashboard.

## Phased plan

### Phase 1 — Foundation & Supply Chain (Purchases, Suppliers, Wastage)
- [x] **Schema Migration**: Add models for `Supplier`, `Purchase`, `PurchaseItem`, `Wastage`, `Notification`.
- [x] **Supplier Management**: Build UI for CRUD operations on Suppliers.
- [x] **Purchase Management**: Build Purchase entry workflow (Supplier, Invoice, Products, Auto-increment factory stock).
- [x] **Damage/Wastage Management**: Build Wastage entry workflow and UI.
- [x] **Data Export Foundation**: Implement CSV/PDF export utilities for tables.

### Phase 2 — Inventory Intelligence (Alerts, Expiry, Daily Sales Expansion)
- [x] **Expiry Management**: Add `mfgDate` and `expiryDate` to stock tracking; build expiring soon views.
- [x] **Reorder Alerts**: Implement low stock threshold logic and red highlights on dashboards.
- [x] **Daily Sales Module (Completion)**: Integrate Opening Stock, Closing Stock, Returns, and Wastage into the Daily Sales view.
- [x] **Notification Center**: Build the UI bell icon and dropdown for Low Stock, Expiries, Backup failures, etc.

### Phase 3 — Advanced Analytics & ECharts
- [x] **Library Setup**: Install and configure `echarts-for-react`.
- [x] **Sales & Financial Analytics**: Build Line/Bar charts for Revenue, Salary Expense, Profit calculation views.
- [x] **Inventory Analytics**: Build Stock Aging, Category/Flavor performance, Fast/Slow moving product charts.
- [x] **Shop Comparison & Visualizations**: Build radar/pie charts for shop vs shop and category distributions.
- [x] **Dashboard Revamp**: Display Best Selling / Worst Selling, Rank shops.

### Phase 4 — UX, Search & Extras
- [x] **UX Improvements**: Implement ThemeProvider for Dark/Light mode, Collapsible Sidebar, Keyboard shortcuts.
- [x] **Global Search**: Implement `Ctrl + K` command palette searching across Products, Employees, Shops, etc.
- [x] **Calendar View**: Build a unified calendar showing events (Sales, Transfers, Loans, Backups).
- [x] **Document Storage**: Add file attachment capabilities (saving to local disk, tracking paths in DB).
- [x] **Invoice Generator**: Build print-ready templates for Purchase/Transfer/Salary slips.

## Files likely involved

| File/area | Expected change |
| --- | --- |
| `prisma/schema.prisma` | Substantial additions for Suppliers, Purchases, Wastage, Notifications, Settings (Theme). |
| `components/Sidebar.tsx` | Add new routes, collapsible state, Dark Mode toggle. |
| `components/CommandPalette.tsx` | New component for Ctrl+K global search. |
| `app/(dashboard)/analytics/page.tsx` | Heavy use of ECharts for business intelligence. |
| `app/(dashboard)/purchases/page.tsx` | New CRUD views. |

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Schema Complexity** | SQLite migrations might fail with existing data if we add non-nullable fields. | Use default values or make new fields nullable during migrations. |
| **Performance (ECharts)** | Rendering too many complex charts simultaneously could lag the desktop app. | Lazy load charts, use pagination, and debounce date-range queries. |
| **Global Search Speed** | Querying across all tables on every keystroke may be slow. | Implement debouncing and limit results to top 5 per category. |

## Acceptance criteria

- [ ] All requested models (Supplier, Purchase, Wastage) exist and function.
- [ ] ECharts analytics render correctly and reflect real database metrics.
- [ ] Notifications and low-stock alerts trigger automatically based on thresholds.
- [ ] Global search (Ctrl+K) works across key entities.
- [ ] Dark mode and light mode toggle seamlessly.
- [ ] App remains completely offline-capable.

## Commands/checks to run
- `npx prisma migrate dev` (To test schema updates)
- `npm run dev`
- `npm run build`

## Open questions
1. For Document Storage, should we store the actual PDF/image files inside the SQLite database as BLOBs, or store them in an `attachments/` folder on the local disk and save the path? (Local disk is highly recommended for performance).
2. For Expiry management, does a single product in the DB have multiple batches with different expiry dates, or do we track expiry per product globally?

## Decision log
- **UI Charting**: Chosen Apache ECharts via `echarts-for-react` due to its vast visualization options (Radar, Heatmap, Sankey) over simpler libraries like Recharts.
- **Rollout Strategy**: Opting for modular feature releases (Supply Chain -> Intelligence -> Analytics -> UX) to ensure stability.
