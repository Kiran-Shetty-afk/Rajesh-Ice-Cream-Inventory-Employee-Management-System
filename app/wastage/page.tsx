import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { WastageDialog } from "@/components/WastageForm";

export const dynamic = "force-dynamic";

export default async function WastagePage(): Promise<React.ReactElement> {
  const [wastageRecords, shops, products] = await Promise.all([
    prisma.wastage.findMany({ 
      orderBy: { date: "desc" },
      include: {
        shop: true,
        product: true
      }
    }),
    prisma.shop.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } })
  ]);

  const totalWastageCost = wastageRecords.reduce((sum, record) => sum + record.cost, 0);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Damage & Wastage" description="Track lost inventory from both factory and shops." />
        <WastageDialog shops={shops} products={products} />
      </div>
      
      {wastageRecords.length === 0 ? (
        <div className="text-center py-12 text-cocoa/60 bg-white rounded-md border border-orange-100/80">
          No wastage records found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-card p-4">
              <div className="text-sm font-medium text-cocoa/70 mb-1">Total Wastage Cost</div>
              <div className="text-2xl font-bold text-strawberry">
                ₹{totalWastageCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="surface-card p-4">
              <div className="text-sm font-medium text-cocoa/70 mb-1">Total Items Lost</div>
              <div className="text-2xl font-bold text-ink">
                {wastageRecords.reduce((sum, r) => sum + r.quantity, 0)} units
              </div>
            </div>
          </div>

          <div className="surface-card overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-orange-100/50">
                  <th className="px-4 py-3 text-left font-medium text-cocoa/70">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-cocoa/70">Location</th>
                  <th className="px-4 py-3 text-left font-medium text-cocoa/70">Product</th>
                  <th className="px-4 py-3 text-right font-medium text-cocoa/70">Quantity</th>
                  <th className="px-4 py-3 text-right font-medium text-cocoa/70">Est. Cost</th>
                  <th className="px-4 py-3 text-left font-medium text-cocoa/70">Reason</th>
                </tr>
              </thead>
              <tbody>
                {wastageRecords.map((record) => (
                  <tr key={record.id} className="border-b border-orange-100/30 last:border-0">
                    <td className="px-4 py-3 text-ink">
                      {record.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      {record.shopId ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-vanilla/50 text-ink border border-orange-200/50">
                          Shop: {record.shop?.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-cocoa text-white">
                          Factory
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{record.product.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink">{record.quantity}</td>
                    <td className="px-4 py-3 text-right text-strawberry font-medium">₹{record.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 text-cocoa/70">{record.reason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
