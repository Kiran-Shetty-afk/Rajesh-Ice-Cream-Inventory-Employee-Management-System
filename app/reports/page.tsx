import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { ReportsDashboard } from "@/components/ReportsDashboard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReportsPage(): Promise<React.ReactElement> {
  const shops = await prisma.shop.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <>
      <PageHeader title="Reports" description="Professional inventory, transfer, valuation, raw material, employee, and time-period reports with print and CSV export." />
      
      <ReportsDashboard shops={shops} />
      
      <section className="mt-8 surface-card p-5">
        <h3 className="font-semibold text-lg text-ink mb-2">Print Instructions</h3>
        <p className="text-sm text-cocoa/70 mb-4">
          Clicking <strong>Print</strong> will open your system print dialog. To save as a PDF natively, you can also use the <strong>Download PDF</strong> button directly!
        </p>
      </section>
    </>
  );
}
