"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search, Truck, ShieldCheck, CreditCard, User, Mail, MessageCircle, Send, ArrowLeft, PhoneCall } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

const faqs = [
  {
    question: "Berapa lama garansi produk Neo Store?",
    answer: "Semua produk *smartphone* dan *smart home* resmi dari Neo Store memiliki garansi pabrik selama 12-24 bulan tergantung jenis produk. Aksesoris dan *wearables* memiliki garansi 6 bulan. Anda bisa mengklaim garansi di seluruh Service Center resmi terdekat."
  },
  {
    question: "Bagaimana cara melacak pesanan saya?",
    answer: "Anda dapat melacak status pesanan Anda dengan masuk ke menu Profil > Pesanan. Nomor resi akan muncul setelah status pesanan berubah menjadi 'Dikirim'. Kami bekerja sama dengan JNE, SiCepat, dan Paxel untuk memastikan pengiriman tercepat."
  },
  {
    question: "Apakah saya bisa membatalkan pesanan yang sudah dibayar?",
    answer: "Pesanan yang sudah dibayar dan masuk ke tahap 'Diproses' tidak dapat dibatalkan secara sepihak. Namun, jika Anda memiliki kendala khusus, silakan hubungi Customer Service kami maksimal 1 jam setelah pembayaran."
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer: "Kami menggunakan Midtrans sebagai gateway pembayaran resmi. Anda dapat membayar melalui Virtual Account (BCA, Mandiri, BNI, BRI), Kartu Kredit, GoPay, ShopeePay, dan QRIS."
  },
  {
    question: "Bagaimana proses pengembalian dana (Refund)?",
    answer: "Pengembalian dana hanya berlaku jika pesanan dibatalkan sebelum pengiriman atau stok kosong. Dana akan dikembalikan otomatis ke metode pembayaran awal Anda dalam waktu 1-3 hari kerja."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeContactMethod, setActiveContactMethod] = useState<'options' | 'email'>('options');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    // Membaca URL parameter untuk melihat apakah action=email
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("action") === "email") {
        setActiveContactMethod("email");
        
        // Scroll otomatis ke bagian form email secara spesifik
        setTimeout(() => {
          const formSection = document.getElementById("email-form-section");
          if (formSection) {
            const yOffset = -80; // Offset untuk navbar
            const y = formSection.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 300);
      }
    }
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Pesan Terkirim!",
          text: "Tim Customer Service kami akan membalas pesan Anda ke email yang Anda berikan.",
          confirmButtonColor: "#ff6700"
        });
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim",
          text: data.error || "Terjadi kesalahan sistem.",
          confirmButtonColor: "#ff6700"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Koneksi Bermasalah",
        text: "Tidak dapat terhubung ke server. Coba lagi nanti.",
        confirmButtonColor: "#ff6700"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#ff6700]/10 to-transparent pt-16 pb-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Pusat Bantuan</h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Kami siap membantu menjawab semua pertanyaan Anda terkait produk, garansi, dan pengiriman Neo Store.</p>
        
        {/* Mock Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#ff6700] transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Ketik masalah Anda (contoh: cara klaim garansi)" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:border-[#ff6700] focus:ring-4 focus:ring-[#ff6700]/10 outline-none transition-all shadow-sm text-gray-800"
          />
          <button className="absolute inset-y-2 right-2 bg-[#ff6700] hover:bg-[#ff6700]/90 text-white px-6 rounded-xl font-bold transition-colors">
            Cari
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        {/* Quick Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: ShieldCheck, title: "Garansi", desc: "Klaim & Ketentuan" },
            { icon: Truck, title: "Pengiriman", desc: "Lacak Pesanan" },
            { icon: CreditCard, title: "Pembayaran", desc: "Metode & Cicilan" },
            { icon: User, title: "Akun Saya", desc: "Profil & Password" }
          ].map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#ff6700]/10 rounded-full flex items-center justify-center mb-4 transition-colors">
                <cat.icon className="text-gray-500 group-hover:text-[#ff6700] transition-colors" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{cat.title}</h3>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* FAQ Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Pertanyaan Populer
            </h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className={`font-bold pr-4 ${openFaq === index ? "text-[#ff6700]" : "text-gray-800"}`}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? "rotate-180 text-[#ff6700]" : ""}`} 
                      size={20} 
                    />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="email-form-section">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hubungi Kami</h2>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">Tidak menemukan jawaban yang Anda cari? Kirim pesan langsung ke tim Customer Service kami (Aktif 24/7).</p>
              </div>
              
              {activeContactMethod === 'options' ? (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => Swal.fire('Coming Soon', 'Fitur AI Live Chat sedang dalam pengembangan', 'info')}
                    className="w-full py-3 px-4 bg-[#ff6700] hover:bg-[#ff6700]/90 text-white rounded-xl font-bold transition-colors flex items-center justify-start gap-3 shadow-sm"
                  >
                    <div className="bg-white/20 p-2 rounded-lg flex-shrink-0"><MessageCircle size={20} /></div>
                    <div className="text-left">
                      <p className="text-sm leading-tight">Live Chat (AI CS)</p>
                      <p className="text-[10px] font-normal opacity-80 mt-0.5">(Segera Hadir / Nanti)</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => Swal.fire('Coming Soon', 'Layanan WhatsApp sedang disiapkan', 'info')}
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold transition-colors flex items-center justify-start gap-3 shadow-sm"
                  >
                    <div className="bg-white/20 p-2 rounded-lg flex-shrink-0"><PhoneCall size={20} /></div>
                    <div className="text-left">
                      <p className="text-sm leading-tight">WhatsApp</p>
                      <p className="text-[10px] font-normal opacity-80 mt-0.5">(Segera Hadir / Nanti)</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveContactMethod('email')}
                    className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold transition-colors flex items-center justify-start gap-3 shadow-sm"
                  >
                    <div className="bg-white/20 p-2 rounded-lg flex-shrink-0"><Mail size={20} /></div>
                    <div className="text-left">
                      <p className="text-sm leading-tight">Kirim Email</p>
                      <p className="text-[10px] font-normal opacity-80 mt-0.5">Balasan 1x24 Jam</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-4 -mt-2">
                    <button 
                      onClick={() => setActiveContactMethod('options')} 
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-800"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <h3 className="font-bold text-gray-800 text-sm">Formulir Email</h3>
                  </div>
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6700] outline-none text-sm transition-colors"
                        placeholder="Contoh: Budi Santoso"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Anda</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6700] outline-none text-sm transition-colors"
                        placeholder="budi@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Detail Pesan</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#ff6700] outline-none text-sm transition-colors resize-none"
                        placeholder="Tuliskan keluhan atau pertanyaan Anda di sini..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-3.5 mt-2 px-4 bg-[#ff6700] hover:bg-[#ff6700]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-[#ff6700]/20"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Send size={18} />
                          Kirim Pesan
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Admin Email (Otomatis Tembus Ke):</p>
                <p className="text-sm font-bold text-gray-800">badarrahman1905@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
