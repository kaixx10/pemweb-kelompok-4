import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { OrderStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 1. Verifikasi Signature Key (Pastikan data asli dari Midtrans, bukan hacker)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hashData = `${data.order_id}${data.status_code}${data.gross_amount}${serverKey}`;
    const expectedSignature = crypto.createHash("sha512").update(hashData).digest("hex");

    if (data.signature_key !== expectedSignature) {
      console.warn("Ditolak! Tanda tangan Midtrans palsu.");
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    // 2. Terjemahkan status pembayaran
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;

    let newStatus: OrderStatus | null = null;
    let newPaymentStatus = transactionStatus;

    if (transactionStatus === "capture") {
      // Pembayaran Kartu Kredit berhasil
      newStatus = fraudStatus === "challenge" ? "PENDING" : "PROCESSING";
    } else if (transactionStatus === "settlement") {
      // Pembayaran (E-Wallet/VA/QRIS) Lunas!
      newStatus = "PROCESSING";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "CANCELLED";
    } else if (transactionStatus === "pending") {
      newStatus = "PENDING";
    }

    // 3. Update Struk di Database jika ada perubahan status lunas/batal
    if (newStatus) {
      await prisma.order.update({
        where: { id: data.order_id },
        data: { 
          status: newStatus,
          paymentStatus: newPaymentStatus,
          paymentId: data.transaction_id
        }
      });
      console.log(`Webhook Sukses: Pesanan ${data.order_id} sekarang ${newStatus}`);
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Middleware Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
