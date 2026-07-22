"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { shopSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createShop(data: z.infer<typeof shopSchema>) {
  const result = shopSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.shop.create({
      data: {
        name: result.data.name,
        managerName: result.data.managerName,
        mobileNumber: result.data.mobileNumber,
        address: result.data.address,
      },
    });
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateShop(id: string, data: z.infer<typeof shopSchema>) {
  const result = shopSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.shop.update({
      where: { id },
      data: {
        name: result.data.name,
        managerName: result.data.managerName,
        mobileNumber: result.data.mobileNumber,
        address: result.data.address,
      },
    });
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deactivateShop(id: string) {
  try {
    await prisma.shop.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function activateShop(id: string) {
  try {
    await prisma.shop.update({
      where: { id },
      data: { isActive: true },
    });
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteShop(id: string) {
  try {
    await prisma.shop.delete({
      where: { id },
    });
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    return { error: "Cannot delete shop with existing inventory or transfers. Deactivate it instead." };
  }
}
