"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createSupplier(data: z.infer<typeof supplierSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = supplierSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.supplier.create({
      data: {
        name: result.data.name,
        contactNumber: result.data.contactNumber,
        gstNumber: result.data.gstNumber,
        address: result.data.address,
        paymentDue: result.data.paymentDue,
      },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function updateSupplier(id: string, data: z.infer<typeof supplierSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = supplierSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.supplier.update({
      where: { id },
      data: {
        name: result.data.name,
        contactNumber: result.data.contactNumber,
        gstNumber: result.data.gstNumber,
        address: result.data.address,
        paymentDue: result.data.paymentDue,
      },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deactivateSupplier(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    await prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function activateSupplier(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    await prisma.supplier.update({
      where: { id },
      data: { isActive: true },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteSupplier(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    await prisma.supplier.delete({
      where: { id },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (err: any) {
    return { error: "Cannot delete supplier with existing purchases. Deactivate it instead." };
  }
}
