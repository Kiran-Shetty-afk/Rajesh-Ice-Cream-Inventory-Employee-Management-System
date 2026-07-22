import React from "react";
import { AlertTriangle, Boxes, IndianRupee, Package, Users } from "lucide-react";
import { DashboardSummaryCharts } from "@/components/DashboardSummaryCharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { getAnalyticsData } from "@/lib/analytics";
import { getDashboardData } from "@/lib/dashboard";
import { money } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function DashboardPage(): Promise<React.ReactElement> {
  const [{ totals, products, employees, expiringSoonItems }, analyticsData] = await Promise.all([getDashboardData(), getAnalyticsData()]);
  const recentProducts = products.slice(0, 6);
  const recentEmployees = employees.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Factory stock, shop inventory, employee finance, and risk alerts in one place."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Total Products" value={String(totals.totalProducts)} detail="Factory catalog items" icon={Package} />
        <StatCard label="Factory Stock" value={String(totals.totalFactoryStock)} detail="Units available at factory" icon={Boxes} />
        <StatCard label="Inventory Value" value={money(totals.inventoryValue)} detail="Factory + shop stock value" icon={IndianRupee} />
        <StatCard label="Low Stock" value={String(totals.lowStockProducts)} detail="Products needing attention" icon={AlertTriangle} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-4">
        <StatCard label="Employees" value={String(totals.totalEmployees)} detail={`${totals.activeEmployees} active staff`} icon={Users} />
        <StatCard label="Salary Liability" value={money(totals.salaryLiability)} detail="Calculated from joining date" icon={IndianRupee} />
        <StatCard label="Bonus Liability" value={money(totals.bonusLiability)} detail="8% after 6 months" icon={IndianRupee} />
        <StatCard label="Total Loans" value={money(totals.totalLoans)} detail="Loan history balance" icon={IndianRupee} />
      </section>

      <DashboardSummaryCharts data={analyticsData} />

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="surface-card">
          <div className="card-toolbar font-semibold">Product Snapshot</div>
          <table className="w-full border-collapse">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Product</th>
                <th className="table-cell">Factory</th>
                <th className="table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 && (
                <tr>
                  <td className="table-cell text-center text-cocoa/60" colSpan={3}>
                    No products yet. Add factory inventory to populate this snapshot.
                  </td>
                </tr>
              )}
              {recentProducts.map((product) => {
                const isLowStock = product.factoryQuantity <= product.lowStockQuantity;
                return (
                  <tr key={product.id}>
                    <td className="table-cell font-medium">{product.name}</td>
                    <td className="table-cell">{product.factoryQuantity}</td>
                    <td className="table-cell">
                      {isLowStock ? (
                        <span className="inline-flex items-center rounded-full bg-strawberry/10 px-2 py-0.5 text-xs font-medium text-strawberry">Low Stock</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">In Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="surface-card">
          <div className="card-toolbar font-semibold flex justify-between">
            <span>Expiring Soon</span>
            <span className="text-xs font-normal text-strawberry bg-strawberry/10 px-2 py-1 rounded-md">{expiringSoonItems.length} alerts</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="table-head sticky top-0 bg-white/5 backdrop-blur-md">
                <tr>
                  <th className="table-cell">Product</th>
                  <th className="table-cell">Loc</th>
                  <th className="table-cell">Exp In</th>
                </tr>
              </thead>
              <tbody>
                {expiringSoonItems.length === 0 && (
                  <tr>
                    <td className="table-cell text-center text-cocoa/60" colSpan={3}>
                      No upcoming expiries in the next 7 days.
                    </td>
                  </tr>
                )}
                {expiringSoonItems.map((item, idx) => {
                  const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  return (
                    <tr key={idx}>
                      <td className="table-cell font-medium">{item.name} ({item.quantity})</td>
                      <td className="table-cell text-xs">{item.location}</td>
                      <td className="table-cell text-xs font-bold text-strawberry">
                        {daysLeft < 0 ? 'Expired' : `${daysLeft}d`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="surface-card">
          <div className="card-toolbar font-semibold">Employee Snapshot</div>
          <table className="w-full border-collapse">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Employee</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Salary</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.length === 0 && (
                <tr>
                  <td className="table-cell text-center text-cocoa/60" colSpan={3}>
                    No employees yet.
                  </td>
                </tr>
              )}
              {recentEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="table-cell font-medium">{employee.name}</td>
                  <td className="table-cell">{employee.status}</td>
                  <td className="table-cell">{money(employee.monthlySalary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
