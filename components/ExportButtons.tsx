"use client";

import { FileDown, Printer, FileText } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getFactoryInventoryReport, getShopInventoryReport, getEmployeeReport } from "@/app/actions/reports";

export function ExportButtons({ reportType, filters }: { reportType: string, filters: any }) {
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    switch (reportType) {
      case "Factory Stock Report":
        return await getFactoryInventoryReport(filters);
      case "Shop Stock Report":
        return await getShopInventoryReport(filters);
      case "Employee Salary Report":
        return await getEmployeeReport(filters);
      default:
        alert("This report is not implemented yet.");
        return null;
    }
  };

  const handleExcel = async () => {
    setLoading(true);
    const data = await fetchReportData();
    if (data && data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      XLSX.writeFile(workbook, `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
    setLoading(false);
  };

  const handlePDF = async () => {
    setLoading(true);
    const data = await fetchReportData();
    if (data && data.length > 0) {
      const doc = new jsPDF("landscape");
      
      doc.setFontSize(18);
      doc.text(`Rajesh Icecream - ${reportType}`, 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const headers = Object.keys(data[0]);
      const rows = data.map(obj => Object.values(obj).map(val => String(val)));

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 36,
        theme: "grid",
        headStyles: { fillColor: [248, 113, 113] }, // matching strawberry color
      });

      doc.save(`${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    }
    setLoading(false);
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button 
        onClick={handlePDF}
        disabled={loading}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-orange-100/80 px-2.5 text-sm hover:bg-vanilla/55 transition-colors disabled:opacity-50"
      >
        <FileText size={16} />
        {loading ? "Wait..." : "PDF"}
      </button>
      <button 
        onClick={handleExcel}
        disabled={loading}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 text-sm text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
      >
        <FileDown size={16} />
        {loading ? "Wait..." : "Excel"}
      </button>
      <button 
        onClick={() => window.print()}
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white border border-gray-200 px-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Printer size={16} />
        Print
      </button>
    </div>
  );
}
