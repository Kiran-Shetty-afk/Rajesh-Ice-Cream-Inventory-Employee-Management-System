import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { PurchaseDialog } from "@/components/PurchaseForm";

export const dynamic = "force-dynamic";

export default async function PurchasesPage(): Promise<React.ReactElement> {
  const [purchases, suppliers, products] = await Promise.all([
    prisma.purchase.findMany({ 
      orderBy: { purchaseDate: "desc" },
      include: {
        supplier: true,
        items: {
          include: { product: true }
        }
      }
    }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Purchases" description="Manage incoming stock purchases from suppliers." />
        <PurchaseDialog suppliers={suppliers} products={products} />
      </div>
      
      {purchases.length === 0 && (
        <div className="text-center py-12 text-cocoa/60 bg-white rounded-md border border-orange-100/80">
          No purchases found. Create a new purchase to increase factory stock.
        </div>
      )}

      <div className="grid gap-6">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="surface-card overflow-hidden">
            <div className="card-toolbar items-start">
              <div>
                <div className="font-semibold text-ink text-lg flex items-center gap-2">
                  Invoice: <span className="uppercase text-strawberry">{purchase.invoiceNumber}</span>
                </div>
                <div className="text-sm text-cocoa/70 mt-1">
                  From: <span className="font-medium text-ink">{purchase.supplier.name}</span> • 
                  Date: {purchase.purchaseDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-cocoa/60 mb-0.5">Total Amount</div>
                <div className="font-bold text-xl text-ink">₹{purchase.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
            
            <div className="p-4 border-b border-orange-100/50 bg-orange-50/30">
              <div className="text-xs font-semibold text-cocoa/60 uppercase tracking-wider mb-2">Items Purchased</div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {purchase.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-orange-100/50">
                    <div>
                      <div className="font-medium text-ink text-sm">{item.product.name}</div>
                      <div className="text-xs text-cocoa/60">{item.quantity} units @ ₹{item.costPrice}</div>
                    </div>
                    <div className="font-semibold text-strawberry text-sm">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              {purchase.note && (
                <div className="mt-3 text-sm text-cocoa/70 bg-white/50 p-2 rounded">
                  <span className="font-medium">Note:</span> {purchase.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
