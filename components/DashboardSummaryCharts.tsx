"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });
import type { AnalyticsData } from "@/lib/analytics";

const colors = ["#d94677", "#5472d3", "#f4b73f", "#2f9b7c", "#8b5cf6", "#d99a4e"];

const sumBy = <T,>(items: T[], keyOf: (item: T) => string, valueOf: (item: T) => number) => {
  const grouped = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item) || "Unassigned";
    grouped.set(key, (grouped.get(key) ?? 0) + valueOf(item));
  }
  return Array.from(grouped, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

function MiniChart({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="surface-card p-4">
      <div className="mb-3 text-sm font-semibold text-ink">{title}</div>
      <div className="h-64">{children}</div>
    </div>
  );
}

export function DashboardSummaryCharts({ data }: { data: AnalyticsData }) {
  const categoryStock = sumBy(data.products, (product) => product.category, (product) => product.factoryQuantity);
  const flavorStock = sumBy(data.products, (product) => product.flavor, (product) => product.factoryQuantity);
  const topProducts = data.products
    .map((product) => ({ name: product.name, value: product.factoryQuantity }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const shopStock = sumBy(
    data.products.flatMap((product) => product.shopStocks),
    (stock) => stock.shopName,
    (stock) => stock.quantity
  );

  return (
    <section className="mt-6 grid gap-4 xl:grid-cols-2">
      <MiniChart title="Factory Inventory Distribution">
        <ReactECharts
          option={{
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            color: colors,
            series: [
              {
                name: 'Inventory',
                type: 'pie',
                radius: ['40%', '70%'],
                itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
                data: categoryStock.map(c => ({ name: c.name, value: c.value }))
              }
            ]
          }}
          style={{ height: '100%', width: '100%' }}
        />
      </MiniChart>
      <MiniChart title="Shop Inventory Comparison">
        <ReactECharts
          option={{
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', data: shopStock.map(s => s.name) },
            yAxis: { type: 'value' },
            color: ['#5472d3'],
            series: [
              {
                name: 'Units',
                type: 'bar',
                barWidth: '60%',
                data: shopStock.map(s => s.value),
                itemStyle: { borderRadius: [6, 6, 0, 0] }
              }
            ]
          }}
          style={{ height: '100%', width: '100%' }}
        />
      </MiniChart>
      <MiniChart title="Top 10 Products (Factory Stock)">
        <ReactECharts
          option={{
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'value' },
            yAxis: { type: 'category', data: topProducts.map(p => p.name).reverse() },
            color: ['#d94677'],
            series: [
              {
                name: 'Factory units',
                type: 'bar',
                data: topProducts.map(p => p.value).reverse(),
                itemStyle: { borderRadius: [0, 6, 6, 0] }
              }
            ]
          }}
          style={{ height: '100%', width: '100%' }}
        />
      </MiniChart>
      <MiniChart title="Flavor Distribution">
        <ReactECharts
          option={{
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            color: colors,
            series: [
              {
                name: 'Flavor',
                type: 'pie',
                radius: '70%',
                data: flavorStock.map(f => ({ name: f.name, value: f.value })),
                emphasis: {
                  itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
                }
              }
            ]
          }}
          style={{ height: '100%', width: '100%' }}
        />
      </MiniChart>
    </section>
  );
}
