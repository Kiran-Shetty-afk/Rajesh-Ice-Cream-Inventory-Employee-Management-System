import { PageHeader } from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import { CalendarView, type CalendarEvent } from "@/components/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [sales, transfers, purchases, loans, wastages] = await Promise.all([
    prisma.dailySale.findMany({ include: { shop: true } }),
    prisma.stockTransfer.findMany({ include: { shop: true } }),
    prisma.purchase.findMany({ include: { supplier: true } }),
    prisma.employeeLoan.findMany({ include: { employee: true } }),
    prisma.wastage.findMany({ include: { product: true } }),
  ]);

  const events: CalendarEvent[] = [
    ...sales.map(s => ({
      id: `sale-${s.id}`,
      title: `Sale: ${s.shop.name}`,
      date: s.date.toISOString(),
      type: "sale" as const,
      amount: s.totalAmount
    })),
    ...transfers.map(t => ({
      id: `transfer-${t.id}`,
      title: `Transfer: ${t.shop.name}`,
      date: t.transferDate.toISOString(),
      type: "transfer" as const
    })),
    ...purchases.map(p => ({
      id: `purchase-${p.id}`,
      title: `Purchase: ${p.supplier.name}`,
      date: p.purchaseDate.toISOString(),
      type: "purchase" as const,
      amount: p.totalAmount
    })),
    ...loans.map(l => ({
      id: `loan-${l.id}`,
      title: `Loan: ${l.employee.name}`,
      date: l.loanDate.toISOString(),
      type: "loan" as const,
      amount: l.amount
    })),
    ...wastages.map(w => ({
      id: `wastage-${w.id}`,
      title: `Wastage: ${w.product.name} (${w.quantity})`,
      date: w.date.toISOString(),
      type: "wastage" as const,
      amount: w.cost
    }))
  ];

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader 
          title="Enterprise Calendar" 
          description="Unified view of sales, transfers, purchases, and employee events." 
        />
      </div>

      <CalendarView events={events} />
    </>
  );
}
