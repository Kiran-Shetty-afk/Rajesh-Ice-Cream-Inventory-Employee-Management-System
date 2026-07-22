import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { SalesDashboard } from "@/components/SalesDashboard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const [sales, shops, products] = await Promise.all([
    prisma.dailySale.findMany({
      include: {
        shop: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { date: "desc" }
    }),
    prisma.shop.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ orderBy: { name: "asc" } })
  ]);

  const data = {
    sales,
    shops,
    products,
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader 
          title="Sales Dashboard" 
          description="View shop revenue, trends, and detailed sales reports." 
        />
        <Link href="/sales/new" className="primary-button">
          New Daily Sale
        </Link>
      </div>

      <SalesDashboard data={data} />
    </>
  );
}
