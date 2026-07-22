"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
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
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={categoryStock} dataKey="value" nameKey="name" outerRadius={82} label>
              {categoryStock.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </MiniChart>
      <MiniChart title="Shop Inventory Comparison">
        <ResponsiveContainer>
          <BarChart data={shopStock}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" name="Units" fill="#5472d3" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </MiniChart>
      <MiniChart title="Top 10 Products">
        <ResponsiveContainer>
          <BarChart data={topProducts} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" name="Factory units" fill="#d94677" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </MiniChart>
      <MiniChart title="Flavor Distribution">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie data={flavorStock} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82}>
              {flavorStock.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </MiniChart>
    </section>
  );
}
