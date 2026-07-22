"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { rawMaterialSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createRawMaterial(data: z.infer<typeof rawMaterialSchema>) {
  const result = rawMaterialSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.rawMaterial.create({
      data: {
        name: result.data.name,
        unit: result.data.unit,
        quantity: result.data.quantity,
        unitCost: result.data.unitCost,
        lowStockQuantity: result.data.lowStockQuantity,
        supplier: result.data.supplier,
      },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateRawMaterial(id: string, data: z.infer<typeof rawMaterialSchema>) {
  const result = rawMaterialSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.rawMaterial.update({
      where: { id },
      data: {
        name: result.data.name,
        unit: result.data.unit,
        quantity: result.data.quantity,
        unitCost: result.data.unitCost,
        lowStockQuantity: result.data.lowStockQuantity,
        supplier: result.data.supplier,
      },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteRawMaterial(id: string) {
  try {
    await prisma.rawMaterial.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    return { error: "Failed to delete raw material." };
  }
}
