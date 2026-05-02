"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function syncOrderWithMidtrans(orderId: string, forceSuccess: boolean = false, cancel: boolean = false) {
  try {
    if (forceSuccess) {
      // Ambil semua item dari order ini
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
      });

      // Kurangi stok untuk setiap produk yang dibeli
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
          paymentStatus: "settlement"
        }
      });
      revalidatePath("/");
      revalidatePath("/profile/orders");
      revalidatePath("/admin/orders");
      revalidatePath("/admin/products");
      return { success: true, status: "COMPLETED" };
    }

    if (cancel) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: "cancelled"
        }
      });
      revalidatePath("/profile/orders");
      revalidatePath("/admin/orders");
      return { success: true, status: "CANCELLED" };
    }

    // Jika tidak dipaksa, anggap pending
    return { success: true, status: "PENDING" };
  } catch (error: any) {
    console.error("Gagal sinkronisasi DB:", error);
    return { success: false, status: "ERROR", message: "Gagal menyambung ke database." };
  }
}
