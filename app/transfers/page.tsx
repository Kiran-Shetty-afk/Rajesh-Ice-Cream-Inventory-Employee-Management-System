import { format } from "date-fns";
import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { TransferDialog } from "@/components/TransferForm";

export const dynamic = "force-dynamic";

export default async function TransfersPage() {
  const [transfers, shops, products] = await Promise.all([
    prisma.stockTransfer.findMany({
      include: { shop: true, items: { include: { product: true } } },
      orderBy: { transferDate: "desc" }
    }),
    prisma.shop.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Transfers" description="Factory to shop transfer history with product quantities." />
        <TransferDialog shops={shops} products={products} />
      </div>

      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead >
              <tr>
                <th className="px-4 py-2 font-medium">Transfer No</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Destination Shop</th>
                <th className="px-4 py-2 font-medium">Items Transferred</th>
                <th className="px-4 py-2 font-medium text-right">Total Qty</th>
              </tr>
            </thead>
            <tbody >
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-cocoa/60 text-sm">
                    No transfers found. Create a new transfer to move stock from the factory to a shop.
                  </td>
                </tr>
              )}
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="px-4 py-3 font-medium text-ink">{transfer.transferNo}</td>
                  <td className="px-4 py-3 text-cocoa/70">{format(new Date(transfer.transferDate), "dd MMM yyyy, h:mm a")}</td>
                  <td className="px-4 py-3 font-medium text-strawberry">{transfer.shop.name}</td>
                  <td className="px-4 py-3 text-cocoa/70">
                    <ul className="list-disc list-inside">
                      {transfer.items.map((item) => (
                        <li key={item.id}>
                          <span className="font-medium text-ink">{item.quantity}</span> x {item.product.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-ink">
                    {transfer.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
