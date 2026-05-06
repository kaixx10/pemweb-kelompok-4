import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Baru Diluncurkan (4 produk terakhir)
    const newest = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, images: true },
    });

    // 2. Pilihan Harian (4 produk acak)
    const allIds = await prisma.product.findMany({
      select: { id: true }
    });

    // Mengacak array ID dengan Fisher-Yates shuffle
    for (let i = allIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
    }
    
    const randomIds = allIds.slice(0, 4).map(p => p.id);
    
    const daily = await prisma.product.findMany({
      where: { id: { in: randomIds } },
      select: { id: true, name: true, images: true }
    });

    return NextResponse.json({ newest, daily });
  } catch (error: any) {
    console.error("Gagal mengambil event products:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
