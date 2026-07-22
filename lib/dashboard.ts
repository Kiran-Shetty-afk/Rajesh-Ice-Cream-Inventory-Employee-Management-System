import { prisma } from "@/lib/prisma";
import { salarySummary } from "@/lib/finance";

export async function getDashboardData() {
  const [products, shops, employees, rawMaterials] = await Promise.all([
    prisma.product.findMany({ include: { shopStocks: true } }),
    prisma.shop.findMany({ include: { stocks: true } }),
    prisma.employee.findMany({ include: { loans: true } }),
    prisma.rawMaterial.findMany()
  ]);

  const totalFactoryStock = products.reduce((sum, product) => sum + product.factoryQuantity, 0);
  const totalShopStock = products.reduce(
    (sum, product) => sum + product.shopStocks.reduce((stockSum, stock) => stockSum + stock.quantity, 0),
    0
  );
  const inventoryValue = products.reduce((sum, product) => {
    const shopStock = product.shopStocks.reduce((stockSum, stock) => stockSum + stock.quantity, 0);
    return sum + (product.factoryQuantity + shopStock) * product.unitPrice;
  }, 0);
  const lowStockProducts = products.filter((product) => product.factoryQuantity <= product.lowStockQuantity);

  const employeeSummaries = employees.map((employee) => {
    const totalLoan = employee.loans.reduce((sum, loan) => sum + loan.amount, 0);
    return salarySummary(employee.monthlySalary, employee.joiningDate, totalLoan);
  });

  const salaryLiability = employeeSummaries.reduce((sum, item) => sum + item.totalSalary, 0);
  const bonusLiability = employeeSummaries.reduce((sum, item) => sum + item.bonus, 0);
  const totalLoans = employeeSummaries.reduce((sum, item) => sum + item.totalLoan, 0);
  const outstandingBalance = employeeSummaries.reduce((sum, item) => sum + item.currentBalance, 0);

  return {
    products,
    shops,
    employees,
    rawMaterials,
    totals: {
      totalProducts: products.length,
      totalFactoryStock,
      totalShopStock,
      inventoryValue,
      lowStockProducts: lowStockProducts.length,
      totalEmployees: employees.length,
      activeEmployees: employees.filter((employee) => employee.status === "ACTIVE").length,
      inactiveEmployees: employees.filter((employee) => employee.status === "INACTIVE").length,
      salaryLiability,
      bonusLiability,
      totalLoans,
      outstandingBalance
    }
  };
}
