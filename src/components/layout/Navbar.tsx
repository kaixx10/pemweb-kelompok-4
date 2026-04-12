"use client";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useFilterStore } from "@/store/useFilterStore";

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
  const { sortOrder, setSortOrder } = useFilterStore();
  const totalItems = mounted ? getTotalItems() : 0;

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
        
        {/* LOGO - Optically adjusted to compensate for the 32px rounded corners of Neo grid below */}
        <Link href="/" className="flex-shrink-0 ml-1 lg:ml-2.5 mr-6 lg:mr-10 z-[60]">
          <div className="w-[44px] h-[44px] bg-[#ff6700] flex items-center justify-center rounded-[12px] cursor-pointer hover:opacity-90 transition p-2.5 shadow-sm">
             <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM10.8 17h-2v-5.2H7.2V17h-2V7h3.6v3.2h2V7h2v10zm6 0h-2V7h2v10z"/>
             </svg>
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
              <Link href="/smart-home" className={`text-[15px] font-medium cursor-pointer px-4 xl:px-5 relative flex items-center h-full pt-[2px] transition-colors hover:text-[#ff6700] ${activeMenu === 'smart home' || pathname === '/smart-home' ? 'text-[#ff6700]' : 'text-gray-800'}`}>
                Smart Home
                <span className={`absolute bottom-0 left-4 xl:left-5 right-4 xl:right-5 h-[2px] transition-colors ${activeMenu === 'smart home' || pathname === '/smart-home' ? 'bg-[#ff6700]' : 'bg-transparent'}`}></span>
              </Link>
            </li>
        </ul>

        {/* Right Nav Options */}
        <div className="flex items-center gap-6 ml-auto z-[60] mr-2 lg:mr-4" onMouseEnter={() => handleMouseEnter('none')}>
<span className="text-[13px] font-medium text-gray-600 hover:text-[#ff6700] transition-colors cursor-pointer hidden md:block">Discover</span>
<span className="text-[13px] font-medium text-gray-600 hover:text-[#ff6700] transition-colors cursor-pointer hidden md:block">Support</span>
<span className="text-[13px] font-medium text-gray-600 hover:text-[#ff6700] transition-colors cursor-pointer mr-4 hidden xl:block">Community</span>
           
          <div className="flex items-center gap-5 border-l border-gray-200 pl-6">
            <button className="text-gray-600 hover:text-[#ff6700] transition-colors relative">
            {/* 1. Fitur Search (Mirip Xiaomi) */}
        <div className="flex items-center gap-1.5 md:gap-3 mr-2 md:mr-4 relative">
          <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border border-gray-200 focus-within:border-[#ff6700] transition-colors relative z-10 w-[180px] lg:w-[220px]">
            <Search size={16} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-[11px] md:text-xs w-full text-black placeholder-gray-400 focus:placeholder-[#ff6700]/50"
            />
          </div>

          {/* Drowpdown Auto-complete */}
          {localSearchQuery.length > 0 && (
             <div className="absolute top-full right-0 left-0 pt-3 z-50">
               <div className="bg-white border text-left border-gray-100 shadow-xl rounded-xl overflow-hidden py-2">
                 {isSearchSearching ? (
                    <div className="px-4 py-3 text-xs text-gray-400 text-center">Sedang mencari...</div>
                 ) : searchResults.length > 0 ? (
                    <ul className="flex flex-col">
                      {searchResults.map(product => (
                         <li key={product.id}>
                           <button 
                             onClick={() => {
                               setLocalSearchQuery(""); // Bersihkan input
                               router.push(`/?view_product=${product.id}`); // Memicu Quick View di Homepage
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
            </button>
            <button 
          onClick={() => {
            // Jika belum login, buka modal dan tahan di halaman saat ini
            if (!session) {
              openModal();
              return;
            }
            // Jika sudah login, baru boleh ke halaman keranjang
            router.push('/cart');
          }}
          className="text-gray-600 hover:text-black transition-colors relative"
        >
            <ShoppingBag size={20} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
        </button>
            {/* 3. USER PROFILE DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (session) {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  } else {
                    openModal();
                  }
                }} 
                className="flex items-center gap-2 text-gray-600 hover:text-[#ff6700] transition-colors"
                title="Profil Saya"
              >
                {session?.user?.image ? (
                  <img src={session.user.image} className="w-6 h-6 rounded-full object-cover" alt="Profile"/>
                ) : (
                  <User size={20} strokeWidth={2} />
                )}
              </button>

              {/* Panel Dropdown - Hanya tampil kalau sudah login & open */}
              {session && isProfileDropdownOpen && (
                <div className="absolute right-0 lg:left-1/2 lg:-translate-x-1/2 mt-4 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex flex-col items-center text-center">
                      <p className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">Hi, Sobat Neo</p>
                      <p className="text-[13px] font-bold text-gray-900 truncate w-full" title={session.user?.name || ""}>
                         {session.user?.name || "Pelanggan Setia"}
                      </p>
                   </div>
                   
                   <div className="py-1.5 flex flex-col">
                     <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-[#ff6700] transition-colors w-full text-left flex items-center gap-2">
                        Akun Saya
                     </Link>
                     <Link href="/profile#orders" onClick={() => setIsProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-orange-50 hover:text-[#ff6700] transition-colors w-full text-left flex justify-between items-center">
                        Pesanan <span className="w-4 h-4 rounded-full bg-[#ff6700] text-white text-[9px] flex items-center justify-center">?</span>
                     </Link>
                   </div>

                   <div className="h-px bg-gray-100 w-full"></div>
                   
                   <div className="p-1.5">
                     <button 
                       onClick={async () => {
                         setIsProfileDropdownOpen(false);
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
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">REDMI A7 Pro</li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi 17 Ultra</li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">REDMI Buds 8 Active</li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi TV A 43 FHD 2026</li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Xiaomi Pad 8</li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Mijia Refrigerator Side</li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Mi Precision Screwdriver</li>
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
                      {[
                        { name: "POCO X7 Pro 5G", img: "📱" },
                        { name: "POCO F7", img: "📱" },
                        { name: "POCO M7", img: "📱" },
                        { name: "POCO C85", img: "📱" },
                      ].map((item, i) => (
                         <div key={i} className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                            <div className="text-4xl mb-3">{item.img}</div>
                            <span className="text-[10px] font-semibold text-gray-600 leading-tight">{item.name}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* ====== MOBILE CONTENT ====== */}
             {/* Note: Kita pakai position absolute semua agar ukurannya tidak tumpang tindih secara block dokument. */}
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
                   {[
                     { name: "Xiaomi 17", img: "📱", badge: "Baru" },
                     { name: "Xiaomi 17 Ultra", img: "📱", badge: "Baru" },
                     { name: "Xiaomi 15T Pro", img: "📱" },
                     { name: "Xiaomi 15T", img: "📱" },
                     { name: "Xiaomi 15T 12 GB + Xiaomi Buds 5", img: "📱" }
                   ].map((item, i) => (
                      <div key={i} className="flex-1 bg-gray-50 p-6 rounded-2xl flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                         {item.badge && <span className="absolute top-4 left-4 text-[10px] font-bold text-gray-800 bg-yellow-100 px-2 py-0.5 rounded-sm">{item.badge}</span>}
                         <div className="text-6xl mb-6">📱</div>
                         <span className="text-xs font-semibold text-gray-800 text-center">{item.name}</span>
                      </div>
                   ))}
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
                   {[
                     { name: "Xiaomi Watch S", badge: "Baru" },
                     { name: "Xiaomi Watch S4 41mm", badge: "" },
                     { name: "Xiaomi Watch S4", badge: "" },
                     { name: "REDMI Watch 5", badge: "" },
                     { name: "REDMI Watch 5 Lite", badge: "" }
                   ].map((item, i) => (
                      <div key={i} className="flex-1 bg-[#f9f9f9] p-6 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative border border-gray-100">
                         {item.badge && <span className="absolute top-4 left-4 text-[10px] font-bold text-gray-800 bg-yellow-100 px-2 py-0.5 rounded-sm">{item.badge}</span>}
                         <div className="text-5xl mb-6">⌚</div>
                         <span className="text-xs font-semibold text-gray-800 text-center">{item.name}</span>
                      </div>
                   ))}
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
                         <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Screwdrivers <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
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
                         <div className="text-4xl mb-3">🖤</div>
                         <span className="text-[10px] font-semibold text-gray-600 leading-tight">Braided USB-C Cable (10cm)</span>
                      </div>
                      <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                         <div className="text-4xl mb-3">🔋</div>
                         <span className="text-[10px] font-semibold text-gray-600 leading-tight">UltraThin Magnetic Bank</span>
                      </div>
                      <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                         <div className="text-4xl mb-3">🔌</div>
                         <span className="text-[10px] font-semibold text-gray-600 leading-tight">20W Fast Charging Auth</span>
                      </div>
                      <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                         <div className="text-4xl mb-3">🔦</div>
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
                         <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">TV Boxes/Sticks <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                         <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">TVs <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
                         <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Projectors</li>
                         <li className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Refrigerators <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>
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
                         <div className="text-4xl mb-3">📺</div>
                         <span className="text-[10px] font-semibold text-gray-600 leading-tight">Xiaomi TV A 32 2026</span>
                      </div>
                      <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                         <div className="text-4xl mb-3">📺</div>
                         <span className="text-[10px] font-semibold text-gray-600 leading-tight">Xiaomi TV A 43 FHD</span>
                      </div>
                      <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                         <div className="text-4xl mb-3">🧊</div>
                         <span className="text-[10px] font-semibold text-gray-600 leading-tight">Mijia Refrigerator Side 635L</span>
                      </div>
                      <div className="bg-[#f9f9f9] rounded-2xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center border border-gray-100">
                         <div className="text-4xl mb-3">🧹</div>
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
