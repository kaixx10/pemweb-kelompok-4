import Link from "next/link";
import { Mail, Heart, Play, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#ff6700] flex items-center justify-center text-white font-bold text-sm">N</div>
              <span className="font-bold text-lg text-white">Nitec Store</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Toko elektronik modern dengan koleksi produk Xiaomi terlengkap dan harga terbaik.
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Kategori</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Smartphone</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Tablet</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Smartwatch</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Earbuds</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Aksesori</a></li>
            </ul>
          </div>

          {/* Tentang */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Tentang</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Kebijakan Pengembalian</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Layanan Pelanggan */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Layanan Pelanggan</h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-400">
                <span className="font-medium">Hubungi Kami:</span>
                <div className="mt-1 text-[#ff6700] font-semibold">+62-812-3456-7890</div>
              </li>
              <li className="text-sm text-gray-400">
                <span className="font-medium">Email:</span>
                <div className="mt-1 text-[#ff6700] text-sm">support@nitecstore.com</div>
              </li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">Track Pesanan</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-[#ff6700] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="font-bold text-white mb-4 text-[15px]">Sosial Media</h3>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#ff6700] hover:text-white transition-all"
                title="Twitter/X"
              >
                <Share2 size={18} strokeWidth={2} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#ff6700] hover:text-white transition-all"
                title="Instagram"
              >
                <Heart size={18} strokeWidth={2} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#ff6700] hover:text-white transition-all"
                title="YouTube"
              >
                <Play size={18} strokeWidth={2} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#ff6700] hover:text-white transition-all"
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
            &copy; {new Date().getFullYear()} <span className="text-[#ff6700]">Nitec Store</span>. Semua Hak Dilindungi.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#ff6700] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#ff6700] transition-colors">Syarat Penggunaan</a>
            <a href="#" className="hover:text-[#ff6700] transition-colors">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
