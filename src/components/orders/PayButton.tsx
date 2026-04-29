"use client";

import Script from "next/script";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { syncOrderWithMidtrans } from "@/app/actions/syncOrder";

export default function PayButton({ snapToken, orderId }: { snapToken: string | null, orderId: string }) {
  const router = useRouter();

  const handlePay = () => {
    if (!snapToken) {
      Swal.fire("Error", "Gagal mengambil kode pembayaran.", "error");
      return;
    }

    if (typeof (window as any).snap !== "undefined") {
      (window as any).snap.pay(snapToken, {
        onSuccess: async function () {
          await syncOrderWithMidtrans(orderId, true);
          Swal.fire("Berhasil!", "Pembayaran diterima, pesanan selesai.", "success").then(() => {
            router.refresh();
          });
        },
        onPending: async function () {
          await syncOrderWithMidtrans(orderId);
          Swal.fire("Menunggu", "Silakan selesaikan pembayaran Anda.", "info").then(() => {
            router.refresh();
          });
        },
        onError: function () {
          Swal.fire("Gagal", "Transaksi ditolak pembayaran.", "error");
        },
        onClose: async function () {
          Swal.fire({
            title: "Batalkan Pesanan?",
            text: "Anda menutup jendela pembayaran. Apakah Anda ingin membatalkan pesanan ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Batalkan",
            cancelButtonText: "Tidak, Bayar Nanti"
          }).then(async (result) => {
            if (result.isConfirmed) {
              await syncOrderWithMidtrans(orderId, false, true); // Cancel order
              Swal.fire("Dibatalkan", "Pesanan Anda telah dibatalkan.", "info").then(() => {
                router.refresh();
              });
            }
          });
        }
      });
    } else {
      Swal.fire("Sistem Sibuk", "Kasir sedang dimuat, coba sebentar lagi.", "error");
    }
  };

  if (!snapToken) return null;

  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <button 
        onClick={handlePay}
        className="mt-3 sm:mt-0 bg-[#ff6700] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#e05a00] transition-colors shadow-sm"
      >
        Bayar Sekarang
      </button>
    </>
  );
}
