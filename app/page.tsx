import { AlertTriangle, Boxes, IndianRupee, Package, Users } from "lucide-react";
import { DashboardSummaryCharts } from "@/components/DashboardSummaryCharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { getAnalyticsData } from "@/lib/analytics";
import { getDashboardData } from "@/lib/dashboard";
import { money } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [{ totals, products, employees }, analyticsData] = await Promise.all([getDashboardData(), getAnalyticsData()]);
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

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="surface-card">
          <div className="card-toolbar font-semibold">Product Snapshot</div>
          <table className="w-full border-collapse">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Product</th>
                <th className="table-cell">Category</th>
                <th className="table-cell">Factory</th>
                <th className="table-cell">Value</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 && (
                <tr>
                  <td className="table-cell text-center text-cocoa/60" colSpan={4}>
                    No products yet. Add factory inventory to populate this snapshot.
                  </td>
                </tr>
              )}
              {recentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="table-cell font-medium">{product.name}</td>
                  <td className="table-cell">{product.category}</td>
                  <td className="table-cell">{product.factoryQuantity}</td>
                  <td className="table-cell">{money(product.factoryQuantity * product.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="surface-card">
          <div className="card-toolbar font-semibold">Employee Snapshot</div>
          <table className="w-full border-collapse">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Employee</th>
                <th className="table-cell">Status</th>
                <th className="table-cell">Monthly Salary</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.length === 0 && (
                <tr>
                  <td className="table-cell text-center text-cocoa/60" colSpan={3}>
                    No employees yet. Add staff records to track salaries and balances.
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
