"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { wastageSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createWastage(data: z.infer<typeof wastageSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = wastageSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Log wastage
      await tx.wastage.create({
        data: {
          date: result.data.date,
          shopId: result.data.shopId || null,
          productId: result.data.productId,
          quantity: result.data.quantity,
          reason: result.data.reason,
          cost: result.data.cost,
        },
      });

      // 2. Decrement stock
      if (result.data.shopId) {
        // Shop wastage
        const inventory = await tx.shopInventory.findUnique({
          where: {
            shopId_productId: {
              shopId: result.data.shopId,
              productId: result.data.productId
            }
          }
        });

        if (!inventory || inventory.quantity < result.data.quantity) {
          throw new Error("Insufficient stock in the selected shop for this wastage.");
        }

        await tx.shopInventory.update({
          where: {
            shopId_productId: {
              shopId: result.data.shopId,
              productId: result.data.productId
            }
          },
          data: {
            quantity: { decrement: result.data.quantity }
          }
        });
      } else {
        // Factory wastage
        const product = await tx.product.findUnique({ where: { id: result.data.productId } });
        if (!product || product.factoryQuantity < result.data.quantity) {
          throw new Error("Insufficient factory stock for this wastage.");
        }

        await tx.product.update({
          where: { id: result.data.productId },
          data: {
            factoryQuantity: { decrement: result.data.quantity }
          }
        });
      }
    });

    revalidatePath("/wastage");
    revalidatePath("/inventory");
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: err.message || "An unexpected error occurred. Please try again later." };
  }
}

export async function deleteWastage(id: string): Promise<{ success?: boolean; error?: any }> {
  try {
    await prisma.$transaction(async (tx) => {
      const wastage = await tx.wastage.findUnique({ where: { id } });
      if (!wastage) throw new Error("Wastage record not found.");

      // Revert stock
      if (wastage.shopId) {
        await tx.shopInventory.update({
          where: {
            shopId_productId: { shopId: wastage.shopId, productId: wastage.productId }
          },
          data: { quantity: { increment: wastage.quantity } }
        });
      } else {
        await tx.product.update({
          where: { id: wastage.productId },
          data: { factoryQuantity: { increment: wastage.quantity } }
        });
      }

      // Delete record
      await tx.wastage.delete({ where: { id } });
    });

    revalidatePath("/wastage");
    revalidatePath("/inventory");
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: err.message || "Cannot delete wastage record." };
  }
}
