"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createProduct(data: z.infer<typeof productSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = productSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.product.create({
      data: {
        name: result.data.name,
        category: result.data.category,
        flavor: result.data.flavor,
        unitPrice: result.data.unitPrice,
        factoryQuantity: result.data.factoryQuantity,
        lowStockQuantity: result.data.lowStockQuantity,
      },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateProduct(id: string, data: z.infer<typeof productSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = productSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: result.data.name,
        category: result.data.category,
        flavor: result.data.flavor,
        unitPrice: result.data.unitPrice,
        factoryQuantity: result.data.factoryQuantity,
        lowStockQuantity: result.data.lowStockQuantity,
      },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deactivateProduct(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    await prisma.product.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteProduct(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    // Only delete if there are no related transfers/stocks. 
    // Ideally this could throw an FK constraint error which we catch.
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    return { error: "Cannot delete product that has existing inventory or transfer records. Deactivate it instead." };
  }
}
