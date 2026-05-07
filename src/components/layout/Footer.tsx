"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail,
  ChevronRight,
} from "lucide-react";

// SVG Icons for Social Brands
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3z"/></svg>
);

export default function Footer() {
  const pathname = usePathname() || "";
  
  // Jika sedang di halaman admin, sembunyikan Footer utama
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-[#1a1a1a] text-[#b0b0b0] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* 1. Brand & Deskripsi */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="Xiaomi Logo" className="w-9 h-9 object-contain rounded-xl shadow-sm" />
              <span className="font-bold text-xl text-white tracking-tight">Xiaomi</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#888]">
              Toko elektronik modern dengan koleksi produk Xiaomi terlengkap dan harga terbaik untuk gaya hidup masa kini.
            </p>
          </div>

          {/* 2. Kategori */}
          <div className="flex flex-col gap-5">
            <h3 className="text-white text-[15px] font-bold">Kategori</h3>
            <ul className="flex flex-col gap-3 text-[13px]">
              <li><Link href="/" className="hover:text-[#ff6700] transition-colors">Store</Link></li>
              <li><Link href="/mobile" className="hover:text-[#ff6700] transition-colors">Mobile</Link></li>
              <li><Link href="/wearables" className="hover:text-[#ff6700] transition-colors">Wearables</Link></li>
              <li><Link href="/lifestyle" className="hover:text-[#ff6700] transition-colors">Lifestyle</Link></li>
              <li><Link href="/smart-home" className="hover:text-[#ff6700] transition-colors">Smart Home</Link></li>
            </ul>
          </div>

          {/* 3. Tentang & Bantuan */}
          <div className="flex flex-col gap-5">
            <h3 className="text-white text-[15px] font-bold">Informasi</h3>
            <ul className="flex flex-col gap-3 text-[13px]">
              <li><Link href="/about" className="hover:text-[#ff6700] transition-colors">Tentang Kami</Link></li>
              <li><Link href="/support" className="hover:text-[#ff6700] transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/returns" className="hover:text-[#ff6700] transition-colors">Kebijakan Pengembalian</Link></li>
              <li><Link href="/faq" className="hover:text-[#ff6700] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* 4. Kontak & Sosial */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[15px] font-bold">Layanan Pelanggan</h3>
              <div className="flex flex-col gap-3 text-[13px]">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#ff6700]" />
                  <span>00180300650029</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#ff6700]" />
                  <span>service.id@support.mi.com</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-white text-[13px] font-medium text-[#666]">Ikuti Kami</h3>
              <div className="flex gap-5 text-[#888]">
                <a href="https://www.facebook.com/XiaomiIndonesia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FacebookIcon /></a>
                <a href="https://www.instagram.com/xiaomi.indonesia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><InstagramIcon /></a>
                <a href="https://twitter.com/XiaomiIndonesia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><TwitterIcon /></a>
                <a href="https://www.youtube.com/XiaomiIndonesia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><YoutubeIcon /></a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-[#262626] flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-[#555]">
          <p>© {new Date().getFullYear()} Xiaomi. Tugas Kuliah Semester 4 - Kelompok 4</p>
        </div>
      </div>
    </footer>
  );
}
