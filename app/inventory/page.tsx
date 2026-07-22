import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { money } from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import { ProductDialog } from "@/components/ProductForm";
import { RawMaterialDialog } from "@/components/RawMaterialForm";
import { Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryPage(): Promise<React.ReactElement> {
  const [products, rawMaterials] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.rawMaterial.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <>
      <PageHeader title="Inventory" description="Factory products, stock value, low-stock status, and raw materials." />
      <section className="surface-card overflow-hidden">
        <div className="card-toolbar">
          <h2 className="font-semibold text-ink">Factory Products</h2>
          <ProductDialog />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead >
              <tr>
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Flavor</th>
                <th className="px-4 py-2 font-medium text-right">Qty</th>
                <th className="px-4 py-2 font-medium text-right">Unit Price</th>
                <th className="px-4 py-2 font-medium text-right">Stock Value</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody >
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-cocoa/60 text-sm">
                    No products found. Add a product to get started.
                  </td>
                </tr>
              )}
              {products.map((product) => {
                const isLowStock = product.factoryQuantity <= product.lowStockQuantity;
                return (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-medium text-ink">{product.name}</td>
                    <td className="px-4 py-3 text-cocoa/70">{product.category}</td>
                    <td className="px-4 py-3 text-cocoa/70">{product.flavor}</td>
                    <td className="px-4 py-3 text-right text-ink">{product.factoryQuantity}</td>
                    <td className="px-4 py-3 text-right text-cocoa/70">{money(product.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">{money(product.factoryQuantity * product.unitPrice)}</td>
                    <td className="px-4 py-3">
                      {isLowStock ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                          {product.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ProductDialog 
                        product={product} 
                        trigger={
                          <button className="icon-button" title="Edit" aria-label={`Edit ${product.name}`}>
                            <Edit className="w-4 h-4" />
                          </button>
                        } 
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 surface-card overflow-hidden">
        <div className="card-toolbar">
          <h2 className="font-semibold text-ink">Raw Materials</h2>
          <RawMaterialDialog />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead >
              <tr>
                <th className="px-4 py-2 font-medium">Material</th>
                <th className="px-4 py-2 font-medium text-right">Qty</th>
                <th className="px-4 py-2 font-medium text-right">Unit Cost</th>
                <th className="px-4 py-2 font-medium text-right">Value</th>
                <th className="px-4 py-2 font-medium">Supplier</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody >
              {rawMaterials.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-cocoa/60 text-sm">
                    No raw materials found. Add a material to get started.
                  </td>
                </tr>
              )}
              {rawMaterials.map((item) => {
                const isLowStock = item.quantity <= item.lowStockQuantity;
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-ink">
                      {item.name}
                      {isLowStock && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 uppercase tracking-wide">Low Stock</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-ink">
                      {item.quantity} <span className="text-cocoa/60 text-sm">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-cocoa/70">{money(item.unitCost)}</td>
                    <td className="px-4 py-3 text-right font-medium text-ink">{money(item.quantity * item.unitCost)}</td>
                    <td className="px-4 py-3 text-cocoa/70">{item.supplier || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <RawMaterialDialog 
                        material={item} 
                        trigger={
                          <button className="icon-button" title="Edit" aria-label={`Edit ${item.name}`}>
                            <Edit className="w-4 h-4" />
                          </button>
                        } 
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
