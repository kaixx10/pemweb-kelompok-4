import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { Calendar, Heart, MapPin, Package, Settings, Star, Shield, Bell } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).id) {
    redirect("/");
  }

  // Tarik data segar dari Database (bukan sekadar kuki sesi) agar jika ganti nama/foto bisa langsung update
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!user) redirect("/");

  // Sapaan Berdasarkan Waktu Server
  const hour = new Date().getHours();
  let greeting = "Selamat Malam";
  if (hour < 11) greeting = "Selamat Pagi";
  else if (hour < 15) greeting = "Selamat Siang";
  else if (hour < 19) greeting = "Selamat Sore";

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* 1. HERO BANNER ORANYE ALA XIAOMI */}
      <div className="w-full bg-[#fcece0] relative overflow-hidden pt-28 pb-20 flex flex-col justify-center shadow-inner">
        {/* Dekorasi Estetik Geometris Background Banner */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#ff6700]/10 rounded-l-full blur-3xl -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#ff8a3d]/20 rounded-full blur-3xl translate-y-1/4"></div>
        
        <div className="max-w-[1240px] mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* FOTO PROFIL */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl overflow-hidden bg-white shadow-2xl p-1.5 border-2 border-white/50 relative z-10">
              <div className="w-full h-full rounded-[20px] overflow-hidden bg-gray-100 flex items-center justify-center font-bold text-4xl text-[#ff6700]">
                {user.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (user.name || "U").charAt(0).toUpperCase()
                )}
              </div>
            </div>
            {/* Lencana Admin jika ada */}
            {user.role === "ADMIN" && (
              <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full border-4 border-[#fcece0] z-20 shadow-md transform rotate-12">
                ADMIN
              </div>
            )}
          </div>

          {/* DATA AKUN */}
          <div className="flex flex-col text-center md:text-left text-[#333]">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
              {greeting}, {user.name || "Sobat Neo"}!
            </h1>
            <p className="text-sm font-medium opacity-70 mb-3 flex items-center justify-center md:justify-start gap-2">
              <span>✉️ {user.email}</span>
              <span className="opacity-40">|</span>
              <span className="font-mono">ID: {user.id.slice(0,10).toUpperCase()}</span>
            </p>
            
            <EditProfileModal user={{ id: user.id, name: user.name || "", email: user.email || "", image: user.image || "" }} />
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT (KISI MENU) */}
      <div className="max-w-[1240px] mx-auto px-6 mt-6 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden flex flex-col">
          
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Pusat Pelanggan
             </h2>
             <button className="text-sm font-semibold text-gray-500 hover:text-[#ff6700] transition-colors">
                Pengaturan ID &gt;
             </button>
          </div>

          {/* GRID MENU STATIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 lg:divide-x divide-gray-100 bg-white">
             
             {/* KARTU 1: Pesanan */}
             <div className="p-8 lg:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 transition-colors group">
                <Package size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#ff6700] group-hover:-translate-y-1 transition-all mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Pesanan Saya</h3>
                <p className="text-xs text-gray-500">Lacak, ubah, batalkan pesanan, pengembalian atau ulasan barang belanjaanmu.</p>
             </div>

             {/* KARTU 2: Ulasan */}
             <div className="p-8 lg:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 transition-colors group lg:border-r border-gray-100">
                <Star size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#ff6700] group-hover:-translate-y-1 transition-all mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Ulasan Saya</h3>
                <p className="text-xs text-gray-500">Sampaikan pendapat Anda tentang fitur produk atau pengalaman pelayanan.</p>
             </div>

             {/* KARTU 3: Manfaat Eksklusif */}
             <div className="p-8 lg:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 transition-colors group">
                <Heart size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#ff6700] group-hover:-translate-y-1 transition-all mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Manfaat Eksklusif</h3>
                <p className="text-xs text-gray-500">Klaim jaminan garansi 24 bulan dan akses prioritas pembelian untuk Neo Lovers.</p>
             </div>

             {/* KARTU 4: Alamat */}
             <div className="p-8 lg:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 transition-colors group lg:border-t border-gray-100">
                <MapPin size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#ff6700] group-hover:-translate-y-1 transition-all mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Daftar Alamat</h3>
                <p className="text-xs text-gray-500">Kelola rute pengiriman paket ke berbagai tujuan ekspedisi di Nusantara.</p>
             </div>

             {/* KARTU 5: Notifikasi */}
             <div className="p-8 lg:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 transition-colors group lg:border-t lg:border-r border-gray-100">
                <Bell size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#ff6700] group-hover:-translate-y-1 transition-all mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Preferensi Notifikasi</h3>
                <p className="text-xs text-gray-500">Sesuaikan email promo peluncuran produk dan notifikasi pelacakan kargo.</p>
             </div>

             {/* KARTU 6: Akun Detail */}
             <div className="p-8 lg:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50/30 transition-colors group lg:border-t border-gray-100">
                <Settings size={40} strokeWidth={1.5} className="text-gray-400 group-hover:text-[#ff6700] group-hover:-translate-y-1 transition-all mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Preferensi Akun</h3>
                <p className="text-xs text-gray-500">Perkuat keamanan perangkat, hubungkan perangkat satelit, dan kunci otentikasi.</p>
             </div>

          </div>
        </div>
      </div>
    </main>
  );
}
