"use client";

import { Headphones, Mail, MapPin, MessageSquare } from "lucide-react";

export default function XiaomiSupport() {
  const supportItems = [
    {
      icon: <Headphones size={32} strokeWidth={1.5} />,
      title: "Dukungan Pelanggan",
      desc: "Layanan 24 jam untuk Anda",
    },
    {
      icon: <Mail size={32} strokeWidth={1.5} />,
      title: "Hubungi Kami",
      desc: "Kirim pesan lewat Email",
    },
    {
      icon: <MapPin size={32} strokeWidth={1.5} />,
      title: "Lokasi Layanan",
      desc: "Temukan Service Center",
    },
    {
      icon: <MessageSquare size={32} strokeWidth={1.5} />,
      title: "WhatsApp",
      desc: "Chat langsung dengan kami",
    },
  ];

  return (
    // bg-transparent agar warnanya sama dengan background abu-abu muda website Anda
    <section id="support" className="w-full bg-transparent py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        
        {/* JUDUL XIAOMI SUPPORT */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Xiaomi Support</h2>
          <div className="w-20 h-1 bg-[#ff6700] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {supportItems.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="text-gray-400 group-hover:text-[#ff6700] transition-all duration-300 mb-4 transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}