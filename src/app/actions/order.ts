"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    const session = await getServerSession(authOptions);
    
    // Keamanan super ketat: Hanya ADMIN yang boleh mengubah status
    if (!session || session.user.role !== "ADMIN") {
      throw new Error("Akses ditolak: Anda bukan Admin.");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    // Refresh halaman order dan dashboard agar omset terbaru muncul seketika
    revalidatePath("/admin");
    revalidatePath("/admin/orders");

    return { success: true, data: updatedOrder };
  } catch (error: any) {
    console.error("Gagal update status order:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}
