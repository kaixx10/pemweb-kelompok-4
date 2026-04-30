"use client";

import { ArrowLeft, KeyRound, ShieldAlert, Smartphone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { changePassword } from "@/app/actions/user";

export default function SettingsPage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Kata sandi baru dan konfirmasi tidak cocok.",
        confirmButtonColor: "#ff6700",
      });
    }

    if (passwordData.newPassword.length < 8) {
      return Swal.fire({
        icon: "error",
        title: "Terlalu Pendek",
        text: "Kata sandi baru harus minimal 8 karakter.",
        confirmButtonColor: "#ff6700",
      });
    }

    setIsChangingPassword(true);
    
    try {
      const result = await changePassword(passwordData.oldPassword, passwordData.newPassword);
      
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: result.message,
          confirmButtonColor: "#ff6700",
        });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: result.error,
          confirmButtonColor: "#ff6700",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menghubungi server.",
        confirmButtonColor: "#ff6700",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    if (!is2FAEnabled) {
      Swal.fire({
        icon: "info",
        title: "2FA Diaktifkan (Simulasi)",
        text: "Fitur Autentikasi Dua Langkah kini aktif. Kode OTP akan dikirimkan ke email Anda setiap kali login di perangkat baru.",
        confirmButtonColor: "#ff6700",
      });
    }
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Hapus Akun Permanen?",
      text: "PERINGATAN: Semua data pesanan, alamat, ulasan, dan Neo Points akan terhapus selamanya dan tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#f3f4f6",
      confirmButtonText: "Ya, Hapus Akun Saya",
      cancelButtonText: "Batal",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Terhapus! (Simulasi)",
          text: "Permintaan penghapusan akun sedang diproses oleh sistem.",
          icon: "success",
          confirmButtonColor: "#ff6700",
        });
      }
    });
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff6700] focus:ring-offset-2 ${checked ? 'bg-[#ff6700]' : 'bg-gray-300'}`}
      role="switch"
      aria-checked={checked}
    >
      <span 
        aria-hidden="true" 
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} 
      />
    </button>
  );

  return (
    <main className="min-h-screen bg-[#f5f5f5] pb-20 pt-28 font-sans">
      <div className="max-w-[800px] mx-auto px-4 md:px-0">
        
        {/* Header ala Xiaomi (Clean, Minimalist) */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-gray-200 transition-colors rounded-full">
            <ArrowLeft size={24} className="text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Preferensi Akun & Keamanan</h1>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Section: Keamanan Akun */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <KeyRound size={20} className="text-[#ff6700]" />
              Ubah Kata Sandi
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi Saat Ini</label>
                <input 
                  type="password" 
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] outline-none transition-all text-gray-900"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Minimal 8 karakter" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] outline-none transition-all text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Kata Sandi</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Ulangi kata sandi baru" 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] outline-none transition-all text-gray-900"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#ff6700] hover:bg-[#ff6700]/90 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 text-sm w-full md:w-auto"
                >
                  {isChangingPassword ? "Menyimpan..." : "Simpan Kata Sandi"}
                </button>
              </div>
            </form>
          </div>

          {/* Section: 2FA */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Smartphone size={20} className="text-[#ff6700]" />
              Autentikasi Dua Langkah (2FA)
            </h2>
            
            <div className="flex items-center justify-between gap-4">
              <div className="max-w-md">
                <h3 className="font-bold text-gray-900 mb-1">Tingkatkan Keamanan Login</h3>
                <p className="text-sm text-gray-500">
                  Untuk melindungi akun Anda, sangat disarankan agar mengaktifkan verifikasi dua langkah.
                </p>
              </div>
              <div><ToggleSwitch checked={is2FAEnabled} onChange={toggle2FA} /></div>
            </div>
          </div>

          {/* Section: Danger Zone */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <ShieldAlert size={20} className="text-red-500" />
              Penghapusan Akun
            </h2>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-lg">
                <p className="text-sm text-gray-600">
                  Jika Anda menghapus akun ini, Anda tidak akan dapat lagi masuk dengan kredensial Anda, dan seluruh riwayat pemesanan akan dihapus dari sistem kami.
                </p>
              </div>
              
              <button
                onClick={handleDeleteAccount}
                className="bg-white border border-red-500 text-red-600 hover:bg-red-50 font-bold py-2.5 px-6 rounded-lg transition-colors text-sm whitespace-nowrap flex-shrink-0"
              >
                Hapus Akun
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
