"use client";

import { ArrowLeft, Bell, Package, CheckCircle2, Truck, XCircle, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface OrderNotification {
  id: string;
  orderId: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user) return;
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Gagal memuat notifikasi:", err);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [session]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          icon: <CheckCircle2 size={20} />,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
          title: "Pesanan Selesai",
          desc: "Pesanan Anda telah berhasil diselesaikan. Terima kasih telah berbelanja!",
        };
      case "SHIPPED":
        return {
          icon: <Truck size={20} />,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
          title: "Pesanan Dikirim",
          desc: "Paket Anda sedang dalam perjalanan menuju alamat tujuan.",
        };
      case "PAID":
        return {
          icon: <CreditCard size={20} />,
          color: "text-indigo-600",
          bg: "bg-indigo-50",
          border: "border-indigo-100",
          title: "Pembayaran Diterima",
          desc: "Pembayaran berhasil! Pesanan Anda sedang diproses.",
        };
      case "CANCELLED":
        return {
          icon: <XCircle size={20} />,
          color: "text-red-500",
          bg: "bg-red-50",
          border: "border-red-100",
          title: "Pesanan Dibatalkan",
          desc: "Pesanan ini telah dibatalkan.",
        };
      default:
        return {
          icon: <Clock size={20} />,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
          title: "Menunggu Pembayaran",
          desc: "Segera selesaikan pembayaran agar pesanan Anda diproses.",
        };
    }
  };

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifikasi</h1>
            <p className="text-gray-500 text-sm mt-1">Riwayat update pesanan Anda</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-[#ff6700] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm font-medium">Memuat notifikasi...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <Bell size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Notifikasi</h3>
            <p className="text-gray-500 text-sm">Notifikasi akan muncul saat Anda memiliki pesanan.</p>
            <Link href="/" className="inline-block mt-6 bg-[#ff6700] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e05a00] transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <Link
                  key={order.id}
                  href="/profile/orders"
                  className={`block bg-white rounded-2xl shadow-sm border ${config.border} p-5 hover:shadow-md transition-all group`}
                >
                  <div className="flex gap-4">
                    <div className={`w-11 h-11 rounded-xl ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#ff6700] transition-colors">
                          {config.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 font-bold flex-shrink-0 ml-2">
                          {formatDate(order.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{config.desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded">
                          #{order.orderId.slice(0, 15)}
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          {formatIDR(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
