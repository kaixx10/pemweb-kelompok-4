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
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
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

/**
 * CHECKOUT ORDER (Dari User / Pembeli)
 * Menukar isi keranjang menjadi sebuah tagihan permanen.
 */
export async function processCheckout(shippingAddress: string, items: any[], subtotal: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
       return { success: false, error: "Silakan login terlebih dahulu untuk membuat pesanan." };
    }

    const userId = (session.user as any).id;
    
    // Ongkos kirim tetap (Simulasi)
    const shippingCost = 25000;
    const finalTotal = subtotal + shippingCost;

    // Buat nomor resi yang anti-bentrok 100% menggunakan Timestamp + Randomizer
    const randomHex = Math.random().toString(16).substr(2, 4).toUpperCase();
    const orderId = `NEO-${Date.now()}-${randomHex}`;

    // 1. Catat Struk Tagihan (Order & OrderItems) PENDING ke MySQL
    const newOrder = await prisma.order.create({
       data: {
         id: orderId,
         userId: userId,
         total: finalTotal,
         shippingAddress: shippingAddress,
         shippingCost: shippingCost,
         status: "PENDING", // Belum bayar
         orderItems: {
            create: items.map((item, index) => ({
               id: `${orderId}-${index}`, // Pakai Index array biar 100% beda meskipun produknya kembar varian
               productId: String(item.id).split('-')[0], // Mencegah masuknya id varian gabungan ke foreign id produk
               quantity: item.quantity,
               price: item.price
            }))
         }
       }
    });

    // 2. Kosongkan Keranjang Database milik User ini (karena sudah berpindah ke Struk Order)
    const userCart = await prisma.cart.findUnique({ where: { userId } });
    if (userCart) {
       await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } });
    }
    // 3. Minta Token SNAP Kasir ke Satelit Midtrans (Mode Sandbox)
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY || "";
    // Konversi Kunci ke dalam Format Rahasia (Base64) yang diminta Midtrans
    const encodedKey = Buffer.from(midtransServerKey + ":").toString("base64");

    const midtransResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${encodedKey}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: finalTotal,
        },
        customer_details: {
          first_name: session.user.name || "Pelanggan",
          email: session.user.email || "guest@neostore.com",
          // Karena kita pakai gabungan string dari frontend untuk shippingAddress
        }
      })
    });

    const snapData = await midtransResponse.json();
    if (!midtransResponse.ok) {
       console.error("Midtrans Error:", snapData);
       throw new Error(`Midtrans menolak kunci Anda! Pesan: ${snapData.error_messages ? snapData.error_messages[0] : "Token Gagal"}`);
    }
    // 4. Simpan snapToken secara permanen ke Database agar bisa dilanjutkan kapanpun
    await prisma.order.update({
       where: { id: orderId },
       data: { 
         // @ts-ignore: Mematikan radar error TS sementara karena Client IDE tertinggal dari Skema Database
         snapToken: snapData.token 
       }
    });

    // Refresh halaman agar badge Navbar dan halaman Orders ter-update
    revalidatePath("/profile/orders");
    
    return { success: true, orderId: orderId, snapToken: snapData.token };
  } catch (error: any) {
    console.error("Gagal memproses checkout:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat memproses pesanan." };
  }
}
