"use client";

import { FileDown, Printer } from "lucide-react";

export function ExportButtons({ reportType }: { reportType: string }) {
  const handlePrint = () => {
    // Basic window print - in a real app this might open a specialized printable view
    window.print();
  };

  const handleExport = () => {
    window.location.href = `/api/export?type=${encodeURIComponent(reportType)}`;
  };

  return (
    <div className="mt-3 flex gap-2">
      <button 
        onClick={handlePrint}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-orange-100/80 px-3 text-sm hover:bg-vanilla/55 transition-colors"
      >
        <Printer size={16} />
        Print (PDF)
      </button>
      <button 
        onClick={handleExport}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-strawberry px-3 text-sm text-white transition-colors hover:bg-rose-700"
      >
        <FileDown size={16} />
        Export CSV
      </button>
    </div>
  );
}
