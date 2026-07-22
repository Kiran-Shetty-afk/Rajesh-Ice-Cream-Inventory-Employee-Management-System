---
id: 004
title: ECharts library is statically imported, inflating initial client bundle size
severity: P2
area: performance
source: kenmark-issues-scan
status: open
created: 2026-07-22
files:
  - components/SalesDashboard.tsx
  - components/AnalyticsDashboard.tsx
  - components/DashboardSummaryCharts.tsx
related: []
---

## Summary

The ECharts library (`echarts-for-react`) is being imported statically at the top level of the Dashboard components. This causes a massive performance degradation because the entire charting library is bundled and shipped into the initial JavaScript payload to the client, increasing Time to Interactive (TTI).

## Evidence

- `components/SalesDashboard.tsx:15` — `import ReactECharts from "echarts-for-react";`
- `components/AnalyticsDashboard.tsx:17` — `import ReactECharts from "echarts-for-react";`
- `components/DashboardSummaryCharts.tsx:4` — `import ReactECharts from "echarts-for-react";`

## Suggested fix

Refactor the static import into a Next.js dynamic import (`next/dynamic`) with `ssr: false`. This ensures the charting library is only downloaded when the user actually renders the dashboard, and avoids React hydration errors on the server since canvas doesn't render server-side.

## Acceptance criteria

- [ ] All `import ReactECharts from "echarts-for-react";` are replaced with `const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });`
- [ ] Next.js bundle analyzer confirms a significant drop in the initial layout JS bundle size.
