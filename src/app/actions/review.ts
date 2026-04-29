"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// 1. Submit Ulasan Baru
export async function addReview(data: {
  orderItemId: string;
  productId: string;
  rating: number;
  comment?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Harap login terlebih dahulu" };
    }

    const userId = session.user.id;

    // Pastikan pesanan benar-benar COMPLETED dan milik user ini
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: data.orderItemId },
      include: { order: true },
    });

    if (!orderItem) return { success: false, error: "Item pesanan tidak ditemukan" };
    if (orderItem.order.userId !== userId) return { success: false, error: "Anda tidak berhak mengulas pesanan ini" };
    if (orderItem.order.status !== "COMPLETED") return { success: false, error: "Pesanan belum selesai" };

    // Simpan Ulasan
    const newReview = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        userId: userId,
        productId: data.productId,
        orderItemId: data.orderItemId,
      },
    });

    // Revalidasi halaman profil dan halaman produk
    revalidatePath("/profile/orders");
    revalidatePath(`/product/[slug]`, "page"); // Akan merefresh semua halaman detail produk
    revalidatePath("/");

    return { success: true, data: newReview };
  } catch (error: any) {
    console.error("Error submit review:", error);
    // Tangkap error jika unique constraint dilanggar (sudah pernah direview)
    if (error.code === 'P2002') {
       return { success: false, error: "Anda sudah memberikan ulasan untuk barang ini" };
    }
    return { success: false, error: "Gagal mengirim ulasan" };
  }
}

// 2. Ambil Ulasan Sebuah Produk
export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Hitung rata-rata rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
      : 0;

    return { 
      success: true, 
      data: {
        reviews,
        totalReviews,
        averageRating: Number(averageRating.toFixed(1))
      } 
    };
  } catch (error) {
    console.error("Error get reviews:", error);
    return { success: false, error: "Gagal memuat ulasan" };
  }
}
