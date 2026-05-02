"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

/**
 * GET ALL AVAILABLE COUPONS
 * Fungsi untuk mengambil semua kupon yang bisa diklaim oleh user
 */
export async function getAvailableCoupons() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Silakan login untuk melihat kupon." };
    }

    const userId = (session.user as any).id;

    // Ambil semua kupon yang ada di database
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Ambil data kupon yang sudah diklaim oleh user ini
    const claimedCoupons = await prisma.userCoupon.findMany({
      where: { userId: userId },
      select: { couponId: true, isUsed: true }
    });

    // Gabungkan data: Beri status apakah sudah diklaim atau belum
    const couponList = coupons.map(coupon => {
      const claimStatus = claimedCoupons.find(cc => cc.couponId === coupon.id);
      return {
        ...coupon,
        isClaimed: !!claimStatus,
        isUsed: claimStatus?.isUsed || false
      };
    });

    return { success: true, data: couponList };
  } catch (error: any) {
    console.error("Gagal mengambil kupon:", error);
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

/**
 * CLAIM COUPON
 * Fungsi untuk menyimpan klaim kupon user ke database MySQL
 */
export async function claimCoupon(couponId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("Anda harus login untuk mengklaim kupon.");
    }

    const userId = (session.user as any).id;

    // Cek apakah kupon ada
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId }
    });

    if (!coupon) {
      throw new Error("Kupon tidak ditemukan.");
    }

    // Cek apakah sudah pernah diklaim
    const existingClaim = await prisma.userCoupon.findUnique({
      where: {
        userId_couponId: {
          userId: userId,
          couponId: couponId
        }
      }
    });

    if (existingClaim) {
      throw new Error("Anda sudah mengklaim kupon ini sebelumnya.");
    }

    // Simpan klaim ke database
    await prisma.userCoupon.create({
      data: {
        userId: userId,
        couponId: couponId
      }
    });

    revalidatePath("/profile/benefits");
    
    return { success: true, message: "Kupon berhasil diklaim dan disimpan!" };
  } catch (error: any) {
    console.error("Gagal klaim kupon:", error);
    return { success: false, error: error.message || "Gagal memproses klaim." };
  }
}

/**
 * SEED INITIAL COUPONS (Utility)
 * Menambahkan kupon awal ke database jika belum ada
 */
export async function seedCoupons() {
  try {
    const initialCoupons = [
      {
        code: 'XIAOMI20',
        description: 'Potongan 20% untuk semua produk tanpa minimum belanja.',
        discountType: 'percentage',
        value: 20
      },
      {
        code: 'HEMAT50',
        description: 'Potongan harga langsung Rp 50.000 untuk pembelian gadget.',
        discountType: 'fixed',
        value: 50000
      },
      {
        code: 'PROMO10',
        description: 'Diskon 10% khusus aksesori dan produk smart home.',
        discountType: 'percentage',
        value: 10
      }
    ];

    for (const c of initialCoupons) {
      await prisma.coupon.upsert({
        where: { code: c.code },
        update: {},
        create: {
          code: c.code,
          description: c.description,
          discountType: c.discountType,
          value: c.value
        }
      });
    }

    return { success: true, message: "Berhasil melakukan sinkronisasi kupon." };
  } catch (error) {
    console.error("Seed error:", error);
    return { success: false };
  }
}
