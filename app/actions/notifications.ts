"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Notification } from "@prisma/client";

export type NotificationEvent = Notification | {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
};

export async function getNotifications(): Promise<NotificationEvent[]> {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  
  // Dynamically check for low stock and expiries
  const products = await prisma.product.findMany({
    include: { shopStocks: { include: { shop: true } } }
  });
  
  const dynamicAlerts = [];
  
  for (const product of products) {
    if (product.factoryQuantity <= product.lowStockQuantity) {
      dynamicAlerts.push({
        id: `low-stock-factory-${product.id}`,
        title: "Low Factory Stock",
        message: `${product.name} (${product.flavor}) is low in factory stock (${product.factoryQuantity} remaining).`,
        type: "LOW_STOCK",
        read: false,
        createdAt: new Date(),
      });
    }
    
    for (const stock of product.shopStocks) {
      if (stock.quantity <= product.lowStockQuantity) {
        dynamicAlerts.push({
          id: `low-stock-shop-${stock.id}`,
          title: "Low Shop Stock",
          message: `${product.name} is low in ${stock.shop.name} (${stock.quantity} remaining).`,
          type: "LOW_STOCK",
          read: false,
          createdAt: new Date(),
        });
      }
      
      if (stock.expiryDate) {
        const daysToExpiry = Math.ceil((stock.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysToExpiry <= 7 && daysToExpiry >= 0) {
          dynamicAlerts.push({
            id: `expiry-shop-${stock.id}`,
            title: "Expiring Soon",
            message: `${product.name} in ${stock.shop.name} expires in ${daysToExpiry} days.`,
            type: "EXPIRY",
            read: false,
            createdAt: new Date(),
          });
        } else if (daysToExpiry < 0) {
          dynamicAlerts.push({
            id: `expired-shop-${stock.id}`,
            title: "Product Expired",
            message: `${product.name} in ${stock.shop.name} has expired ${Math.abs(daysToExpiry)} days ago.`,
            type: "EXPIRY",
            read: false,
            createdAt: new Date(),
          });
        }
      }
    }
    
    // Also check factory expiry via recent PurchaseItems if we wanted, but schema doesn't link them to current global stock.
  }
  
  // Combine and sort
  const allNotifications = [...notifications, ...dynamicAlerts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  return allNotifications;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  // Only mark DB notifications as read
  if (!id.startsWith("low-stock-") && !id.startsWith("expiry-") && !id.startsWith("expired-")) {
    await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    revalidatePath("/");
  }
}
