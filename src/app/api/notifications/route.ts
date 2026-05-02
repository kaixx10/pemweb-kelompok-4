import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Ambil semua order milik user ini, urutkan terbaru dulu
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const safeOrders = orders.map((o) => ({
      id: o.id,
      orderId: o.id,
      status: o.status,
      total: Number(o.total),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, orders: safeOrders });
  } catch (error) {
    console.error("Notification API Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
