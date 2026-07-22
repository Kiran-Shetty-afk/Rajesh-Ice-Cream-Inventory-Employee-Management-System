import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salarySummary } from "@/lib/finance";

type CsvCell = string | number | boolean | null | undefined;

function toCSV(headers: string[], rows: CsvCell[][]) {
  const escapeCell = (cell: CsvCell) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  const csvRows = [headers.map(escapeCell).join(",")];
  for (const row of rows) {
    csvRows.push(row.map(escapeCell).join(","));
  }
  return csvRows.join("\n");
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  
  let filename = "export.csv";
  let headers: string[] = [];
  let rows: CsvCell[][] = [];

  try {
    switch (type) {
      case "Factory Stock Report": {
        filename = "factory-stock.csv";
        headers = ["Product Name", "Category", "Flavor", "Unit Price", "Factory Quantity", "Value", "Status"];
        const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
        rows = products.map(p => [
          p.name, p.category, p.flavor, p.unitPrice, p.factoryQuantity, p.factoryQuantity * p.unitPrice, p.status
        ]);
        break;
      }

      case "Shop Stock Report": {
        filename = "shop-stock.csv";
        headers = ["Shop Name", "Product Name", "Category", "Quantity"];
        const shops = await prisma.shopInventory.findMany({
          include: { shop: true, product: true },
          orderBy: [{ shop: { name: "asc" } }, { product: { name: "asc" } }]
        });
        rows = shops.map(s => [
          s.shop.name, s.product.name, s.product.category, s.quantity
        ]);
        break;
      }

      case "Stock Transfer Report":
      case "Transfer History Report": {
        filename = "transfers.csv";
        headers = ["Transfer No", "Date", "Shop Name", "Product", "Category", "Flavor", "Quantity", "Unit Price", "Value", "Note"];
        const transfers = await prisma.stockTransfer.findMany({
          include: { shop: true, items: { include: { product: true } } },
          orderBy: { transferDate: "desc" }
        });
        rows = transfers.flatMap(t => t.items.map((item) => [
          t.transferNo,
          new Date(t.transferDate).toISOString(),
          t.shop.name,
          item.product.name,
          item.product.category,
          item.product.flavor,
          item.quantity,
          item.unitPrice,
          item.quantity * item.unitPrice,
          t.note || ""
        ]));
        break;
      }

      case "Inventory Valuation Report": {
        filename = "inventory-valuation.csv";
        headers = ["Product Name", "Category", "Flavor", "Factory Quantity", "Shop Quantity", "Total Quantity", "Unit Price", "Total Value"];
        const valuationProducts = await prisma.product.findMany({ include: { shopStocks: true }, orderBy: { name: "asc" } });
        rows = valuationProducts.map((product) => {
          const shopQuantity = product.shopStocks.reduce((sum, stock) => sum + stock.quantity, 0);
          const totalQuantity = product.factoryQuantity + shopQuantity;
          return [product.name, product.category, product.flavor, product.factoryQuantity, shopQuantity, totalQuantity, product.unitPrice, totalQuantity * product.unitPrice];
        });
        break;
      }

      case "Raw Material Report": {
        filename = "raw-materials.csv";
        headers = ["Raw Material", "Unit", "Quantity", "Unit Cost", "Value", "Low Stock Quantity", "Supplier"];
        const rawMaterials = await prisma.rawMaterial.findMany({ orderBy: { name: "asc" } });
        rows = rawMaterials.map((material) => [
          material.name,
          material.unit,
          material.quantity,
          material.unitCost,
          material.quantity * material.unitCost,
          material.lowStockQuantity,
          material.supplier || ""
        ]);
        break;
      }

      case "Product Report": {
        filename = "products.csv";
        headers = ["Product Name", "Category", "Flavor", "Unit Price", "Factory Quantity", "Low Stock Quantity", "Status"];
        const productRows = await prisma.product.findMany({ orderBy: { name: "asc" } });
        rows = productRows.map((product) => [product.name, product.category, product.flavor, product.unitPrice, product.factoryQuantity, product.lowStockQuantity, product.status]);
        break;
      }

      case "Category Report": {
        filename = "categories.csv";
        headers = ["Category", "Products", "Factory Quantity", "Factory Value"];
        const categoryProducts = await prisma.product.findMany({ orderBy: { category: "asc" } });
        rows = Object.values(categoryProducts.reduce<Record<string, { category: string; products: number; quantity: number; value: number }>>((acc, product) => {
          acc[product.category] ??= { category: product.category, products: 0, quantity: 0, value: 0 };
          acc[product.category].products += 1;
          acc[product.category].quantity += product.factoryQuantity;
          acc[product.category].value += product.factoryQuantity * product.unitPrice;
          return acc;
        }, {})).map((item) => [item.category, item.products, item.quantity, item.value]);
        break;
      }

      case "Flavor Report": {
        filename = "flavors.csv";
        headers = ["Flavor", "Products", "Factory Quantity", "Factory Value"];
        const flavorProducts = await prisma.product.findMany({ orderBy: { flavor: "asc" } });
        rows = Object.values(flavorProducts.reduce<Record<string, { flavor: string; products: number; quantity: number; value: number }>>((acc, product) => {
          acc[product.flavor] ??= { flavor: product.flavor, products: 0, quantity: 0, value: 0 };
          acc[product.flavor].products += 1;
          acc[product.flavor].quantity += product.factoryQuantity;
          acc[product.flavor].value += product.factoryQuantity * product.unitPrice;
          return acc;
        }, {})).map((item) => [item.flavor, item.products, item.quantity, item.value]);
        break;
      }

      case "Daily Inventory Report":
      case "Weekly Inventory Report":
      case "Monthly Inventory Report":
      case "Yearly Inventory Report": {
        filename = `${type.toLowerCase().replaceAll(" ", "-")}.csv`;
        headers = ["Product Name", "Category", "Flavor", "Factory Quantity", "Factory Value", "Updated At"];
        const periodProducts = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });
        rows = periodProducts.map((product) => [
          product.name,
          product.category,
          product.flavor,
          product.factoryQuantity,
          product.factoryQuantity * product.unitPrice,
          product.updatedAt.toISOString()
        ]);
        break;
      }

      case "Low Stock Report": {
        filename = "low-stock.csv";
        headers = ["Product Name", "Category", "Flavor", "Factory Quantity", "Low Stock Quantity", "Unit Price", "Value"];
        const lowStockProducts = await prisma.product.findMany({ orderBy: { name: "asc" } });
        rows = lowStockProducts
          .filter((product) => product.factoryQuantity > 0 && product.factoryQuantity <= product.lowStockQuantity)
          .map((product) => [product.name, product.category, product.flavor, product.factoryQuantity, product.lowStockQuantity, product.unitPrice, product.factoryQuantity * product.unitPrice]);
        break;
      }

      case "Out of Stock Report": {
        filename = "out-of-stock.csv";
        headers = ["Product Name", "Category", "Flavor", "Factory Quantity", "Low Stock Quantity", "Unit Price"];
        const outOfStockProducts = await prisma.product.findMany({ orderBy: { name: "asc" } });
        rows = outOfStockProducts
          .filter((product) => product.factoryQuantity <= 0)
          .map((product) => [product.name, product.category, product.flavor, product.factoryQuantity, product.lowStockQuantity, product.unitPrice]);
        break;
      }

      case "Employee Salary Report": {
        filename = "employee-salaries.csv";
        headers = ["Employee Code", "Name", "Joining Date", "Base Salary", "Bonus", "Total Loan", "Current Balance"];
        const employees = await prisma.employee.findMany({
          include: { loans: true },
          orderBy: { name: "asc" }
        });
        rows = employees.map(e => {
          const totalLoan = e.loans.reduce((sum, loan) => sum + loan.amount, 0);
          const summary = salarySummary(e.monthlySalary, e.joiningDate, totalLoan);
          return [
            e.employeeCode, e.name, new Date(e.joiningDate).toISOString().split('T')[0], e.monthlySalary, summary.bonus, summary.totalLoan, summary.currentBalance
          ];
        });
        break;
      }

      case "Bonus Report":
      case "Loan Report":
      case "Financial Summary Report": {
        filename = `${type.toLowerCase().replaceAll(" ", "-")}.csv`;
        headers = ["Employee Code", "Name", "Monthly Salary", "Bonus", "Total Loan", "Current Balance", "Status"];
        const financialEmployees = await prisma.employee.findMany({
          include: { loans: true },
          orderBy: { name: "asc" }
        });
        rows = financialEmployees.map((employee) => {
          const totalLoan = employee.loans.reduce((sum, loan) => sum + loan.amount, 0);
          const summary = salarySummary(employee.monthlySalary, employee.joiningDate, totalLoan);
          return [employee.employeeCode, employee.name, employee.monthlySalary, summary.bonus, summary.totalLoan, summary.currentBalance, employee.status];
        });
        break;
      }

      default:
        return new NextResponse("Report type not supported", { status: 400 });
    }

    const csvData = toCSV(headers, rows);
    
    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to generate export", { status: 500 });
  }
}
