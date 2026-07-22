"use server";

import { prisma } from "@/lib/prisma";
import { money, salarySummary } from "@/lib/finance";

interface ReportFilters {
  search?: string;
  status?: string;
  shopId?: string;
  startDate?: string;
  endDate?: string;
}

export async function getFactoryInventoryReport(filters?: ReportFilters) {
  const where: any = {};
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { category: { contains: filters.search } },
    ];
  }

  const products = await prisma.product.findMany({ 
    where,
    orderBy: [{ category: "asc" }, { name: "asc" }] 
  });
  
  return products
    .map(p => ({
      "Product": p.name,
      "Category": p.category,
      "Flavor": p.flavor,
      "Quantity": p.factoryQuantity,
      "Unit Price (₹)": p.unitPrice,
      "Total Value (₹)": p.factoryQuantity * p.unitPrice,
      "Status": p.factoryQuantity <= p.lowStockQuantity ? "Low Stock" : p.status
    }))
    .filter(p => !filters?.status || filters.status === "All stock statuses" || p.Status === filters.status);
}

export async function getShopInventoryReport(filters?: ReportFilters) {
  const where: any = {};
  if (filters?.shopId) {
    where.id = filters.shopId;
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { managerName: { contains: filters.search } }
    ];
  }

  const shops = await prisma.shop.findMany({
    where,
    include: { stocks: { include: { product: true } } },
    orderBy: { name: "asc" }
  });
  
  const report: any[] = [];
  
  for (const shop of shops) {
    if (shop.stocks.length === 0) {
      report.push({
        "Shop Name": shop.name,
        "Manager": shop.managerName || "-",
        "Product": "-",
        "Category": "-",
        "Quantity": 0,
        "Total Value (₹)": 0
      });
    } else {
      for (const stock of shop.stocks) {
        if (!filters?.search || stock.product.name.toLowerCase().includes(filters.search.toLowerCase()) || shop.name.toLowerCase().includes(filters.search.toLowerCase())) {
          report.push({
            "Shop Name": shop.name,
            "Manager": shop.managerName || "-",
            "Product": stock.product.name,
            "Category": stock.product.category,
            "Quantity": stock.quantity,
            "Total Value (₹)": stock.quantity * stock.product.unitPrice
          });
        }
      }
    }
  }
  
  return report;
}

export async function getEmployeeReport(filters?: ReportFilters) {
  const where: any = {};
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { employeeCode: { contains: filters.search } }
    ];
  }

  const employees = await prisma.employee.findMany({
    where,
    include: { loans: true },
    orderBy: { employeeCode: "asc" }
  });
  
  return employees.map(emp => {
    const totalLoan = emp.loans.reduce((sum, loan) => sum + loan.amount, 0);
    const summary = salarySummary(emp.monthlySalary, emp.joiningDate, totalLoan);
    
    return {
      "Emp ID": emp.employeeCode,
      "Name": emp.name,
      "Mobile": emp.mobileNumber,
      "Months Worked": summary.months,
      "Monthly Salary (₹)": emp.monthlySalary,
      "Earned Salary (₹)": summary.totalSalary,
      "Bonus (₹)": summary.bonus,
      "Loans Taken (₹)": summary.totalLoan,
      "Current Balance (₹)": summary.currentBalance,
      "Status": emp.status
    };
  });
}
