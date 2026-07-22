import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { DailySalesForm } from "@/components/DailySalesForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewDailySalePage() {
  const [shops, products] = await Promise.all([
    prisma.shop.findMany({
      include: { stocks: true },
      orderBy: { name: "asc" }
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <Link href="/sales" className="text-sm font-medium text-cocoa/60 hover:text-strawberry flex items-center gap-1 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Sales Dashboard
        </Link>
        <PageHeader 
          title="New Daily Sale" 
          description="Enter end-of-day sales summary for a shop." 
        />
      </div>

      <div className="surface-card max-w-4xl">
        <DailySalesForm shops={shops} products={products} />
      </div>
    </>
  );
}
