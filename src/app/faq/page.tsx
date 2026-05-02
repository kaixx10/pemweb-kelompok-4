"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Phone, Search } from 'lucide-react';

const faqs = [
  {
    category: "Pemesanan & Pembayaran",
    questions: [
      {
        q: "Bagaimana cara melacak pesanan saya?",
        a: "Anda dapat melacak pesanan Anda melalui halaman 'Profil' > 'Pesanan Saya'. Di sana Anda akan melihat status terbaru dari paket Anda."
      },
      {
        q: "Metode pembayaran apa saja yang tersedia?",
        a: "Kami menerima pembayaran melalui Transfer Bank (Virtual Account), Kartu Kredit, serta berbagai e-wallet seperti GoPay, OVO, dan Dana."
      }
    ]
  },
  {
    category: "Pengiriman",
    questions: [
      {
        q: "Berapa lama waktu pengiriman?",
        a: "Untuk wilayah Jabodetabek, pengiriman biasanya memakan waktu 1-3 hari kerja. Untuk luar daerah, estimasi berkisar antara 3-7 hari kerja tergantung lokasi."
      },
      {
        q: "Apakah ada biaya pengiriman?",
        a: "Biaya pengiriman dihitung secara otomatis berdasarkan berat produk dan lokasi tujuan Anda saat checkout."
      }
    ]
  },
  {
    category: "Produk & Garansi",
    questions: [
      {
        q: "Apakah semua produk Xiaomi di sini bergaransi resmi?",
        a: "Ya, semua produk yang dijual melalui platform ini adalah produk resmi Xiaomi Indonesia dan dilengkapi dengan garansi resmi produsen."
      },
      {
        q: "Bagaimana cara mengklaim garansi?",
        a: "Anda cukup membawa produk beserta invoice pembelian (bisa dicetak dari riwayat pesanan) ke Service Center resmi Xiaomi terdekat."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (q: string) => {
    setOpenItems(prev => 
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-24 pb-20">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-[#ff6700]/5 blur-[80px] rounded-full -z-10"></div>
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff6700] to-[#ff8c33] rounded-[28px] flex items-center justify-center shadow-lg shadow-orange-200 rotate-3 hover:rotate-0 transition-transform duration-500">
              <HelpCircle className="text-white" size={40} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-2 h-2 bg-[#ff6700] rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Pusat Bantuan (FAQ)
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
            Temukan jawaban cepat untuk pertanyaan yang paling sering diajukan mengenai layanan kami.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari pertanyaan Anda di sini..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 shadow-sm outline-none focus:ring-2 focus:ring-[#ff6700]/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ Content */}
        <div className="space-y-10">
          {faqs.map((group, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <h2 className="text-lg font-bold text-gray-900 mb-4 ml-2">{group.category}</h2>
              <div className="space-y-3">
                {group.questions.filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase())).map((item, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all">
                    <button 
                      onClick={() => toggleItem(item.q)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-800 text-[15px]">{item.q}</span>
                      <ChevronDown 
                        className={`text-gray-400 transition-transform duration-300 ${openItems.includes(item.q) ? 'rotate-180 text-[#ff6700]' : ''}`} 
                        size={20} 
                      />
                    </button>
                    {openItems.includes(item.q) && (
                      <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-20 bg-[#1a1a1a] rounded-[32px] p-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">Masih punya pertanyaan?</h2>
            <p className="text-gray-400 mb-8 font-light">Tim dukungan kami siap membantu Anda 24/7 untuk setiap kendala yang Anda hadapi.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-[#ff6700] hover:bg-[#e65c00] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all">
                <MessageCircle size={18} />
                Live Chat
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all backdrop-blur-sm">
                <Phone size={18} />
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
