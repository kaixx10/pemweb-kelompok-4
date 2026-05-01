"use client";

import { useSession } from "next-auth/react";
import { ArrowLeft, Sparkles, HeartHandshake, ShieldCheck, TicketPercent, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function BenefitsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [claimed, setClaimed] = useState<string[]>([]);

  const handleClaim = (id: string) => {
    if (claimed.includes(id)) return;
    
    setClaimed([...claimed, id]);
    Swal.fire({
      icon: "success",
      title: "Kupon Berhasil Diklaim!",
      text: "Kupon telah masuk ke brankas akun Anda dan siap digunakan saat Checkout.",
      confirmButtonColor: "#ff6700",
      confirmButtonText: "Mantap",
    });
  };

  const coupons = [
    { id: "c1", title: "Gratis Ongkir Super", desc: "Potongan ongkir s/d Rp 50.000 ke seluruh Indonesia", exp: "7 Hari Lagi", type: "orange" },
    { id: "c2", title: "Diskon 15% Aksesoris", desc: "Maksimal potongan Rp 100.000 khusus pembelian aksesoris", exp: "Akhir Bulan", type: "blue" },
    { id: "c3", title: "Cashback Xiaomi Points 20%", desc: "Dapatkan poin ganda untuk pembelian Smart TV", exp: "Besok Habis", type: "purple" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manfaat Eksklusif</h1>
            <p className="text-gray-500 text-sm mt-1">Status keanggotaan dan hadiah spesial untuk Anda</p>
          </div>
        </div>

        {/* Member Card */}
        <div className="mb-10 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-2xl border border-gray-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff6700]/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#ff6700]/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Xiaomi Store Membership</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">GOLD MEMBER</h2>
                  <Sparkles size={20} className="text-yellow-400" />
                </div>
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <span className="font-bold text-xl text-white">N</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Nama Anggota</p>
                <p className="text-xl font-bold tracking-wide">{user?.name || "Pelanggan Setia"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Xiaomi Points</p>
                <p className="text-2xl font-black text-[#ff6700]">12,450</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress ke PLATINUM</span>
                <span>2.550 point lagi</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff6700] to-yellow-500 h-2 rounded-full w-[80%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Privileges */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HeartHandshake className="text-[#ff6700]" size={20} />
          Hak Istimewa Anda
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-orange-50 p-3 rounded-xl text-[#ff6700]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Garansi +6 Bulan</h4>
              <p className="text-xs text-gray-500 mt-1">Ekstra perlindungan untuk semua gadget.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <TicketPercent size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Diskon Ulang Tahun</h4>
              <p className="text-xs text-gray-500 mt-1">Kupon spesial 20% di bulan kelahiran.</p>
            </div>
          </div>
        </div>

        {/* Coupons */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TicketPercent className="text-[#ff6700]" size={20} />
          Kupon Siap Klaim
        </h3>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex relative">
              <div className={`w-32 flex flex-col items-center justify-center text-white p-4 border-r border-dashed border-gray-200 relative
                ${coupon.type === 'orange' ? 'bg-gradient-to-br from-[#ff6700] to-orange-600' : 
                  coupon.type === 'blue' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 
                  'bg-gradient-to-br from-purple-500 to-pink-600'}`}>
                {/* Potongan Setengah Lingkaran Kupon */}
                <div className="absolute top-0 -right-2.5 w-5 h-5 bg-white rounded-full -translate-y-1/2"></div>
                <div className="absolute bottom-0 -right-2.5 w-5 h-5 bg-white rounded-full translate-y-1/2"></div>
                
                <TicketPercent size={32} className="opacity-80 mb-2" />
                <span className="font-black text-lg text-center leading-tight">XIAOMI<br/>PERKS</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center bg-white relative">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{coupon.title}</h4>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{coupon.exp}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{coupon.desc}</p>
                <div className="flex justify-end mt-auto">
                  {claimed.includes(coupon.id) ? (
                    <button disabled className="bg-gray-100 text-gray-400 font-bold py-2 px-5 rounded-full text-xs flex items-center gap-1">
                      <CheckCircle2 size={14} /> Diklaim
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleClaim(coupon.id)}
                      className={`font-bold py-2 px-6 rounded-full text-xs shadow-sm transition-transform hover:scale-105
                      ${coupon.type === 'orange' ? 'bg-orange-50 text-[#ff6700] border border-orange-200' : 
                        coupon.type === 'blue' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 
                        'bg-purple-50 text-purple-600 border border-purple-200'}`}
                    >
                      Klaim Sekarang
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
