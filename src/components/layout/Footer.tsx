"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Heart, Play, Share2 } from "lucide-react";

export default function Footer() {
  const pathname = usePathname() || "";
  
  // Jika sedang di halaman admin, sembunyikan Footer utama
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-[var(--background)] mt-auto border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="w-full bg-black text-gray-400">
         <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/favicon.ico" alt="Xiaomi Logo" className="w-8 h-8 rounded-lg" />
                  <span className="font-bold text-lg text-white">Xiaomi</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Toko elektronik modern dengan koleksi produk Xiaomi terlengkap dan harga terbaik.
                </p>
              </div>

          {/* Kategori */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Kategori</h3>
            <ul className="space-y-2.5">
              <li><Link href="/mobile" className="text-sm text-gray-500 hover:text-white transition-colors">Smartphone</Link></li>
              <li><Link href="/?view_product=p178" className="text-sm text-gray-500 hover:text-white transition-colors">Tablet</Link></li>
              <li><Link href="/wearables" className="text-sm text-gray-500 hover:text-white transition-colors">Smartwatch</Link></li>
              <li><Link href="/?view_product=p5148" className="text-sm text-gray-500 hover:text-white transition-colors">Earbuds</Link></li>
              <li><Link href="/lifestyle" className="text-sm text-gray-500 hover:text-white transition-colors">Aksesori</Link></li>
            </ul>
          </div>

          {/* Tentang */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Tentang</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Kebijakan Pengembalian</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Layanan Pelanggan */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Layanan Pelanggan</h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-500">
                <span className="font-medium">Hubungi Kami:</span>
                <div className="mt-1 text-white font-semibold">+62-821-1723-6765</div>
              </li>
              <li className="text-sm text-gray-500">
                <span className="font-medium">Email:</span>
                <div className="mt-1 text-white text-sm">service.id@support.mi.com</div>
              </li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Track Pesanan</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Sosial Media</h3>
            <div className="flex gap-3">
              <a 
                href="https://x.com/Xiaomi" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"
                title="Twitter/X"
              >
                <Share2 size={18} strokeWidth={2} />
              </a>
              <a 
                href="https://www.instagram.com/xiaomi.indonesia?igsh=MW1jNWJ4YzE4ZzV5Ng==" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"
                title="Instagram"
              >
                <Heart size={18} strokeWidth={2} />
              </a>
              <a 
                href="https://youtube.com/@xiaomi?si=Z_v7F3drom0xraL1" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"
                title="YouTube"
              >
                <Play size={18} strokeWidth={2} />
              </a>
              <a 
                href="service.id@support.mi.com" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"
                title="Email"
              >
                <Mail size={18} strokeWidth={2} />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} <span className="text-white">Xiaomi.</span> Tugas Kuliah Semester 4
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat Penggunaan</a>
            <a href="#" className="hover:text-white transition-colors">Cookie</a>
          </div>
        </div>
      </div>
     </div>
    </footer>
  );
}
