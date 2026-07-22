"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: "Product" | "Shop" | "Employee" | "Supplier";
  href: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const search = query.toLowerCase();
  
  const [products, shops, employees, suppliers] = await Promise.all([
    prisma.product.findMany({
      where: { name: { contains: search } },
      take: 5
    }),
    prisma.shop.findMany({
      where: { name: { contains: search } },
      take: 5
    }),
    prisma.employee.findMany({
      where: { name: { contains: search } },
      take: 5
    }),
    prisma.supplier.findMany({
      where: { name: { contains: search } },
      take: 5
    })
  ]);

  const results: SearchResult[] = [
    ...products.map(p => ({
      id: p.id,
      title: p.name,
      subtitle: `${p.category} - ${p.flavor}`,
      type: "Product" as const,
      href: `/inventory?search=${encodeURIComponent(p.name)}`
    })),
    ...shops.map(s => ({
      id: s.id,
      title: s.name,
      subtitle: s.address || "Shop",
      type: "Shop" as const,
      href: `/shops`
    })),
    ...employees.map(e => ({
      id: e.id,
      title: e.name,
      subtitle: `Code: ${e.employeeCode}`,
      type: "Employee" as const,
      href: `/employees`
    })),
    ...suppliers.map(s => ({
      id: s.id,
      title: s.name,
      subtitle: s.contactNumber || "Supplier",
      type: "Supplier" as const,
      href: `/suppliers`
    }))
  ];

  return results;
}
