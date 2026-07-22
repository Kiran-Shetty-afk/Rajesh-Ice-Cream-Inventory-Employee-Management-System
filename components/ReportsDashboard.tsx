"use client";

import React, { useState } from "react";
import { ExportButtons } from "./ExportButtons";
import { reportCatalog } from "@/lib/reportCatalog";

export function ReportsDashboard({ shops }: { shops: { id: string; name: string }[] }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    shopId: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <section className="surface-card mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input 
            name="search" 
            value={filters.search} 
            onChange={handleChange}
            className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm" 
            placeholder="Search report data" 
          />
          <select 
            name="shopId" 
            value={filters.shopId} 
            onChange={handleChange}
            className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm"
          >
            <option value="">All Shops</option>
            {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleChange}
            className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm"
          >
            <option value="">All stock statuses</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
            <option value="Out of stock">Out of stock</option>
          </select>
          <input 
            name="startDate" 
            type="date" 
            value={filters.startDate} 
            onChange={handleChange}
            className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm" 
          />
          <input 
            name="endDate" 
            type="date" 
            value={filters.endDate} 
            onChange={handleChange}
            className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm" 
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {reportCatalog.map((report) => (
          <div key={report} className="surface-card p-5 hover:shadow-sm transition-shadow">
            <h3 className="font-semibold text-lg text-ink">{report}</h3>
            <p className="text-sm text-cocoa/60 mt-1 mb-4">Export the latest data for {report.toLowerCase()}.</p>
            <ExportButtons reportType={report} filters={filters} />
          </div>
        ))}
      </section>
    </>
  );
}
