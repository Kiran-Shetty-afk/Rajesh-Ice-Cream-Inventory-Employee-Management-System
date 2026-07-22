"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { dailySaleSchema, dailySaleItemSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createDailySale(data: z.infer<typeof dailySaleSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = dailySaleSchema.safeParse(data);
  if (!result.success) return { error: "Validation failed" };

  try {
    const { shopId, date, notes, items } = result.data;
    
    // Group and aggregate items by product in case of duplicates
    const aggregatedItems = Array.from(
      items
        .reduce((map, item) => {
          const existing = map.get(item.productId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.totalPrice += item.totalPrice;
            existing.wastage += item.wastage;
            existing.returned += item.returned;
          } else {
            map.set(item.productId, { ...item });
          }
          return map;
        }, new Map<string, z.infer<typeof dailySaleItemSchema>>())
        .values()
    );

    const totalQuantity = aggregatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = aggregatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Use a Prisma transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Verify enough shop stock for each item
      for (const item of aggregatedItems) {
        const inventory = await tx.shopInventory.findUnique({
          where: {
            shopId_productId: {
              shopId,
              productId: item.productId,
            },
          },
        });

        if (!inventory) {
          throw new Error(`Product inventory not found in shop: ${item.productId}`);
        }
        
        // Sold + Wastage decreases stock. (Returns don't decrease stock, they are just noted, 
        // or actually they might go back into stock? Usually returns are spoiled, let's keep it simple: 
        // quantity sold is what goes out of stock. If they mention wastage separately, we decrease it too)
        const totalDeduct = item.quantity + item.wastage;
        if (inventory.quantity < totalDeduct) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          throw new Error(`Not enough shop stock for ${product?.name ?? item.productId}. Stock: ${inventory.quantity}, Required: ${totalDeduct}`);
        }
      }

      // 2. Create the daily sale record
      const dailySale = await tx.dailySale.create({
        data: {
          shopId,
          date,
          notes,
          totalAmount,
          totalQuantity,
        },
      });

      // 3. Process each item: deduct shop stock, create sale item
      for (const item of aggregatedItems) {
        const totalDeduct = item.quantity + item.wastage;
        
        await tx.shopInventory.update({
          where: {
            shopId_productId: {
              shopId,
              productId: item.productId,
            },
          },
          data: {
            quantity: {
              decrement: totalDeduct,
            },
          },
        });

        await tx.dailySaleItem.create({
          data: {
            dailySaleId: dailySale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            wastage: item.wastage,
            returned: item.returned,
          },
        });
      }
    });

    revalidatePath("/sales");
    revalidatePath("/inventory");
    revalidatePath("/shops");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
