import { PageHeader } from "@/components/PageHeader";
import { money, salarySummary } from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import { EmployeeDialog } from "@/components/EmployeeForm";
import { EmployeeLoanDialog } from "@/components/EmployeeLoanForm";
import { Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({ include: { loans: true }, orderBy: { employeeCode: "asc" } });

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Employees" description="Salary, bonus eligibility, loan total, and current balance." />
        <EmployeeDialog />
      </div>

      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead >
              <tr>
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Mobile</th>
                <th className="px-4 py-2 font-medium text-right">Months</th>
                <th className="px-4 py-2 font-medium text-right">Salary</th>
                <th className="px-4 py-2 font-medium text-right">Bonus</th>
                <th className="px-4 py-2 font-medium text-right">Loans</th>
                <th className="px-4 py-2 font-medium text-right">Balance</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody >
              {employees.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-cocoa/60 text-sm">
                    No employees found. Add an employee to get started.
                  </td>
                </tr>
              )}
              {employees.map((employee) => {
                const totalLoan = employee.loans.reduce((sum, loan) => sum + loan.amount, 0);
                const summary = salarySummary(employee.monthlySalary, employee.joiningDate, totalLoan);
                return (
                  <tr key={employee.id} className={`hover:bg-vanilla/45 transition-colors ${employee.status === 'INACTIVE' ? 'opacity-75' : ''}`}>
                    <td className="px-4 py-3 font-medium text-ink">
                      {employee.employeeCode}
                      {employee.status === 'INACTIVE' && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-cocoa/10 text-cocoa/70 uppercase">Inactive</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{employee.name}</td>
                    <td className="px-4 py-3 text-cocoa/70">{employee.mobileNumber}</td>
                    <td className="px-4 py-3 text-right text-ink">{summary.months}</td>
                    <td className="px-4 py-3 text-right text-cocoa/70">{money(summary.totalSalary)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{money(summary.bonus)}</td>
                    <td className="px-4 py-3 text-right text-rose-600 font-medium">{money(summary.totalLoan)}</td>
                    <td className="px-4 py-3 text-right font-bold text-ink">{money(summary.currentBalance)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <EmployeeLoanDialog employeeId={employee.id} />
                        <EmployeeDialog 
                          employee={employee} 
                          trigger={
                            <button className="icon-button" title="Edit" aria-label={`Edit ${employee.name}`}>
                              <Edit className="w-4 h-4" />
                            </button>
                          } 
                        />
                      </div>
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
