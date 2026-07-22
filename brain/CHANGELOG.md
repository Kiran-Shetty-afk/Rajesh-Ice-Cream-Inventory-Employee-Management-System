# CHANGELOG

## [2026-07-22] - Kenmark Issues Scan (Simplify Mode)
- **Code Quality**: Performed a simplification audit pass. Discovered 1 nested ternary opportunity in `NotificationBell.tsx`. Recorded as Issue 007.
## [2026-07-22] - Issues Fixes (004, 005, 006)
- **Performance**: Refactored static `echarts-for-react` imports to Next.js dynamic lazy-loading to massively reduce initial client bundle size.
- **Backend**: Added explicit return types to notification server actions to prevent Client Component type mismatch.
- **Backend DX**: Created a `withErrorHandling` wrapper in `lib/actions.ts` and refactored `app/actions/shops.ts` as a proof of concept to reduce duplicate try/catch boilerplate.

## [2026-07-22] - Enterprise ERP Plan Phase 4 Implementation & Completion
- **UX & Theming**: Integrated `next-themes` for robust Dark/Light mode support, completely overhauled custom Tailwind color palette to CSS variables, and implemented a sleek collapsible sidebar.
- **Global Search**: Implemented a blazing-fast command palette (`Ctrl+K`) powered by `cmdk` for cross-entity searching (Products, Shops, Employees, Suppliers) with server-side logic.
- **Unified Calendar**: Built a comprehensive Calendar view tracking daily operational events including Sales, Transfers, Purchases, Loans, and Wastage using `date-fns` and responsive CSS grid.
- **Document Management**: Added robust attachment tracking in the database schema for Stock Transfers and Purchases with a dedicated API endpoint for local storage handling.
- **Invoice Generation**: Developed dynamic, print-ready, professional Invoice templates for Purchases and Stock Transfer slips, seamlessly integrating `window.print()` styling logic.
- **Status Update**: Successfully completed all phases of the Enterprise ERP Plan (006) and safely archived the plan to `completed/`.

## [2026-07-22] - Enterprise ERP Plan Phase 3 Implementation
- **Advanced Analytics**: Installed and configured `echarts-for-react` to replace simple Recharts.
- **Financial Analytics**: Implemented Salary Expense and Estimated Profit calculations in the Sales Dashboard.
- **Dashboard Revamp**: Upgraded `AnalyticsDashboard` and `SalesDashboard` to feature interactive ECharts including Radar, Treemap, Pie, Bar, Area, and Composed charts for comprehensive business intelligence.

## [2026-07-22] - Enterprise ERP Plan Phase 2 Implementation
- **Inventory Intelligence**: Added `mfgDate` and `expiryDate` to `Product` and `ShopInventory`.
- **Dashboard**: Built "Expiring Soon" view and highlighted "Low Stock" items in the product snapshot.
- **Daily Sales**: Updated `DailySalesForm` to explicitly display Opening Stock and dynamically calculate Closing Stock based on sold quantity, wastage, and returns.
- **Notifications**: Implemented an in-app `NotificationBell` component with a dynamic dropdown to surface low stock and expiring items.

## v2026.07.22-1806-kb-sync
- KB: updated 02-stack-and-dependencies.md, 05-api-and-integrations.md, and 11-known-risks-and-decisions.md for recent security and typing fixes.

## [2026-07-22] - Issue Sweeps and Quality Updates
- **Testing**: Added Vitest and React Testing Library setup. Added baseline tests for utilities and components.
- **Security**: Prevented raw database error leaks by returning generic errors in server actions.
- **DX**: Added strict return type definitions for Page components and server actions.

## v2026.07.12-kenmark-init
- Initialized Kenmark `brain/` scaffold with modular rules, numbered KB files, issue tracker, and plan tracker.
- KB created from inspected repo files: `package.json`, `README.md`, `prisma/schema.prisma`, `prisma/seed.ts`, `lib/*`, `app/*`, `components/*`, `electron/*`, `scripts/backup.ts`, `.gitignore`.
- Sync mode: none yet; agent entry files were not updated because targets were not selected.

## v2026.07.12-1413-kb-sync
- KB: updated 06-ui-and-routes, 05-api-and-integrations, 09-infra-and-deployment for full production UI CRUD implementation, backup scripts, and Electron integration.
