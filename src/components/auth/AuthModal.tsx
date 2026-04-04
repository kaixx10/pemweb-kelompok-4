"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { Eye, EyeOff } from "lucide-react"; // Ditambahkan untuk icon mata
import Swal from 'sweetalert2';

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModalStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk lihat password

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // --- PROSES LOGIN MANUAL ---
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        
        if (!res?.ok) {
          const pesanError = res?.error || "";
          if (pesanError.includes("NOT_REGISTERED")) {
            setError("Akun belum terdaftar. Mengalihkan ke pendaftaran...");
            setTimeout(() => {
              setIsLogin(false);
              setFormData({ name: "", email: formData.email, password: "" }); 
              setError("Silakan daftar akun baru di sini.");
            }, 2000);
          } else if (pesanError.includes("Password salah")) {
            setError("Password yang Anda masukkan salah.");
          } else if (pesanError.includes("Google")) {
            setError(pesanError);
          } else {
            setError("Email atau password salah.");
          }
        } else {
          // Login berhasil (Pop-up SweetAlert)
          closeModal();
          Swal.fire({
            title: 'Berhasil!',
            text: 'Anda berhasil masuk ke akun.',
            icon: 'success',
            confirmButtonColor: '#ff6700',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            window.location.reload(); 
          });
        }
      } else {
        // --- PROSES REGISTRASI & AUTO-LOGIN ---
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          // 1. Registrasi Sukses, sistem langsung melakukan Login secara otomatis
          const loginRes = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });

          // 2. Jika Auto-Login sukses
          if (loginRes?.ok) {
            setError("");
            setFormData({ name: "", email: "", password: "" });
            closeModal(); // Tutup modal
            
            // Tampilkan SweetAlert khusus
            Swal.fire({
              title: 'Selamat Datang!',
              text: 'Akun berhasil dibuat.',
              icon: 'success',
              confirmButtonColor: '#ff6700',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              window.location.reload(); // Refresh halaman agar navbar berubah menjadi Logout
            });
          } else {
            // Berjaga-jaga jika auto-login gagal
            setError("Registrasi berhasil, tapi gagal masuk otomatis. Silakan login manual.");
            setIsLogin(true);
          }
        } else {
          setError(data.error || "Terjadi kesalahan saat registrasi");
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Gagal login dengan Google.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center backdrop-blur-sm" onClick={closeModal}>
      <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={closeModal} className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-black">&times;</button>
        
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}</h2>
        
        {error && <div className="p-3 rounded-lg text-sm mb-4 bg-red-100 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input 
              type="text" placeholder="Nama Lengkap" required 
              className="border p-3 rounded-xl bg-gray-50 outline-none focus:border-black"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              disabled={loading}
            />
          )}
          <input 
            type="email" placeholder="Alamat Email" required 
            className="border p-3 rounded-xl bg-gray-50 outline-none focus:border-black"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            disabled={loading}
          />
          
          {/* Input Password dengan Icon Mata */}
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Kata Sandi" required minLength={6}
              className="border p-3 rounded-xl bg-gray-50 outline-none focus:border-black w-full"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              disabled={loading}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          
          <button type="submit" disabled={loading} className="bg-black text-white font-bold p-3 rounded-xl mt-2 hover:bg-gray-800 transition disabled:opacity-50">
            {loading ? "Memproses..." : (isLogin ? "Masuk" : "Daftar")}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-gray-200" /><span className="text-xs text-gray-400 font-bold">ATAU</span><hr className="flex-1 border-gray-200" />
        </div>

        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 border border-gray-300 p-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Lanjutkan dengan Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-500">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} type="button" className="text-black font-bold underline" disabled={loading}>
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </p>
      </div>
    </div>
  );
}