"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Filter,
  IndianRupee,
  Store,
  TrendingUp,
  PackageCheck,
  Calendar,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { money } from "@/lib/finance";

// Types
type SalesData = {
  sales: any[]; // Prisma DailySale with items
  shops: any[];
  products: any[];
};

type TrendMode = "daily" | "weekly" | "monthly" | "yearly";

type Filters = {
  startDate: string;
  endDate: string;
  shopId: string;
  productId: string;
  category: string;
  flavor: string;
};

const chartColors = ["#d94677", "#5472d3", "#f4b73f", "#2f9b7c", "#8b5cf6", "#d99a4e", "#14b8a6", "#ef4444"];

const initialFilters: Filters = {
  startDate: "",
  endDate: "",
  shopId: "ALL",
  productId: "ALL",
  category: "ALL",
  flavor: "ALL",
};

const formatDate = (value: string | Date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));

const dateKey = (value: string | Date, mode: TrendMode) => {
  const date = new Date(value);
  if (mode === "yearly") return String(date.getFullYear());
  if (mode === "monthly") return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  if (mode === "weekly") {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(((date.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7);
    return `${date.getFullYear()} W${String(week).padStart(2, "0")}`;
  }
  return date.toISOString().slice(0, 10);
};

const groupSum = <T,>(items: T[], keyOf: (item: T) => string, valueOf: (item: T) => number) => {
  const grouped = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item) || "Unassigned";
    grouped.set(key, (grouped.get(key) ?? 0) + valueOf(item));
  }
  return Array.from(grouped, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

const appliesDateFilter = (value: string | Date, filters: Filters) => {
  const time = new Date(value).getTime();
  if (filters.startDate && time < new Date(filters.startDate).getTime()) return false;
  if (filters.endDate && time > new Date(`${filters.endDate}T23:59:59`).getTime()) return false;
  return true;
};

function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default"
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "default" | "warn" | "success";
}) {
  const bg = tone === "warn" ? "bg-red-50 text-red-600" : tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-pistachio/70 text-cocoa";
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-normal text-cocoa/60">{label}</div>
          <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${bg}`}>
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-3 text-sm text-cocoa/65">{detail}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="surface-card p-4 flex flex-col h-full">
      <div className="mb-3 text-sm font-semibold text-ink">{title}</div>
      <div className="flex-1 min-h-[280px]">{children}</div>
    </div>
  );
}

function EmptyChart() {
  return <div className="flex h-full items-center justify-center text-sm text-cocoa/60 bg-vanilla/10 rounded-lg">No data matches filters.</div>;
}

export function SalesDashboard({ data }: { data: SalesData }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [trendMode, setTrendMode] = useState<TrendMode>("daily");
  const [visibleRows, setVisibleRows] = useState(15);

  const categories = useMemo(() => Array.from(new Set(data.products.map((p) => p.category))).sort(), [data.products]);
  const flavors = useMemo(() => Array.from(new Set(data.products.map((p) => p.flavor))).sort(), [data.products]);

  // Flatten items for easy filtering and grouping
  const flattenedSales = useMemo(() => {
    return data.sales.flatMap(sale => 
      sale.items.map((item: any) => ({
        id: item.id,
        saleId: sale.id,
        date: sale.date,
        shopId: sale.shopId,
        shopName: sale.shop.name,
        productId: item.productId,
        productName: item.product.name,
        category: item.product.category,
        flavor: item.product.flavor,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        wastage: item.wastage,
        returned: item.returned,
      }))
    );
  }, [data.sales]);

  // Apply filters
  const filteredSales = useMemo(() => {
    return flattenedSales.filter(sale => {
      if (!appliesDateFilter(sale.date, filters)) return false;
      if (filters.shopId !== "ALL" && sale.shopId !== filters.shopId) return false;
      if (filters.productId !== "ALL" && sale.productId !== filters.productId) return false;
      if (filters.category !== "ALL" && sale.category !== filters.category) return false;
      if (filters.flavor !== "ALL" && sale.flavor !== filters.flavor) return false;
      return true;
    });
  }, [flattenedSales, filters]);

  // Calculate KPIs
  const totalRevenue = filteredSales.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = filteredSales.reduce((sum, item) => sum + item.quantity, 0);
  const totalWastage = filteredSales.reduce((sum, item) => sum + item.wastage, 0);
  
  const shopRevenue = groupSum(filteredSales, item => item.shopName, item => item.totalPrice);
  const bestShop = shopRevenue[0]?.name || "N/A";
  
  const productRevenue = groupSum(filteredSales, item => item.productName, item => item.totalPrice);
  const bestProduct = productRevenue[0]?.name || "N/A";

  const categoryRevenue = groupSum(filteredSales, item => item.category, item => item.totalPrice);
  const flavorRevenue = groupSum(filteredSales, item => item.flavor, item => item.totalPrice);
  
  const revenueTrend = groupSum(filteredSales, item => dateKey(item.date, trendMode), item => item.totalPrice).sort((a,b) => a.name.localeCompare(b.name));
  
  const updateFilter = (key: keyof Filters, value: string) => {
    setVisibleRows(15);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <Filter size={17} />
          Sales Filters
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm text-cocoa/70">
            Date from
            <input type="date" value={filters.startDate} onChange={(event) => updateFilter("startDate", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink" />
          </label>
          <label className="text-sm text-cocoa/70">
            Date to
            <input type="date" value={filters.endDate} onChange={(event) => updateFilter("endDate", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink" />
          </label>
          <label className="text-sm text-cocoa/70">
            Shop
            <select value={filters.shopId} onChange={(event) => updateFilter("shopId", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink">
              <option value="ALL">All shops</option>
              {data.shops.map((shop) => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cocoa/70">
            Category
            <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink">
              <option value="ALL">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cocoa/70">
            Flavor
            <select value={filters.flavor} onChange={(event) => updateFilter("flavor", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink">
              <option value="ALL">All flavors</option>
              {flavors.map((flavor) => (
                <option key={flavor} value={flavor}>{flavor}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-cocoa/70">
            Product
            <select value={filters.productId} onChange={(event) => updateFilter("productId", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink">
              <option value="ALL">All products</option>
              {data.products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Revenue" value={money(totalRevenue)} detail="For selected period" icon={IndianRupee} tone="success" />
        <KpiCard label="Total Quantity Sold" value={String(totalQuantity)} detail="Units sold" icon={PackageCheck} />
        <KpiCard label="Top Performing Shop" value={bestShop} detail={shopRevenue[0] ? money(shopRevenue[0].value) : "No data"} icon={Store} />
        <KpiCard label="Best Selling Product" value={bestProduct} detail={productRevenue[0] ? money(productRevenue[0].value) : "No data"} icon={TrendingUp} />
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-ink">Sales Revenue Trend</div>
          <div className="flex rounded-md border border-orange-100 bg-white p-1">
            {(["daily", "weekly", "monthly", "yearly"] as TrendMode[]).map((mode) => (
              <button key={mode} onClick={() => setTrendMode(mode)} className={`h-8 rounded px-3 text-sm capitalize ${trendMode === mode ? "bg-strawberry text-white" : "text-cocoa/70 hover:bg-vanilla/50"}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          {revenueTrend.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <AreaChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => money(Number(value))} />
                <Area dataKey="value" name="Revenue" fill="#b7e4d6" stroke="#2f9b7c" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue by Shop">
          {shopRevenue.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <BarChart data={shopRevenue} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => money(Number(value))} />
                <Bar dataKey="value" name="Revenue" fill="#5472d3" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        
        <ChartCard title="Revenue by Category">
          {categoryRevenue.length === 0 ? <EmptyChart /> : (
             <ResponsiveContainer>
             <PieChart>
               <Tooltip formatter={(value) => money(Number(value))} />
               <Legend />
               <Pie data={categoryRevenue} dataKey="value" nameKey="name" outerRadius={95} label>
                 {categoryRevenue.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}
               </Pie>
             </PieChart>
           </ResponsiveContainer>
          )}
        </ChartCard>
      </section>

      <section className="surface-card overflow-hidden flex flex-col">
        <div className="card-toolbar">
          <div className="font-semibold">Detailed Sales Report</div>
          <button onClick={() => window.print()} className="primary-button">Print Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Date</th>
                <th className="table-cell">Shop</th>
                <th className="table-cell">Product</th>
                <th className="table-cell text-right">Sold Qty</th>
                <th className="table-cell text-right">Wastage</th>
                <th className="table-cell text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.slice(0, visibleRows).map((row, i) => (
                <tr key={`${row.id}-${i}`}>
                  <td className="table-cell">{formatDate(row.date)}</td>
                  <td className="table-cell font-medium text-strawberry">{row.shopName}</td>
                  <td className="table-cell">{row.productName}</td>
                  <td className="table-cell text-right">{row.quantity}</td>
                  <td className="table-cell text-right">{row.wastage > 0 ? <span className="text-red-600">{row.wastage}</span> : "-"}</td>
                  <td className="table-cell text-right font-semibold text-ink">{money(row.totalPrice)}</td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td className="table-cell text-center text-cocoa/60" colSpan={6}>No sales match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {visibleRows < filteredSales.length && (
          <div className="border-t border-orange-100 p-4 text-center">
            <button className="rounded-md border border-orange-100 px-4 py-2 text-sm hover:bg-vanilla/50" onClick={() => setVisibleRows((current) => current + 15)}>
              Show more rows
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
