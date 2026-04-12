"use client";

import { useState } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/actions/order";
import Swal from "sweetalert2";

export default function OrderStatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    
    // Konfirmasi warna sesuai resiko
    const riskColors: Record<string, string> = {
      CANCELLED: "#ef4444",
      COMPLETED: "#22c55e",
      SHIPPED: "#f59e0b",
      PAID: "#3b82f6",
      PENDING: "#6b7280"
    };

    const confirm = await Swal.fire({
      title: "Ubah Status?",
      text: `Anda yakin ingin mengubah status pesanan menjadi ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: riskColors[newStatus] || "#ff6700",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Ubah!",
      cancelButtonText: "Batal"
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      const res = await updateOrderStatus(orderId, newStatus);
      setLoading(false);
      
      if (res.success) {
        setStatus(newStatus);
        Swal.fire("Berhasil!", "Status pesanan telah diperbarui.", "success");
      } else {
        Swal.fire("Gagal!", res.error, "error");
        // Kembalikan dropdown ke nilai semula jika gagal
        e.target.value = status;
      }
    } else {
      // Batal diubah
      e.target.value = status;
    }
  };

  return (
    <select 
      value={status} 
      onChange={handleStatusChange}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 cursor-pointer outline-none transition-colors disabled:opacity-50
        ${status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200 hover:border-green-400' :
          status === 'SHIPPED' ? 'bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-400' :
          status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200 hover:border-red-400' :
          status === 'PAID' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-400' :
          'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400'
        }
      `}
    >
      <option value="PENDING">⏳ PENDING</option>
      <option value="PAID">💵 PAID</option>
      <option value="SHIPPED">🚚 SHIPPED</option>
      <option value="COMPLETED">✅ COMPLETED</option>
      <option value="CANCELLED">❌ CANCELLED</option>
    </select>
  );
}
