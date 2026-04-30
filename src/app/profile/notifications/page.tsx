"use client";

import { ArrowLeft, Bell, Mail, MessageSquare, Tag, Smartphone, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    promoEmail: true,
    promoSms: false,
    orderWhatsapp: true,
    orderEmail: true,
    recommendations: false,
    securityAlerts: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const toggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        icon: "success",
        title: "Tersimpan!",
        text: "Preferensi notifikasi Anda berhasil diperbarui.",
        confirmButtonColor: "#ff6700",
      });
    }, 800);
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff6700] focus:ring-offset-2 ${checked ? 'bg-[#ff6700]' : 'bg-gray-200'}`}
      role="switch"
      aria-checked={checked}
    >
      <span 
        aria-hidden="true" 
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
      />
    </button>
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Preferensi Notifikasi</h1>
            <p className="text-gray-500 text-sm mt-1">Atur bagaimana kami berkomunikasi dengan Anda</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          
          {/* Section: Promo & Penawaran */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-50 p-2.5 rounded-xl text-[#ff6700]">
                <Tag size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Promo & Penawaran Khusus</h2>
            </div>
            
            <div className="space-y-6 pl-2 md:pl-14">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" /> Email Promo
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Dapatkan info eksklusif tentang produk terbaru, diskon, dan acara spesial langsung di kotak masuk Anda.</p>
                </div>
                <div className="pt-1"><ToggleSwitch checked={preferences.promoEmail} onChange={() => toggle('promoEmail')} /></div>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" /> SMS Promosi
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Terima kode kupon kilat (Flash Sale) via SMS.</p>
                </div>
                <div className="pt-1"><ToggleSwitch checked={preferences.promoSms} onChange={() => toggle('promoSms')} /></div>
              </div>
            </div>
          </div>

          {/* Section: Transaksi */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                <Bell size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Pesanan & Transaksi</h2>
            </div>
            
            <div className="space-y-6 pl-2 md:pl-14">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Smartphone size={16} className="text-gray-400" /> Notifikasi WhatsApp
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Update status pengiriman, resi kurir, dan pembayaran secara real-time via WhatsApp.</p>
                </div>
                <div className="pt-1"><ToggleSwitch checked={preferences.orderWhatsapp} onChange={() => toggle('orderWhatsapp')} /></div>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" /> Faktur Email
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Kirim ringkasan struk belanja (invoice) ke email setelah pembayaran berhasil.</p>
                </div>
                <div className="pt-1"><ToggleSwitch checked={preferences.orderEmail} onChange={() => toggle('orderEmail')} /></div>
              </div>
            </div>
          </div>

          {/* Section: Akun & Keamanan */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
                <ShieldCheck size={20} className="text-purple-600 hidden" /> {/* Shield Icon Replacement */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Privasi & Sistem</h2>
            </div>
            
            <div className="space-y-6 pl-2 md:pl-14">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Rekomendasi Personal</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Izinkan sistem melacak riwayat pencarian Anda untuk memberikan saran produk yang lebih akurat.</p>
                </div>
                <div className="pt-1"><ToggleSwitch checked={preferences.recommendations} onChange={() => toggle('recommendations')} /></div>
              </div>
              
              <div className="flex items-start justify-between gap-4 opacity-50 cursor-not-allowed">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Peringatan Keamanan (Wajib)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Notifikasi percobaan login mencurigakan atau perubahan kata sandi.</p>
                </div>
                <div className="pt-1"><ToggleSwitch checked={true} onChange={() => {}} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#ff6700] hover:bg-[#ff6700]/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-[#ff6700]/20"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Save size={18} />
                Simpan Preferensi
              </>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}
