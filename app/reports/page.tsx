import { PageHeader } from "@/components/PageHeader";
import { ExportButtons } from "@/components/ExportButtons";
import { reportCatalog } from "@/lib/reportCatalog";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Professional inventory, transfer, valuation, raw material, employee, and time-period reports with print and CSV export." />
      <section className="surface-card mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm" placeholder="Search report data" />
          <input type="date" className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm" />
          <input type="date" className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm" />
          <select className="h-10 rounded-md border border-orange-100 bg-white px-3 text-sm">
            <option>All stock statuses</option>
            <option>Normal</option>
            <option>Low</option>
            <option>Out of stock</option>
          </select>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {reportCatalog.map((report) => (
          <div key={report} className="surface-card p-5 hover:shadow-sm transition-shadow">
            <h3 className="font-semibold text-lg text-ink">{report}</h3>
            <p className="text-sm text-cocoa/60 mt-1 mb-4">Export the latest data for {report.toLowerCase()}.</p>
            <ExportButtons reportType={report} />
          </div>
        ))}
      </section>
      
      <section className="mt-8 surface-card p-5">
        <h3 className="font-semibold text-lg text-ink mb-2">Print Instructions</h3>
        <p className="text-sm text-cocoa/70 mb-4">
          Clicking <strong>Print (PDF)</strong> will open your system print dialog. To save as a PDF, select <strong>Save to PDF</strong> or <strong>Microsoft Print to PDF</strong> in the printer destination dropdown.
        </p>
      </section>
    </>
  );
}
