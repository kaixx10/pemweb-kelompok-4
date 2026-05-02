"use client";

import { Search, ShoppingBag, X, User, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAuthModalStore } from "@/store/useAuthModalStore";

interface SearchResult {
  id: string;
  name: string;
  img: string;
}

const highlightMatch = (text: string, query: string) => {
  if (!query) return <span>{text}</span>;
  // Escape special characters to prevent regex errors
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-[#ff6700] text-[13px] font-black">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || "";

  // Jika sedang di halaman admin, sembunyikan Navbar utama
  if (pathname.startsWith('/admin')) return null;

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuHeight, setMenuHeight] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const { openModal } = useAuthModalStore();

  // Object penampung DOM refs untuk mengukur tinggi setiap kategori dropdown
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Cart store
  const { getTotalItems } = useCartStore();
  const totalItems = mounted ? getTotalItems() : 0;

  // Search expand state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Local state for auto-complete search
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchSearching, setIsSearchSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced API call untuk Auto-complete Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (localSearchQuery.trim() !== '') {
        setIsSearchSearching(true);
        fetch(`/api/products/search?q=${encodeURIComponent(localSearchQuery)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setIsSearchSearching(false);
          })
          .catch(() => setIsSearchSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [localSearchQuery]);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  // Kalkulasi Tinggi presisi setiap pindah kategori
  useEffect(() => {
    if (activeMenu && contentRefs.current[activeMenu]) {
      // Ditambah 80 karena efek py-10 (padding top 40px + padding bottom 40px)
      setMenuHeight(contentRefs.current[activeMenu]!.scrollHeight + 80);
    } else {
      setMenuHeight(0);
    }
  }, [activeMenu]);

  return (
    <nav
      className="w-full bg-white z-[100] font-sans border-b border-gray-100 sticky top-0 shadow-sm"
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Navbar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[60px] flex items-center relative bg-white z-50">
        
        {/* LOGO - Menggunakan favicon MI */}
        <Link href="/" className="flex-shrink-0 ml-1 lg:ml-2.5 mr-6 lg:mr-10 z-[60]">
          <div className="w-[44px] h-[44px] flex items-center justify-center cursor-pointer hover:opacity-90 transition shadow-sm rounded-[12px] overflow-hidden">
            <img src="/favicon.ico" alt="Xiaomi Logo" className="w-full h-full object-cover" />
          </div>
        </Link>

        {/* Categories / Links */}
        <ul className="hidden xl:flex flex-1 items-center h-full z-[60]">
          <li className="h-full flex items-center z-[60]" onMouseEnter={() => handleMouseEnter('store')}>
            <Link href="/" className={`text-[15px] font-medium cursor-pointer px-4 xl:px-5 relative flex items-center h-full pt-[2px] transition-colors hover:text-[#ff6700] ${activeMenu === 'store' || pathname === '/' ? 'text-[#ff6700]' : 'text-gray-800'}`}>
              Store
              <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] transition-colors ${activeMenu === 'store' || pathname === '/' ? 'bg-[#ff6700]' : 'bg-transparent'}`}></span>
            </Link>
          </li>
          
          <li className="h-full flex items-center z-[60]" onMouseEnter={() => handleMouseEnter('mobile')}>
            <Link href="/mobile" className={`text-[15px] font-medium cursor-pointer px-4 xl:px-5 relative flex items-center h-full pt-[2px] transition-colors hover:text-[#ff6700] ${activeMenu === 'mobile' || pathname === '/mobile' ? 'text-[#ff6700]' : 'text-gray-800'}`}>
              Mobile
              <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] transition-colors ${activeMenu === 'mobile' || pathname === '/mobile' ? 'bg-[#ff6700]' : 'bg-transparent'}`}></span>
            </Link>
          </li>

          <li className="h-full flex items-center z-[60]" onMouseEnter={() => handleMouseEnter('wearables')}>
            <Link href="/wearables" className={`text-[15px] font-medium cursor-pointer px-4 xl:px-5 relative flex items-center h-full pt-[2px] transition-colors hover:text-[#ff6700] ${activeMenu === 'wearables' || pathname === '/wearables' ? 'text-[#ff6700]' : 'text-gray-800'}`}>
              Wearables
              <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] transition-colors ${activeMenu === 'wearables' || pathname === '/wearables' ? 'bg-[#ff6700]' : 'bg-transparent'}`}></span>
            </Link>
          </li>

          <li className="h-full flex items-center z-[60]" onMouseEnter={() => handleMouseEnter('lifestyle')}>
            <Link href="/lifestyle" className={`text-[15px] font-medium cursor-pointer px-4 xl:px-5 relative flex items-center h-full pt-[2px] transition-colors hover:text-[#ff6700] ${activeMenu === 'lifestyle' || pathname === '/lifestyle' ? 'text-[#ff6700]' : 'text-gray-800'}`}>
              Lifestyle
              <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] transition-colors ${activeMenu === 'lifestyle' || pathname === '/lifestyle' ? 'bg-[#ff6700]' : 'bg-transparent'}`}></span>
            </Link>
          </li>

          <li className="h-full flex items-center z-[60]" onMouseEnter={() => handleMouseEnter('smart home')}>
            <Link href="/smart-home" className={`whitespace-nowrap text-[15px] font-medium cursor-pointer px-4 xl:px-5 relative flex items-center h-full pt-[2px] transition-colors hover:text-[#ff6700] ${activeMenu === 'smart home' || pathname === '/smart-home' ? 'text-[#ff6700]' : 'text-gray-800'}`}>
              Smart Home
              <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] transition-colors ${activeMenu === 'smart home' || pathname === '/smart-home' ? 'bg-[#ff6700]' : 'bg-transparent'}`}></span>
            </Link>
          </li>
        </ul>

        {/* Right Section Wrapper */}
        <div className="flex items-center h-full ml-auto z-[60]" onMouseEnter={() => handleMouseEnter('none')}>
          
          {/* Right Nav Options (Search, Support, Cart, Profile) */}
          <div className="flex items-center gap-4 h-full z-[60]">
            
            {/* 1. Fitur Search - Expandable Ikon ala Xiaomi */}
            <div className="flex items-center relative">
              {/* Overlay gelap saat search terbuka */}
              {isSearchOpen && (
                <div 
                  className="fixed inset-0 bg-black/10 z-40"
                  onClick={() => { setIsSearchOpen(false); setLocalSearchQuery(""); }}
                />
              )}

              {/* Input yang expand dari kanan */}
              <div className={`flex items-center gap-2 rounded-full border transition-all duration-300 overflow-hidden relative z-50 group/search
                ${isSearchOpen 
                  ? 'bg-transparent border-[#ff6700] w-[280px] px-3 py-2' 
                  : 'bg-transparent border-transparent w-8 h-8 justify-center cursor-pointer'
                }`}
                onClick={() => !isSearchOpen && setIsSearchOpen(true)}
              >
                <Search size={16} className={`flex-shrink-0 transition-colors ${isSearchOpen ? 'text-[#ff6700]' : 'text-gray-600 group-hover/search:text-[#ff6700]'}`} />
                {isSearchOpen && (
                  <>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Cari produk..."
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && localSearchQuery.trim()) {
                          setIsSearchOpen(false);
                          router.push(`/search?q=${encodeURIComponent(localSearchQuery)}`);
                        }
                      }}
                      className="bg-transparent outline-none text-xs w-full text-black placeholder-gray-400"
                    />
                    {localSearchQuery && (
                      <button onClick={(e) => { e.stopPropagation(); setLocalSearchQuery(""); }} className="text-gray-400 hover:text-gray-700">
                        <X size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Dropdown Autocomplete */}
              {isSearchOpen && localSearchQuery.length > 0 && (
                <div className="absolute top-full right-0 pt-3 z-50" style={{minWidth: '280px'}}>
                  <div className="bg-white border text-left border-gray-100 shadow-xl rounded-xl overflow-hidden py-2">
                    {isSearchSearching ? (
                      <div className="px-4 py-3 text-xs text-gray-400 text-center">Sedang mencari...</div>
                    ) : searchResults.length > 0 ? (
                      <ul className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                        {searchResults.map(product => (
                          <li key={product.id}>
                            <button
                              onClick={() => {
                                setLocalSearchQuery("");
                                setIsSearchOpen(false);
                                router.push(`/?view_product=${product.id}`);
                              }}
                              className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#ff6700] transition-colors flex items-center justify-between group"
                            >
                              <span className="truncate pr-2">{highlightMatch(product.name, localSearchQuery)}</span>
                              <span className="text-gray-300 group-hover:text-[#ff6700] transition-colors">&gt;</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-3 text-xs text-gray-500 text-center">Produk tidak ditemukan</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Fitur Support (Ikon) */}
            <Link 
              href="/#support" 
              className="text-gray-600 hover:text-[#ff6700] transition-colors p-1.5"
              title="Support"
            >
              <HelpCircle size={20} strokeWidth={2} />
            </Link>

            {/* 3. Fitur Keranjang */}
            <button
              onClick={() => {
                if (!session) {
                  openModal();
                  return;
                }
                router.push('/cart');
              }}
              className="text-gray-600 hover:text-[#ff6700] transition-colors relative p-1.5"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff6700] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* 4. USER PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => {
                  if (session) {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  } else {
                    openModal();
                  }
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-[#ff6700] transition-colors p-1.5"
                title="Profil Saya"
              >
                <User size={20} strokeWidth={2} />
              </button>

              {/* Panel Dropdown - Hanya tampil kalau sudah login & open */}
              {session && isProfileDropdownOpen && (
                <div className="absolute right-0 lg:left-1/2 lg:-translate-x-1/2 mt-4 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex flex-col items-center text-center">
                    <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Hi, Sobat Xiaomi</p>
                    <p className="text-[13px] font-bold text-gray-900 truncate w-full" title={session.user?.name || ""}>
                      {session.user?.name || "Pelanggan Setia"}
                    </p>
                  </div>
                  
                  <div className="py-1.5 flex flex-col">
                    <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-[#ff6700] transition-colors w-full text-left flex items-center gap-2">
                      Akun Saya
                    </Link>
                    <Link href="/profile/orders" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-[#ff6700] transition-colors w-full text-left flex justify-between items-center">
                      Pesanan {totalItems > 0 && <span className="w-4 h-4 rounded-full bg-[#ff6700] text-white text-[9px] flex items-center justify-center">{totalItems}</span>}
                    </Link>
                    {(session?.user as any)?.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-[#ff6700] hover:bg-orange-50 transition-colors w-full text-left flex items-center gap-2">
                        ⚡ Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="h-px bg-gray-100 w-full"></div>
                  
                  <div className="p-1.5">
                    <button
                      onClick={async () => {
                        setIsProfileDropdownOpen(false);
                        useCartStore.getState().emptyCart();
                        await signOut({ redirect: false });
                        router.push('/');
                      }}
                      className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Link minimalis ditaruh di sebelah Login/Logout */}
            {(session?.user as any)?.role === "ADMIN" && (
              <Link href="/admin" className="text-xs font-bold text-white bg-black hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors hidden sm:block shadow-md">
                Mulai Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* UNIFIED MEGA MENU CONTAINER WITH DYNAMIC HEIGHT TRANSITION */}
      <div 
        className={`absolute left-0 top-[60px] w-full bg-white shadow-xl z-40 overflow-hidden transition-[height,opacity,border] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${menuHeight > 0 ? 'opacity-100 border-t border-gray-100' : 'opacity-0 border-t-0'}`}
        style={{ height: `${menuHeight}px`, willChange: 'height, opacity' }}
        onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
      >
        {/* Container Absolute Contents ditumpuk */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative w-full h-full">
            
{/* ====== STORE CONTENT ====== */}
            <div 
              ref={el => { contentRefs.current['store'] = el }}
              className={`flex gap-8 absolute top-10 left-6 lg:left-10 right-6 lg:right-10 ${activeMenu === 'store' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none invisible'}`}
            >
               <div className="w-[60%] grid grid-cols-3 gap-4">
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Yang Baru</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p1823'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">REDMI A7 Pro</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p1921'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi 17 Ultra</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p5148'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">REDMI Buds 8 Active</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p8172'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi TV A 43 FHD 2026</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p178'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi Pad 8</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p316'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Mijia Refrigerator Side</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p7342'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Mi Precision Screwdriver</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Event Penting</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Pilihan Harian</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Baru Diluncurkan</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Fitur Nitec.com</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Zona Pengguna Baru</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Penukaran IMEI</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Hadiah Ulang Tahun</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Unduh App Nitec Store</li>
                      </ul>
                   </div>
               </div>
               <div className="w-[40%] flex flex-col pl-8 border-l border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 text-sm hover:text-black cursor-pointer flex justify-between group/link transition-colors">
                     Pilihan Harian <span className="text-gray-400 group-hover/link:text-black transition-colors">&gt;</span>
                  </h4>
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
                     <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p220'); }} className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="/uploads/products/neo-product-1776054940909-513469930.webp" alt="POCO C85" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">POCO C85</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i02.appmifile.com/mi-com-product/fly-birds/poco-f6/pc/0ee720f4c000bd9337ff553a1a9cb0b2.png" alt="POCO F7" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">POCO F7</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i02.appmifile.com/mi-com-product/fly-birds/poco-m6-pro/pc/f4640ebc77d54d92cd97034cf9b0eb23.png" alt="POCO M7" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">POCO M7</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i02.appmifile.com/mi-com-product/fly-birds/poco-x6-pro/pc/8ba1116c4c66ff97f5fb5df3f31fba8b.png" alt="POCO X7 Pro 5G" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">POCO X7 Pro 5G</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* ====== MOBILE CONTENT ====== */}
            <div 
              ref={el => { contentRefs.current['mobile'] = el }}
              className={`flex gap-8 absolute top-10 left-6 lg:left-10 right-6 lg:right-10 ${activeMenu === 'mobile' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none invisible'}`}
            >
               <div className="flex flex-col gap-6 w-[20%] pr-8">
                  <div>
                    <h4 className="font-bold text-black text-sm mb-3">Phones</h4>
                    <ul className="flex flex-col gap-3 text-[13px] text-gray-600 font-medium pl-2">
                      <li className="text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi Series</li>
                      <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">REDMI Series</li>
                      <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">POCO Phones</li>
                    </ul>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm hover:text-black cursor-pointer transition-colors">Tablets</h4>
               </div>
               <div className="w-[80%] flex gap-4">
                  <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p3341'); }} className="flex-1 bg-gray-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                     <span className="absolute top-4 left-4 text-[10px] font-bold text-gray-800 bg-yellow-100 px-2 py-0.5 rounded-sm">Baru</span>
                     <img src="/uploads/products/neo-product-1776053218365-355376790.webp" alt="Xiaomi 17" className="w-24 h-24 object-contain mb-4 mix-blend-multiply" />
                     <span className="text-xs font-semibold text-gray-800 text-center">Xiaomi 17</span>
                  </div>
                  <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p1921'); }} className="flex-1 bg-gray-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                     <span className="absolute top-4 left-4 text-[10px] font-bold text-gray-800 bg-yellow-100 px-2 py-0.5 rounded-sm">Baru</span>
                     <img src="/uploads/products/neo-product-1776051074818-257222761.webp" alt="Xiaomi 17 Ultra" className="w-24 h-24 object-contain mb-4 mix-blend-multiply" />
                     <span className="text-xs font-semibold text-gray-800 text-center">Xiaomi 17 Ultra</span>
                  </div>
                  <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p2290'); }} className="flex-1 bg-gray-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                     <img src="/uploads/products/neo-product-1776053817229-827613014.webp" alt="Xiaomi 15T Pro" className="w-24 h-24 object-contain mb-4 mix-blend-multiply" />
                     <span className="text-xs font-semibold text-gray-800 text-center">Xiaomi 15T Pro</span>
                  </div>
               </div>
            </div>

            {/* ====== WEARABLES CONTENT ====== */}
            <div 
              ref={el => { contentRefs.current['wearables'] = el }}
              className={`flex gap-8 absolute top-10 left-6 lg:left-10 right-6 lg:right-10 ${activeMenu === 'wearables' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none invisible'}`}
            >
               <div className="flex flex-col gap-5 w-[20%] pr-8">
                  <h4 className="font-bold text-black text-sm cursor-pointer hover:translate-x-1 transition-transform">Smart Watches</h4>
                  <h4 className="font-bold text-gray-900 text-sm hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Smart Bands</h4>
                  <h4 className="font-bold text-gray-900 text-sm hover:text-black cursor-pointer hover:translate-x-1 transition-transform">TWS Earphones</h4>
                  <h4 className="font-bold text-gray-900 text-sm hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Smart Audio Glasses</h4>
                  <h4 className="font-bold text-gray-900 text-sm hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Smart Tags</h4>
               </div>
               <div className="w-[80%] flex gap-4">
                  <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p2898'); }} className="flex-1 bg-[#f9f9f9] p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                     <span className="absolute top-4 left-4 text-[10px] font-bold text-gray-800 bg-yellow-100 px-2 py-0.5 rounded-sm">Baru</span>
                     <img src="/uploads/products/neo-product-1776054216337-191000896.webp" alt="Xiaomi Watch S4" className="w-20 h-20 object-contain mb-4 mix-blend-multiply" />
                     <span className="text-xs font-semibold text-gray-800 text-center">Xiaomi Watch S4 41mm</span>
                  </div>
                  <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p5148'); }} className="flex-1 bg-[#f9f9f9] p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                     <img src="/uploads/products/neo-product-1776051914100-646660617.webp" alt="REDMI Buds 8 Active" className="w-20 h-20 object-contain mb-4 mix-blend-multiply" />
                     <span className="text-xs font-semibold text-gray-800 text-center">REDMI Buds 8 Active</span>
                  </div>
               </div>
            </div>

            {/* ====== LIFESTYLE CONTENT ====== */}
            <div 
              ref={el => { contentRefs.current['lifestyle'] = el }}
              className={`flex gap-8 absolute top-10 left-6 lg:left-10 right-6 lg:right-10 ${activeMenu === 'lifestyle' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none invisible'}`}
            >
               <div className="w-[60%] grid grid-cols-4 gap-4">
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Chargings</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Powerbanks <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Adapters <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Wireless</li>
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Cables <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                      </ul>
                      <h4 className="font-bold text-gray-900 text-sm mt-4 mb-1">Health & Fitness</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Pets Care</li>
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Clothing Care <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Water Bottles</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Outdoors</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="text-black cursor-pointer hover:translate-x-1 transition-transform">Scooters</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Glasses</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Luggages</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Air Compressors</li>
                      </ul>
                      <h4 className="font-bold text-gray-900 text-sm mt-4 mb-1">Tools</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p7342'); }} className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Screwdrivers <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Selfie Sticks</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Offices</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Monitors <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Routers</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Extenders</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Tablets</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Accessories</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Personal Care</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Hair Dryers</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Shavers</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Hair Clippers</li>
                      </ul>
                   </div>
               </div>
               {/* Featured items border left */}
               <div className="w-[40%] pl-8 border-l border-gray-100 flex flex-col">
                  <h4 className="font-bold text-gray-900 mb-6 text-sm hover:text-black cursor-pointer flex justify-between group/link transition-colors">
                     Online 24 produk baru <span className="text-gray-400 group-hover/link:text-black transition-colors">&gt;</span>
                  </h4>
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i01.appmifile.com/webfile/globalimg/products/pc/mi-braided-usb-type-c-cable/specs-01.png" alt="Braided Cable" className="w-12 h-12 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">Braided USB-C Cable (10cm)</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-magnetic-power-bank-6000mah/pc/7fc7868ab1cc7bcda93510522c069ff3.png" alt="Power Bank" className="w-12 h-12 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">UltraThin Magnetic Bank</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1603444458.1969440.png" alt="Fast Charger" className="w-12 h-12 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">20W Fast Charging Auth</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1604044521.16834169.png" alt="Lint Remover" className="w-12 h-12 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">Mijia Lint Remover 2</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* ====== SMART HOME CONTENT ====== */}
            <div 
              ref={el => { contentRefs.current['smart home'] = el }}
              className={`flex gap-8 absolute top-10 left-6 lg:left-10 right-6 lg:right-10 ${activeMenu === 'smart home' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none invisible'}`}
            >
               <div className="w-[60%] grid grid-cols-4 gap-4">
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">TVs & HA</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p8172'); }} className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">TVs <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">TV Boxes/Sticks <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Projectors</li>
                        <li onClick={() => { setActiveMenu(null); router.push('/?view_product=p316'); }} className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Refrigerators <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Washing Machines</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Vacuum Cleaners</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Robot Vacuums</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Handheld Vacuums</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Wet Dry Vacuums</li>
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Accessories <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Environment</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Air Purifiers</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Dehumidifiers</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Monitors</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Accessories</li>
                      </ul>
                   </div>
                   <div className="flex flex-col gap-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">Kitchen & Sec</h4>
                      <ul className="flex flex-col gap-3 text-[12px] text-gray-500 font-medium">
                        <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Security Cameras <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Smart Doorbells</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Air Fryers</li>
                        <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Induction Cookers</li>
                      </ul>
                   </div>
               </div>
               <div className="w-[40%] pl-8 border-l border-gray-100 flex flex-col">
                  <h4 className="font-bold text-gray-900 mb-4 text-sm hover:text-black cursor-pointer flex justify-between group/link transition-colors">
                     Online 24 produk baru <span className="text-gray-400 group-hover/link:text-black transition-colors">&gt;</span>
                  </h4>
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-tv-a-32-2025/pc/21b9da8591bd051e59ed1ee24c4dc8c1.png" alt="TV A 32" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">Xiaomi TV A 32 2026</span>
                     </div>
                     <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p8172'); }} className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="/uploads/products/neo-product-1776052289009-52780260.webp" alt="TV A 43" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">Xiaomi TV A 43 FHD</span>
                     </div>
                     <div onClick={() => { setActiveMenu(null); router.push('/?view_product=p316'); }} className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="/uploads/products/neo-product-1776052829830-336730713.webp" alt="Refrigerator" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">Mijia Refrigerator Side 635L</span>
                     </div>
                     <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                        <img src="https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-robot-vacuum-x20-plus/pc/d30b91e9a7eaf0bc23ff01a6136d812d.png" alt="Vacuum" className="w-14 h-14 object-contain mb-2 mix-blend-multiply" />
                        <span className="text-[10px] font-semibold text-gray-600 leading-tight">Xiaomi Vacuum G30 Max</span>
                     </div>
                  </div>
               </div>
            </div>

        </div>
      </div>
    </nav>
  );
}