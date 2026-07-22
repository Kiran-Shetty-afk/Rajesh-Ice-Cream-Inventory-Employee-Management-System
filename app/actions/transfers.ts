"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stockTransferSchema } from "@/lib/schemas";
import { z } from "zod";

function generateTransferNo(): string {
  return `TR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
}

export async function createTransfer(data: z.infer<typeof stockTransferSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = stockTransferSchema.safeParse(data);
  if (!result.success) return { error: "Validation failed" };

  try {
    const { shopId, items, note } = result.data;
    const transferItems = Array.from(
      items
        .reduce((map, item) => {
          map.set(item.productId, (map.get(item.productId) ?? 0) + item.quantity);
          return map;
        }, new Map<string, number>())
        .entries()
    ).map(([productId, quantity]) => ({ productId, quantity }));

    // Use a Prisma transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Verify enough factory stock for each item
      for (const item of transferItems) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.factoryQuantity < item.quantity) {
          throw new Error(`Not enough factory stock for ${product.name}`);
        }
      }

      // 2. Create the transfer record
      const transfer = await tx.stockTransfer.create({
        data: {
          shopId,
          transferNo: generateTransferNo(),
          note,
        },
      });

      // 3. Process each item: deduct factory stock, increment shop stock, create transfer item
      for (const item of transferItems) {
        const product = await tx.product.update({
          where: { id: item.productId },
          data: {
            factoryQuantity: {
              decrement: item.quantity,
            },
          },
        });

        await tx.shopInventory.upsert({
          where: {
            shopId_productId: {
              shopId,
              productId: item.productId,
            },
          },
          create: {
            shopId,
            productId: item.productId,
            quantity: item.quantity,
          },
          update: {
            quantity: {
              increment: item.quantity,
            },
          },
        });

        await tx.stockTransferItem.create({
          data: {
            transferId: transfer.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product.unitPrice,
          },
        });
      }
    });

    revalidatePath("/transfers");
    revalidatePath("/inventory");
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
