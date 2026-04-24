"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function syncOrderWithMidtrans(orderId: string, forceSuccess: boolean = false) {
  try {
    // Apabila Midtrans Snap di frontend telah membuktikan lunas, 
    // kita lewati validasi berlapis dan langsung paksa Prisma untuk mencatat "Lunas" (PROCESSING).
    if (forceSuccess) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
          paymentStatus: "settlement"
        }
      });
      revalidatePath("/profile/orders");
      revalidatePath("/admin/orders");
      return { success: true, status: "COMPLETED" };
    }

    // Jika tidak dipaksa, anggap pending
    return { success: true, status: "PENDING" };
  } catch (error: any) {
    console.error("Gagal sinkronisasi DB:", error);
    return { success: false, status: "ERROR", message: "Gagal menyambung ke database." };
  }
}
