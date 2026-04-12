"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useFilterStore } from "@/store/useFilterStore";
import { createPortal } from "react-dom";

interface ProductGridProps {
  initialProducts: any[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const router = useRouter();
  const [addedNotification, setAddedNotification] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  const { addToCart } = useCartStore();
  const { data: session } = useSession();
  const { openModal } = useAuthModalStore();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { sortOrder } = useFilterStore();
  const searchParams = useSearchParams();
  const viewProductId = searchParams.get('view_product');

  const formatIDR = (price: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const products = initialProducts.map(p => {
    let emoji = "📦";
    try {
      if (p.images) {
        const parsed = JSON.parse(p.images);
        emoji = Array.isArray(parsed) ? parsed[0] : parsed;
      }
    } catch (e) {
      emoji = p.images || "📦";
    }

    return {
      id: p.id,
      name: p.name,
      price: formatIDR(p.price),
      rawPrice: Number(p.price), // Data mentah untuk dihitung algoritma Sort
      img: emoji,
      desc: p.description,
      featured: p.slug.includes('ultra')
    };
  });

  useEffect(() => {
    if (viewProductId) {
      const found = products.find(p => p.id === viewProductId);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [viewProductId, products]);

  // ==========================================
  // ALGORITMA SORT DIMULAI DI SINI
  // ==========================================
  let displayedProducts = [...products];

  // 1. Algoritma Pengurutan (Sorting)
  if (sortOrder === "asc") {
    displayedProducts.sort((a, b) => a.rawPrice - b.rawPrice); // Termurah
  } else if (sortOrder === "desc") {
    displayedProducts.sort((a, b) => b.rawPrice - a.rawPrice); // Termahal
  }

  // Cek apakah user sedang menggunakan fitur filter
  const isFiltering = sortOrder !== "none";
  // ==========================================

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!session) {
      openModal();
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      desc: product.desc,
    });
    setAddedNotification(product.id);
    setTimeout(() => setAddedNotification(null), 2000);
  };

  const handleBuyNow = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!session) {
      openModal();
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      desc: product.desc,
    });
    router.push("/payment");
  };  

  if (!products.length) {
    return (
      <section className="w-full bg-transparent py-20 text-center">
        <p className="text-gray-500 italic">Belum ada produk untuk ditampilkan. Silakan isi data di MySQL.</p>
      </section>
    );
  }

  // Helper function untuk merender Card Produk agar tidak menulis kode berulang
  const renderProductCard = (product: any) => (
    <div 
      key={product.id} 
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-[2rem] hover:-translate-y-1 hover:shadow-xl shadow-gray-200/50 transition-all duration-300 flex flex-col items-center justify-between p-6 md:p-8 text-center cursor-pointer group border border-gray-100 relative"
    >
      {product.name.includes("Mijia") || product.name.includes("17") ? 
        <span className="bg-yellow-100 border border-gray-300 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-sm absolute top-6 left-6 hidden md:block">Baru</span> : null
      }
      <button
        onClick={(e) => handleAddToCart(product, e)}
        className={`absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-2.5 rounded-full transition-all duration-300 flex items-center justify-center z-10 ${
          addedNotification === product.id ? 'bg-green-500 text-white scale-110 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-black hover:text-white'
        }`}
      >
        <ShoppingCart size={16} strokeWidth={2.5} />
      </button>
      <div className="w-24 h-24 md:w-32 md:h-32 mb-6 mt-4 flex items-center justify-center text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg flex-shrink-0 relative">
        {product.img && (product.img.startsWith('http') || product.img.startsWith('/')) ? (
          <img src={product.img} alt={product.name} className="w-full h-full object-contain drop-shadow-md" />
        ) : (
          product.img
        )}
      </div>
      <div className="flex flex-col items-center w-full mb-3 md:mb-4">
        <h3 className="font-bold text-gray-900 group-hover:text-[#ff6700] transition-colors duration-300 text-[13px] md:text-[16px] mb-1 leading-tight line-clamp-2">{product.name}</h3>
        <p className="text-gray-500 text-[11px] md:text-[12px] mb-2 md:mb-3 font-medium line-clamp-1">{product.desc}</p>
        <p className="text-black font-bold text-[14px] md:text-[15px] tracking-tight">{product.price}</p>
      </div>
      <button
        onClick={(e) => handleBuyNow(product, e)}
        className="w-full bg-gray-900 text-white py-2 md:py-2.5 rounded-lg font-bold text-xs md:text-sm hover:bg-black transition-colors"
      >
        Beli sekarang
      </button>
    </div>
  );

  return (
    <section className="w-full bg-transparent py-8 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-end pb-3 mb-6">
          <div className="flex items-center gap-4">
             <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
               {isFiltering ? "Hasil Pencarian 🔍" : "Pilihan Harian"} <span className={isFiltering ? "hidden" : "text-yellow-500"}>⚡</span>
             </h2>
          </div>
        </div>
  
        <div className="flex flex-col gap-6">
           {isFiltering ? (
             // TAMPILAN JIKA SEDANG MENCARI (Hanya Grid, Banner disembunyikan)
             <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-2">
               {displayedProducts.length > 0 ? (
                 displayedProducts.map(renderProductCard)
               ) : (
                 <div className="col-span-full py-20 text-center text-gray-500 text-lg">
                    Belum ada produk. 😢
                 </div>
               )}
             </div>
           ) : (
             // TAMPILAN NORMAL (Ada Banner Utama + Grid produk kecil)
             <>
               {products.length > 0 && (
                 <div className="w-full bg-white rounded-[2rem] flex flex-col md:flex-row overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    <div className="w-full md:w-1/2 bg-[#1a1a1a] p-8 md:p-12 flex items-center justify-center relative overflow-hidden group min-h-[300px] md:min-h-0">
                        <div className="relative w-[70%] aspect-[2.2/1] bg-gradient-to-br from-[#2a2a2a] to-black border border-gray-700/50 rounded-2xl md:rounded-[2rem] shadow-2xl flex items-center justify-center -rotate-6 group-hover:-rotate-3 transition-transform duration-500 z-10 before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/5 before:to-transparent before:rounded-2xl md:before:rounded-[2rem]">
                            <div className="text-white text-[10px] sm:text-xs font-bold font-sans tracking-widest absolute left-8 top-1/2 -translate-y-1/2 opacity-60">NEO</div>
                            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-4 p-2 bg-[#111] rounded-3xl border border-white/5 shadow-inner">
                               <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-600 bg-black flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]"><div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-blue-900/40"></div></div>
                               <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-600 bg-black flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]"><div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-blue-900/40"></div></div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-14">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                           <h3 className="text-gray-900 hover:text-[#ff6700] transition-colors cursor-pointer text-2xl md:text-[32px] font-bold leading-none tracking-tight">{products[0].name}</h3>
                           <span className="text-xs text-gray-700 border border-gray-300 rounded-full px-3 py-1 bg-white font-medium">Bestseller</span>
                        </div>
                        <p className="text-gray-500 text-sm md:text-[15px] mb-4 md:mb-6 leading-relaxed">{products[0].desc}</p>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between mt-auto gap-2 sm:gap-3">
                           <div>
                             <div className="flex items-baseline gap-2 mb-2">
                               <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{products[0].price}</span>
                             </div>
                           </div>
                           <div className="flex gap-2 w-full sm:w-auto">
                              <button onClick={(e) => handleAddToCart(products[0], e)} className="flex-1 sm:flex-none bg-black text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg md:rounded-[14px] font-bold text-sm md:text-[15px] hover:bg-black/90 shadow-lg shadow-gray-500/20 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                                <ShoppingCart size={16} strokeWidth={2} />
                                <span className="hidden sm:inline">Keranjang</span>
                              </button>
                              <button onClick={(e) => handleBuyNow(products[0], e)} className="flex-1 sm:flex-none bg-gray-900 text-white px-3 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-[14px] font-bold text-sm md:text-[15px] hover:bg-black transition-all duration-300 whitespace-nowrap">
                                Beli sekarang
                              </button>
                           </div>
                        </div>
                    </div>
                 </div>
               )}

                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-2">
                   {products.filter(p => !p.featured).slice(0, 4).map(renderProductCard)}
                </div>
              </>
           )}
        </div>
      </div>

      {/* QUICK VIEW / DETAIL PRODUK MODAL */}
      {selectedProduct && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProduct(null)}>
          
          <div 
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 max-h-[90vh] md:max-h-[600px] cursor-default relative"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal tertutup ke background
          >
            {/* Tombol Tutup (X) */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm"
            >
              ✕
            </button>

            {/* Bagian Kiri: Gambar Produk Raksasa */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
               <div className="w-48 h-48 md:w-80 md:h-80 flex items-center justify-center text-[100px] md:text-[150px] drop-shadow-xl hover:scale-105 transition-transform duration-500">
                 {selectedProduct.img && (selectedProduct.img.startsWith('http') || selectedProduct.img.startsWith('/')) ? (
                    <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-contain" />
                 ) : (
                    selectedProduct.img
                 )}
               </div>
            </div>

            {/* Bagian Kanan: Detail & Aksi */}
            <div className="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-12 overflow-y-auto">
               <div className="mb-6 border-b border-gray-100 pb-6">
                 <span className="text-xs font-bold bg-[#ff6700]/10 text-[#ff6700] px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Bintang Tamu</span>
                 <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                   {selectedProduct.name}
                 </h2>
                 <p className="text-3xl font-bold text-gray-900 tracking-tighter text-[#ff6700]">
                   {selectedProduct.price}
                 </p>
               </div>
               
               <div className="flex-1">
                 <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Spesifikasi & Deskripsi Detail</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">
                   {selectedProduct.desc}
                 </p>
                 
                 {/* Garansi Fiktif Penambah Estetika */}
                 <div className="mt-6 flex gap-4 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-1.5"><span className="text-green-500">✔</span> Garansi Resmi 1 Tahun</div>
                    <div className="flex items-center gap-1.5"><span className="text-green-500">✔</span> Bebas Ongkir</div>
                 </div>
               </div>

               <div className="mt-8 flex gap-3">
                 <button 
                   onClick={(e) => { handleAddToCart(selectedProduct, e); setSelectedProduct(null); }} 
                   className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                 >
                   <ShoppingCart size={18} strokeWidth={2.5} /> + Keranjang
                 </button>
                 <button 
                   onClick={(e) => { handleBuyNow(selectedProduct, e); setSelectedProduct(null); }} 
                   className="flex-1 bg-gray-900 border-2 border-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors"
                 >
                   Beli Sekarang
                 </button>
               </div>
            </div>

          </div>

        </div>,
        document.body
      )}

    </section>
  );
}