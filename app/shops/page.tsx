import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { ShopDialog } from "@/components/ShopForm";
import { Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopsPage() {
  const shops = await prisma.shop.findMany({ include: { stocks: { include: { product: true } } }, orderBy: { name: "asc" } });

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Shops" description="Shop-wise product inventory and stock balance." />
        <ShopDialog />
      </div>
      
      {shops.length === 0 && (
        <div className="text-center py-12 text-cocoa/60 bg-white rounded-md border border-orange-100/80">
          No shops found. Add a shop to start tracking inventory.
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        {shops.map((shop) => (
          <div key={shop.id} className={`surface-card overflow-hidden ${!shop.isActive ? "opacity-75" : ""}`}>
            <div className="card-toolbar items-start">
              <div>
                <div className="font-semibold text-ink flex items-center gap-2">
                  {shop.name}
                  {!shop.isActive && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cocoa/10 text-cocoa/70 uppercase tracking-wide">Inactive</span>}
                </div>
                <div className="text-sm text-cocoa/60 mt-1">{shop.managerName || "No manager"} • {shop.mobileNumber || "No contact"}</div>
              </div>
              <ShopDialog 
                shop={shop} 
                trigger={
                  <button className="icon-button" title="Edit Shop" aria-label={`Edit ${shop.name}`}>
                    <Edit className="w-4 h-4" />
                  </button>
                } 
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead >
                  <tr>
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium">Category</th>
                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                  </tr>
                </thead>
                <tbody >
                  {shop.stocks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-cocoa/45 text-sm italic">
                        No inventory in this shop.
                      </td>
                    </tr>
                  )}
                  {shop.stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td className="px-4 py-2 font-medium text-ink">{stock.product.name}</td>
                      <td className="px-4 py-2 text-cocoa/70">{stock.product.category}</td>
                      <td className="px-4 py-2 text-right font-semibold text-ink">{stock.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
