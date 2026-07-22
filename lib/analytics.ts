import { prisma } from "@/lib/prisma";

export type AnalyticsProduct = {
  id: string;
  name: string;
  category: string;
  flavor: string;
  unitPrice: number;
  factoryQuantity: number;
  lowStockQuantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shopStocks: {
    shopId: string;
    shopName: string;
    quantity: number;
    updatedAt: string;
  }[];
};

export type AnalyticsTransfer = {
  id: string;
  transferNo: string;
  transferDate: string;
  shopId: string;
  shopName: string;
  quantity: number;
  value: number;
  items: {
    productId: string;
    productName: string;
    category: string;
    flavor: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export type AnalyticsRawMaterial = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitCost: number;
  lowStockQuantity: number;
  supplier: string | null;
};

export type AnalyticsShop = {
  id: string;
  name: string;
  managerName: string | null;
  isActive: boolean;
};

export type AnalyticsData = {
  products: AnalyticsProduct[];
  transfers: AnalyticsTransfer[];
  rawMaterials: AnalyticsRawMaterial[];
  shops: AnalyticsShop[];
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const [products, transfers, rawMaterials, shops] = await Promise.all([
    prisma.product.findMany({
      include: { shopStocks: { include: { shop: true } } },
      orderBy: { name: "asc" }
    }),
    prisma.stockTransfer.findMany({
      include: { shop: true, items: { include: { product: true } } },
      orderBy: { transferDate: "desc" }
    }),
    prisma.rawMaterial.findMany({ orderBy: { name: "asc" } }),
    prisma.shop.findMany({ orderBy: { name: "asc" } })
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      flavor: product.flavor,
      unitPrice: product.unitPrice,
      factoryQuantity: product.factoryQuantity,
      lowStockQuantity: product.lowStockQuantity,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      shopStocks: product.shopStocks.map((stock) => ({
        shopId: stock.shopId,
        shopName: stock.shop.name,
        quantity: stock.quantity,
        updatedAt: stock.updatedAt.toISOString()
      }))
    })),
    transfers: transfers.map((transfer) => {
      const items = transfer.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        category: item.product.category,
        flavor: item.product.flavor,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }));

      return {
        id: transfer.id,
        transferNo: transfer.transferNo,
        transferDate: transfer.transferDate.toISOString(),
        shopId: transfer.shopId,
        shopName: transfer.shop.name,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        value: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
        items
      };
    }),
    rawMaterials: rawMaterials.map((material) => ({
      id: material.id,
      name: material.name,
      unit: material.unit,
      quantity: material.quantity,
      unitCost: material.unitCost,
      lowStockQuantity: material.lowStockQuantity,
      supplier: material.supplier
    })),
    shops: shops.map((shop) => ({
      id: shop.id,
      name: shop.name,
      managerName: shop.managerName,
      isActive: shop.isActive
    }))
  };
}
