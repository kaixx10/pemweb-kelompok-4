"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import { toggleUserRole } from "@/app/actions/user";
import Swal from "sweetalert2";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function UserRoleButton({ userId, currentRole, currentUserId }: { userId: string, currentRole: UserRole, currentUserId: string }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (userId === currentUserId) {
      Swal.fire({
        title: "Perhatian!",
        text: "Anda tidak bisa mengubah role Anda sendiri dari sini.",
        icon: "warning"
      });
      return;
    }

    const isCurrentlyAdmin = currentRole === "ADMIN";
    const actionText = isCurrentlyAdmin ? "Mencabut akses Admin dari" : "Menjadikan";
    
    const confirm = await Swal.fire({
      title: "Konfirmasi Hak Akses",
      text: `Apakah Anda yakin ingin ${actionText} pengguna ini?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isCurrentlyAdmin ? "#ef4444" : "#20d087", // Merah cabut, Hijau beri
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Lanjutkan!",
      cancelButtonText: "Batal"
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      const res = await toggleUserRole(userId);
      setLoading(false);
      
      if (res.success) {
        Swal.fire("Berhasil!", res.message, "success");
      } else {
        Swal.fire("Gagal!", res.error, "error");
      }
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading || userId === currentUserId}
      className={`px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-lg border-2 text-xs font-bold transition-all disabled:opacity-40
        ${currentRole === 'ADMIN' 
          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600' 
          : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600'
        }
      `}
      title={userId === currentUserId ? "Ini akun Anda sendiri" : "Ubah hak akses"}
    >
      {currentRole === 'ADMIN' ? (
        <><ShieldAlert size={14} strokeWidth={3} /> Cabut Admin</>
      ) : (
        <><ShieldCheck size={14} strokeWidth={3} /> Jadikan Admin</>
      )}
    </button>
  );
}
