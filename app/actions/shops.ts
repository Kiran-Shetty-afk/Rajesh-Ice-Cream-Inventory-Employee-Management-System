"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { shopSchema } from "@/lib/schemas";
import { z } from "zod";
import { withErrorHandling } from "@/lib/actions";

export async function createShop(data: z.infer<typeof shopSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = shopSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  return withErrorHandling(async () => {
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
  });
}

export async function updateShop(id: string, data: z.infer<typeof shopSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = shopSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  return withErrorHandling(async () => {
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
  });
}

export async function deactivateShop(id: string): Promise<{ success?: boolean; error?: any }> {
  return withErrorHandling(async () => {
    await prisma.shop.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath("/shops");
    return { success: true };
  });
}

export async function activateShop(id: string): Promise<{ success?: boolean; error?: any }> {
  return withErrorHandling(async () => {
    await prisma.shop.update({
      where: { id },
      data: { isActive: true },
    });
    revalidatePath("/shops");
    return { success: true };
  });
}

export async function deleteShop(id: string): Promise<{ success?: boolean; error?: any }> {
  return withErrorHandling(
    async () => {
      await prisma.shop.delete({
        where: { id },
      });
      revalidatePath("/shops");
      return { success: true };
    },
    "Cannot delete shop with existing inventory or transfers. Deactivate it instead."
  );
}
