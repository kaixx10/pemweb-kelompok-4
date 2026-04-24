"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

/**
 * MENSINKRONKAN ZUSTAND KE DATABASE (Arah: Klien -> Server)
 * Tindakan barbar: Mengamankan seluruh isi Zustand dan menimpanya utuh ke MySQL.
 */
export async function syncCartToDB(zustandItems: any[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { success: false, message: "Belum login" };

    const userId = (session.user as any).id;

    // 1. Cari atau buat Cart untuk User ini
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // 2. Kosongkan isi keranjang di database (Reset)
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // 3. Masukkan item baru secara massal dari Zustand
    if (zustandItems.length > 0) {
      const dbItems = zustandItems.map((item) => {
        // ID produk di Zustand kadang berformat "ID-Color", ekstrak ID aslinya
        const realProductId = String(item.id).split('-')[0];
        
        return {
          cartId: cart.id,
          productId: realProductId,
          quantity: item.quantity,
          // Catatan: variantId dikosongkan sementara demi simplifikasi kecuali dibutuhkan di masa depan
        };
      });

      await prisma.cartItem.createMany({ data: dbItems });
    }

    return { success: true };
  } catch (error) {
    console.error("Gagal sinkronisasi keranjang ke DB:", error);
    return { success: false, error: "Gagal menyimpan keranjang permanen." };
  }
}

/**
 * MENARIK DATABASE KE ZUSTAND (Arah: Server -> Klien)
 * Jika User berpindah laptop, tarik data MySQL dan pulihkan ke layar!
 */
export async function getCartFromDB() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { success: false };

    const userId = (session.user as any).id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) return { success: true, items: [] };

    // Ubah bahasa Prisma ke bahasa Zustand
    const zustandFormat = cart.items.map((item) => {
      let emoji = "📦";
      try {
        if (item.product.images) {
          const p = JSON.parse(item.product.images);
          emoji = Array.isArray(p) ? p[0] : p;
        }
      } catch (e) {
        emoji = item.product.images || "📦";
      }

      return {
        id: item.productId, // id unik produk
        name: item.product.name,
        price: Number(item.product.basePrice), // Harga asli Decimal
        img: emoji,
        desc: item.product.description,
        quantity: item.quantity
      };
    });

    return { success: true, items: zustandFormat };
  } catch (error) {
    console.error("Gagal menarik keranjang dari DB:", error);
    return { success: false };
  }
}
