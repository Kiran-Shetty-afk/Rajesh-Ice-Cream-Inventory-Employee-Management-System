import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: "Mango Kulfi", category: "Kulfi", flavor: "Mango", unitPrice: 25, factoryQuantity: 240, lowStockQuantity: 40 },
    { name: "Chocolate Cup", category: "Cups", flavor: "Chocolate", unitPrice: 35, factoryQuantity: 180, lowStockQuantity: 35 },
    { name: "Vanilla Family Pack", category: "Family Packs", flavor: "Vanilla", unitPrice: 180, factoryQuantity: 45, lowStockQuantity: 15 },
    { name: "Strawberry Cone", category: "Cones", flavor: "Strawberry", unitPrice: 40, factoryQuantity: 95, lowStockQuantity: 25 }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replaceAll(" ", "-") },
      update: product,
      create: { id: product.name.toLowerCase().replaceAll(" ", "-"), ...product }
    });
  }

  const rawMaterials = [
    { name: "Milk", unit: "litre", quantity: 500, unitCost: 48, lowStockQuantity: 100 },
    { name: "Sugar", unit: "kg", quantity: 180, unitCost: 42, lowStockQuantity: 50 },
    { name: "Mango Pulp", unit: "kg", quantity: 65, unitCost: 130, lowStockQuantity: 20 }
  ];

  for (const material of rawMaterials) {
    await prisma.rawMaterial.upsert({
      where: { id: material.name.toLowerCase().replaceAll(" ", "-") },
      update: material,
      create: { id: material.name.toLowerCase().replaceAll(" ", "-"), ...material }
    });
  }

  const mainShop = await prisma.shop.upsert({
    where: { id: "main-shop" },
    update: {},
    create: { id: "main-shop", name: "Rajesh Icecream Main Shop", managerName: "Owner", mobileNumber: "9999999999" }
  });

  const productList = await prisma.product.findMany();
  for (const product of productList) {
    await prisma.shopInventory.upsert({
      where: { shopId_productId: { shopId: mainShop.id, productId: product.id } },
      update: {},
      create: { shopId: mainShop.id, productId: product.id, quantity: Math.floor(product.factoryQuantity / 4) }
    });
  }

  const employees = [
    { employeeCode: "EMP-001", name: "Ramesh Kumar", mobileNumber: "9000000001", joiningDate: new Date("2025-06-19"), monthlySalary: 18000 },
    { employeeCode: "EMP-002", name: "Suresh Yadav", mobileNumber: "9000000002", joiningDate: new Date("2026-02-05"), monthlySalary: 16000 }
  ];

  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { employeeCode: employee.employeeCode },
      update: employee,
      create: employee
    });
  }

  const ramesh = await prisma.employee.findUnique({ where: { employeeCode: "EMP-001" } });
  if (ramesh) {
    const existingLoans = await prisma.employeeLoan.count({ where: { employeeId: ramesh.id } });
    if (existingLoans === 0) {
      await prisma.employeeLoan.createMany({
        data: [
          { employeeId: ramesh.id, amount: 500, loanDate: new Date("2025-06-19"), note: "Personal Expense" },
          { employeeId: ramesh.id, amount: 1000, loanDate: new Date("2025-07-05"), note: "Emergency" }
        ]
      });
    }
  }

  await prisma.appSetting.upsert({
    where: { key: "businessName" },
    update: { value: "Rajesh Icecream" },
    create: { key: "businessName", value: "Rajesh Icecream" }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
