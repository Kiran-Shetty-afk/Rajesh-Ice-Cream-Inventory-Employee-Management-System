"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { purchaseSchema } from "@/lib/schemas";
import { z } from "zod";

export async function createPurchase(data: z.infer<typeof purchaseSchema>): Promise<{ success?: boolean; error?: any }> {
  const result = purchaseSchema.safeParse(data);
  if (!result.success) return { error: result.error.format() };

  try {
    const totalAmount = result.data.items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);

    await prisma.$transaction(async (tx) => {
      // 1. Create Purchase
      const purchase = await tx.purchase.create({
        data: {
          supplierId: result.data.supplierId,
          invoiceNumber: result.data.invoiceNumber,
          purchaseDate: result.data.purchaseDate,
          note: result.data.note,
          totalAmount,
          items: {
            create: result.data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              totalPrice: item.quantity * item.costPrice,
              mfgDate: item.mfgDate,
              expiryDate: item.expiryDate
            }))
          }
        }
      });

      // 2. Auto-increment factory stock for each product
      for (const item of result.data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            factoryQuantity: {
              increment: item.quantity
            }
          }
        });
      }

      // 3. Update Supplier payment due
      await tx.supplier.update({
        where: { id: result.data.supplierId },
        data: {
          paymentDue: {
            increment: totalAmount
          }
        }
      });
    });

    revalidatePath("/purchases");
    revalidatePath("/suppliers");
    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    console.error("[Action Error]:", err);
    if (err.code === "P2002") {
      return { error: "A purchase with this Invoice Number already exists." };
    }
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
