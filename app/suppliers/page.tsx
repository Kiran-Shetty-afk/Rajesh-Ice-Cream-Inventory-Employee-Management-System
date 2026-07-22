import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { SupplierDialog } from "@/components/SupplierForm";
import { Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuppliersPage(): Promise<React.ReactElement> {
  const suppliers = await prisma.supplier.findMany({ 
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { purchases: true }
      }
    }
  });

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Suppliers" description="Manage your suppliers and their outstanding payments." />
        <SupplierDialog />
      </div>
      
      {suppliers.length === 0 && (
        <div className="text-center py-12 text-cocoa/60 bg-white rounded-md border border-orange-100/80">
          No suppliers found. Add a supplier to start managing purchases.
        </div>
      )}

      {suppliers.length > 0 && (
        <div className="surface-card overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-orange-100/50">
                <th className="px-4 py-3 text-left font-medium text-cocoa/70">Name</th>
                <th className="px-4 py-3 text-left font-medium text-cocoa/70">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-cocoa/70">GST Number</th>
                <th className="px-4 py-3 text-right font-medium text-cocoa/70">Purchases</th>
                <th className="px-4 py-3 text-right font-medium text-cocoa/70">Payment Due</th>
                <th className="px-4 py-3 text-center font-medium text-cocoa/70 w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className={`border-b border-orange-100/30 last:border-0 ${!supplier.isActive ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink flex items-center gap-2">
                      {supplier.name}
                      {!supplier.isActive && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cocoa/10 text-cocoa/70 uppercase tracking-wide">Inactive</span>}
                    </div>
                    {supplier.address && <div className="text-xs text-cocoa/60 mt-0.5 truncate max-w-xs">{supplier.address}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink">{supplier.contactNumber || "-"}</td>
                  <td className="px-4 py-3 text-ink uppercase">{supplier.gstNumber || "-"}</td>
                  <td className="px-4 py-3 text-right text-ink">{supplier._count.purchases}</td>
                  <td className="px-4 py-3 text-right font-semibold text-strawberry">₹{supplier.paymentDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-center">
                    <SupplierDialog 
                      supplier={supplier} 
                      trigger={
                        <button className="icon-button" title="Edit Supplier" aria-label={`Edit ${supplier.name}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                      } 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
