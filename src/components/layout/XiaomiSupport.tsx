"use client";

import { Headphones, Mail, MapPin, MessageSquare } from "lucide-react";
import { useRouter, usePathname } from "next/navigation"; // 👈 Tambahkan usePathname
import Swal from "sweetalert2";

export default function XiaomiSupport() {
  const router = useRouter();
  const pathname = usePathname(); // 👈 Ambil URL halaman saat ini

  // Jika BUKAN di halaman utama, JANGAN tampilkan komponen ini (return null)
  if (pathname !== "/") return null;

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
      title: "Alamat",
      desc: "Atur Buku Alamat Anda",
    },
    {
      icon: <MessageSquare size={32} strokeWidth={1.5} />,
      title: "WhatsApp",
      desc: "Chat langsung dengan kami",
    },
  ];

  const handleSupportClick = (title: string) => {
    if (title === "Hubungi Kami") {
      router.push("/support?action=email");
    } else if (title === "Alamat") {
      router.push("/profile/address");
    } else if (title === "WhatsApp") {
      window.open("https://wa.me/6282117236666", "_blank");
    } else if (title === "Dukungan Pelanggan") {
      router.push("/chat");
    } else {
      Swal.fire({
        icon: "info",
        title: "Segera Hadir",
        text: `Fitur ${title} sedang dalam tahap pengembangan!`,
        confirmButtonColor: "#ff6700"
      });
    }
  };

  return (
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
              onClick={() => handleSupportClick(item.title)}
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