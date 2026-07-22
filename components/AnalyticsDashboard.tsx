"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Boxes,
  Factory,
  Filter,
  IndianRupee,
  PackageCheck,
  Search,
  Store,
  TrendingUp
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
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis
} from "recharts";
import type { AnalyticsData, AnalyticsProduct, AnalyticsTransfer } from "@/lib/analytics";
import { money } from "@/lib/finance";

type StockStatus = "ALL" | "NORMAL" | "LOW" | "OUT";
type TrendMode = "daily" | "weekly" | "monthly" | "yearly";

type Filters = {
  startDate: string;
  endDate: string;
  shopId: string;
  productId: string;
  category: string;
  flavor: string;
  stockStatus: StockStatus;
  search: string;
  minQuantity: string;
  maxQuantity: string;
};

type StockRow = {
  id: string;
  product: string;
  category: string;
  flavor: string;
  shopName: string;
  factoryQuantity: number;
  shopQuantity: number;
  totalQuantity: number;
  unitPrice: number;
  totalValue: number;
  lowStockQuantity: number;
  lastTransferDate: string;
  status: "Normal" | "Low" | "Out of Stock";
};

const chartColors = ["#d94677", "#5472d3", "#f4b73f", "#2f9b7c", "#8b5cf6", "#d99a4e", "#14b8a6", "#ef4444"];

const initialFilters: Filters = {
  startDate: "",
  endDate: "",
  shopId: "ALL",
  productId: "ALL",
  category: "ALL",
  flavor: "ALL",
  stockStatus: "ALL",
  search: "",
  minQuantity: "",
  maxQuantity: ""
};

const formatDate = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));

const dateKey = (value: string, mode: TrendMode) => {
  const date = new Date(value);
  if (mode === "yearly") return String(date.getFullYear());
  if (mode === "monthly") return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  if (mode === "weekly") {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil(((date.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7);
    return `${date.getFullYear()} W${String(week).padStart(2, "0")}`;
  }
  return value.slice(0, 10);
};

const groupSum = <T,>(items: T[], keyOf: (item: T) => string, valueOf: (item: T) => number) => {
  const grouped = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item) || "Unassigned";
    grouped.set(key, (grouped.get(key) ?? 0) + valueOf(item));
  }
  return Array.from(grouped, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

const getStockStatus = (quantity: number, lowStockQuantity: number): StockRow["status"] => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= lowStockQuantity) return "Low";
  return "Normal";
};

const appliesDateFilter = (value: string, filters: Filters) => {
  const time = new Date(value).getTime();
  if (filters.startDate && time < new Date(filters.startDate).getTime()) return false;
  if (filters.endDate && time > new Date(`${filters.endDate}T23:59:59`).getTime()) return false;
  return true;
};

function buildRows(products: AnalyticsProduct[], transfers: AnalyticsTransfer[], filters: Filters): StockRow[] {
  return products.map((product) => {
    const shopStocks =
      filters.shopId === "ALL" ? product.shopStocks : product.shopStocks.filter((stock) => stock.shopId === filters.shopId);
    const shopQuantity = shopStocks.reduce((sum, stock) => sum + stock.quantity, 0);
    const productTransfers = transfers.filter((transfer) =>
      transfer.items.some((item) => item.productId === product.id) && (filters.shopId === "ALL" || transfer.shopId === filters.shopId)
    );
    const lastTransferDate = productTransfers[0]?.transferDate ?? product.updatedAt;
    const totalQuantity = product.factoryQuantity + shopQuantity;

    return {
      id: product.id,
      product: product.name,
      category: product.category,
      flavor: product.flavor,
      shopName: filters.shopId === "ALL" ? "All shops" : shopStocks[0]?.shopName ?? "No shop stock",
      factoryQuantity: product.factoryQuantity,
      shopQuantity,
      totalQuantity,
      unitPrice: product.unitPrice,
      totalValue: totalQuantity * product.unitPrice,
      lowStockQuantity: product.lowStockQuantity,
      lastTransferDate,
      status: getStockStatus(totalQuantity, product.lowStockQuantity)
    };
  });
}

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
  tone?: "default" | "warn";
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-normal text-cocoa/60">{label}</div>
          <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${tone === "warn" ? "bg-red-50 text-red-600" : "bg-pistachio/70 text-cocoa"}`}>
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-3 text-sm text-cocoa/65">{detail}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="surface-card p-4">
      <div className="mb-3 text-sm font-semibold text-ink">{title}</div>
      <div className="h-72">{children}</div>
    </div>
  );
}

function EmptyChart() {
  return <div className="flex h-full items-center justify-center text-sm text-cocoa/60">No matching data for these filters.</div>;
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [trendMode, setTrendMode] = useState<TrendMode>("monthly");
  const [visibleRows, setVisibleRows] = useState(10);

  const categories = useMemo(() => Array.from(new Set(data.products.map((product) => product.category))).sort(), [data.products]);
  const flavors = useMemo(() => Array.from(new Set(data.products.map((product) => product.flavor))).sort(), [data.products]);

  const filteredProducts = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const min = filters.minQuantity === "" ? null : Number(filters.minQuantity);
    const max = filters.maxQuantity === "" ? null : Number(filters.maxQuantity);

    return data.products.filter((product) => {
      const shopQuantity =
        filters.shopId === "ALL"
          ? product.shopStocks.reduce((sum, stock) => sum + stock.quantity, 0)
          : product.shopStocks.filter((stock) => stock.shopId === filters.shopId).reduce((sum, stock) => sum + stock.quantity, 0);
      const totalQuantity = product.factoryQuantity + shopQuantity;
      const status = getStockStatus(totalQuantity, product.lowStockQuantity);

      if (filters.productId !== "ALL" && product.id !== filters.productId) return false;
      if (filters.category !== "ALL" && product.category !== filters.category) return false;
      if (filters.flavor !== "ALL" && product.flavor !== filters.flavor) return false;
      if (filters.stockStatus === "NORMAL" && status !== "Normal") return false;
      if (filters.stockStatus === "LOW" && status !== "Low") return false;
      if (filters.stockStatus === "OUT" && status !== "Out of Stock") return false;
      if (search && !`${product.name} ${product.category} ${product.flavor}`.toLowerCase().includes(search)) return false;
      if (min !== null && totalQuantity < min) return false;
      if (max !== null && totalQuantity > max) return false;
      return true;
    });
  }, [data.products, filters]);

  const filteredTransfers = useMemo(
    () =>
      data.transfers.filter((transfer) => {
        if (!appliesDateFilter(transfer.transferDate, filters)) return false;
        if (filters.shopId !== "ALL" && transfer.shopId !== filters.shopId) return false;
        return transfer.items.some((item) => {
          if (filters.productId !== "ALL" && item.productId !== filters.productId) return false;
          if (filters.category !== "ALL" && item.category !== filters.category) return false;
          if (filters.flavor !== "ALL" && item.flavor !== filters.flavor) return false;
          return true;
        });
      }),
    [data.transfers, filters]
  );

  const rows = useMemo(() => buildRows(filteredProducts, filteredTransfers, filters), [filteredProducts, filteredTransfers, filters]);
  const inventoryValue = rows.reduce((sum, row) => sum + row.totalValue, 0);
  const stockReceived = filteredTransfers.reduce((sum, transfer) => sum + transfer.quantity, 0);
  const lowStockRows = rows.filter((row) => row.status === "Low");
  const outRows = rows.filter((row) => row.status === "Out of Stock");
  const categoryDistribution = groupSum(rows, (row) => row.category, (row) => row.totalQuantity);
  const flavorDistribution = groupSum(rows, (row) => row.flavor, (row) => row.totalQuantity);
  const categoryValue = groupSum(rows, (row) => row.category, (row) => row.totalValue);
  const productQuantity = rows.map((row) => ({ name: row.product, quantity: row.totalQuantity, value: row.totalValue })).sort((a, b) => b.quantity - a.quantity);
  const transferByShop = groupSum(filteredTransfers, (transfer) => transfer.shopName, (transfer) => transfer.quantity);
  const transferTrend = groupSum(filteredTransfers, (transfer) => dateKey(transfer.transferDate, trendMode), (transfer) => transfer.quantity).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const valueTrend = groupSum(filteredTransfers, (transfer) => dateKey(transfer.transferDate, trendMode), (transfer) => transfer.value).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const rawMaterialDistribution = groupSum(data.rawMaterials, (material) => material.name, (material) => material.quantity);
  const rawMaterialValue = groupSum(data.rawMaterials, (material) => material.name, (material) => material.quantity * material.unitCost);
  const rawLowStock = data.rawMaterials.filter((material) => material.quantity <= material.lowStockQuantity);

  const mostPopularCategory = categoryDistribution[0]?.name ?? "No data";
  const mostPopularFlavor = flavorDistribution[0]?.name ?? "No data";
  const avgInventoryValue = rows.length === 0 ? 0 : inventoryValue / rows.length;

  const updateFilter = (key: keyof Filters, value: string) => {
    setVisibleRows(10);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <Filter size={17} />
          Global Filters
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
            Product
            <select value={filters.productId} onChange={(event) => updateFilter("productId", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink">
              <option value="ALL">All products</option>
              {data.products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
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
            Stock status
            <select value={filters.stockStatus} onChange={(event) => updateFilter("stockStatus", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink">
              <option value="ALL">All statuses</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
              <option value="OUT">Out of stock</option>
            </select>
          </label>
          <label className="text-sm text-cocoa/70">
            Product search
            <span className="mt-1 flex h-10 items-center gap-2 rounded-md border border-orange-100 bg-white px-3">
              <Search size={16} className="text-cocoa/45" />
              <input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} className="w-full bg-transparent text-ink outline-none" placeholder="Name, category, flavor" />
            </span>
          </label>
          <label className="text-sm text-cocoa/70">
            Min quantity
            <input type="number" min="0" value={filters.minQuantity} onChange={(event) => updateFilter("minQuantity", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink" />
          </label>
          <label className="text-sm text-cocoa/70">
            Max quantity
            <input type="number" min="0" value={filters.maxQuantity} onChange={(event) => updateFilter("maxQuantity", event.target.value)} className="mt-1 h-10 w-full rounded-md border border-orange-100 bg-white px-3 text-ink" />
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Current Stock" value={String(rows.reduce((sum, row) => sum + row.totalQuantity, 0))} detail="Factory and selected shop stock" icon={Boxes} />
        <KpiCard label="Inventory Value" value={money(inventoryValue)} detail={`Average ${money(avgInventoryValue)} per product`} icon={IndianRupee} />
        <KpiCard label="Products Available" value={String(rows.filter((row) => row.totalQuantity > 0).length)} detail={`${outRows.length} out of stock`} icon={PackageCheck} />
        <KpiCard label="Low Stock Products" value={String(lowStockRows.length)} detail="Below reorder level" icon={AlertTriangle} tone="warn" />
        <KpiCard label="Stock Received" value={String(stockReceived)} detail={`${filteredTransfers.length} matching transfers`} icon={TrendingUp} />
        <KpiCard label="Total Transfers Received" value={String(filteredTransfers.length)} detail="Filtered transfer records" icon={Store} />
        <KpiCard label="Most Popular Category" value={mostPopularCategory} detail="By current stock quantity" icon={Factory} />
        <KpiCard label="Most Popular Flavor" value={mostPopularFlavor} detail="By current stock quantity" icon={PackageCheck} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Category-wise Inventory Distribution">
          {categoryDistribution.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" outerRadius={95} label>
                  {categoryDistribution.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Flavor-wise Distribution">
          {flavorDistribution.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={flavorDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} label>
                  {flavorDistribution.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Stock Levels by Product">
          {productQuantity.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <BarChart data={productQuantity.slice(0, 12)} layout="vertical" margin={{ left: 28 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={115} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#5472d3" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Category Performance: Quantity and Value">
          {categoryDistribution.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <ComposedChart data={categoryDistribution.map((item) => ({ name: item.name, quantity: item.value, stockValue: categoryValue.find((entry) => entry.name === item.name)?.value ?? 0 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => (name === "stockValue" ? money(Number(value)) : value)} />
                <Legend />
                <Bar yAxisId="left" dataKey="stockValue" name="Stock value" fill="#d94677" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" dataKey="quantity" name="Quantity" stroke="#2f9b7c" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>

      <section className="surface-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-ink">Stock Movement and Transfer Analysis</div>
          <div className="flex rounded-md border border-orange-100 bg-white p-1">
            {(["daily", "weekly", "monthly", "yearly"] as TrendMode[]).map((mode) => (
              <button key={mode} onClick={() => setTrendMode(mode)} className={`h-8 rounded px-3 text-sm capitalize ${trendMode === mode ? "bg-strawberry text-white" : "text-cocoa/70 hover:bg-vanilla/50"}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="h-72">
            {transferTrend.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer>
                <LineChart data={transferTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" name="Stock received" stroke="#5472d3" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="h-72">
            {transferByShop.length === 0 ? <EmptyChart /> : (
              <ResponsiveContainer>
                <BarChart data={transferByShop}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Units received" fill="#f4b73f" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Inventory Value Treemap">
          {categoryValue.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <Treemap data={categoryValue} dataKey="value" nameKey="name" stroke="#fff" fill="#d94677" />
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Inventory Value Trend">
          {valueTrend.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <AreaChart data={valueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => money(Number(value))} />
                <Area dataKey="value" name="Transfer value" fill="#b7e4d6" stroke="#2f9b7c" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Category Comparison">
          {categoryDistribution.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer>
              <RadarChart data={categoryDistribution.slice(0, 8)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar dataKey="value" fill="#5472d3" fillOpacity={0.45} stroke="#5472d3" />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="surface-card overflow-hidden">
          <div className="card-toolbar font-semibold text-red-700">Low Stock Analysis</div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {[...lowStockRows, ...outRows].slice(0, 6).map((row) => (
              <div key={row.id} className="rounded-md border border-red-100 bg-red-50 p-3">
                <div className="font-semibold text-red-800">{row.product}</div>
                <div className="mt-1 text-sm text-red-700">{row.totalQuantity} units available. Reorder at {row.lowStockQuantity}.</div>
              </div>
            ))}
            {lowStockRows.length + outRows.length === 0 && <div className="text-sm text-cocoa/60">No low-stock products match the current filters.</div>}
          </div>
        </div>
        <div className="surface-card overflow-hidden">
          <div className="card-toolbar font-semibold">Raw Material Analytics</div>
          <div className="grid gap-4 p-4 md:grid-cols-2">
            <div className="h-60">
              {rawMaterialDistribution.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer>
                  <PieChart>
                    <Tooltip />
                    <Pie data={rawMaterialDistribution} dataKey="value" nameKey="name" outerRadius={82}>
                      {rawMaterialDistribution.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-semibold text-ink">Material value</div>
              {rawMaterialValue.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{money(item.value)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-orange-100">
                    <div className="h-2 rounded-full bg-blueberry" style={{ width: `${Math.min(100, (item.value / Math.max(...rawMaterialValue.map((entry) => entry.value), 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
              {rawLowStock.length > 0 && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{rawLowStock.length} raw material alerts need attention.</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="card-toolbar">
          <div className="font-semibold">Current Stock Table</div>
          <button onClick={() => window.print()} className="primary-button">Print / PDF</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Product</th>
                <th className="table-cell">Category</th>
                <th className="table-cell">Flavor</th>
                <th className="table-cell">Quantity</th>
                <th className="table-cell">Unit Price</th>
                <th className="table-cell">Total Value</th>
                <th className="table-cell">Last Transfer Date</th>
                <th className="table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, visibleRows).map((row) => (
                <tr key={row.id}>
                  <td className="table-cell font-medium">{row.product}</td>
                  <td className="table-cell">{row.category}</td>
                  <td className="table-cell">{row.flavor}</td>
                  <td className="table-cell">{row.totalQuantity}</td>
                  <td className="table-cell">{money(row.unitPrice)}</td>
                  <td className="table-cell">{money(row.totalValue)}</td>
                  <td className="table-cell">{formatDate(row.lastTransferDate)}</td>
                  <td className="table-cell">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${row.status === "Normal" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="table-cell text-center text-cocoa/60" colSpan={8}>No stock rows match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {visibleRows < rows.length && (
          <div className="border-t border-orange-100 p-4 text-center">
            <button className="rounded-md border border-orange-100 px-4 py-2 text-sm hover:bg-vanilla/50" onClick={() => setVisibleRows((current) => current + 10)}>
              Show more rows
            </button>
          </div>
        )}
      </section>

      <section className="surface-card overflow-hidden">
        <div className="card-toolbar font-semibold">Transfer History Timeline</div>
        <div className="divide-y divide-orange-100">
          {filteredTransfers.slice(0, 8).map((transfer) => (
            <div key={transfer.id} className="grid gap-2 p-4 md:grid-cols-[160px_1fr_160px]">
              <div className="text-sm font-medium text-cocoa">{formatDate(transfer.transferDate)}</div>
              <div>
                <div className="font-semibold text-ink">{transfer.transferNo} to {transfer.shopName}</div>
                <div className="mt-1 text-sm text-cocoa/65">{transfer.items.map((item) => `${item.productName} (${item.quantity})`).join(", ")}</div>
              </div>
              <div className="text-sm font-semibold text-ink">{transfer.quantity} units</div>
            </div>
          ))}
          {filteredTransfers.length === 0 && <div className="p-4 text-sm text-cocoa/60">No transfers match the selected filters.</div>}
        </div>
      </section>
    </div>
  );
}
