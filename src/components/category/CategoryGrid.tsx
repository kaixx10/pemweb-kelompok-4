"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { createPortal } from "react-dom";
import { ShoppingCart } from "lucide-react";
import ProductReviews from "@/components/home/ProductReviews";

interface CategoryGridProps {
  initialProducts: any[];
}

export default function CategoryGrid({ initialProducts }: CategoryGridProps) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);
  
  const { addToCart } = useCartStore();
  const { data: session } = useSession();
  const { openModal } = useAuthModalStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      price: formatIDR(p.basePrice), 
      basePrice: p.basePrice, 
      rawPrice: Number(p.basePrice), 
      img: emoji,
      desc: p.description,
      variants: p.variants || []
    };
  });

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  };

  const handleModalAddToCart = () => {
    if (!session) {
      openModal();
      return;
    }
    
    addToCart({
      id: selectedVariant ? `${selectedProduct.id}-${selectedVariant.id || selectedVariant.color}` : selectedProduct.id,
      name: selectedVariant ? `${selectedProduct.name} (${selectedVariant.color} - ${selectedVariant.storage})` : selectedProduct.name,
      price: selectedVariant ? Number(selectedVariant.price) : selectedProduct.basePrice,
      img: selectedProduct.img,
      desc: selectedProduct.desc,
    });
    
    setAddedNotification(selectedProduct.id);
    setTimeout(() => setAddedNotification(null), 2000);
    setSelectedProduct(null);
  };

  const handleModalBuyNow = () => {
    if (!session) {
      openModal();
      return;
    }
    
    addToCart({
      id: selectedVariant ? `${selectedProduct.id}-${selectedVariant.id || selectedVariant.color}` : selectedProduct.id,
      name: selectedVariant ? `${selectedProduct.name} (${selectedVariant.color} - ${selectedVariant.storage})` : selectedProduct.name,
      price: selectedVariant ? Number(selectedVariant.price) : selectedProduct.basePrice,
      img: selectedProduct.img,
      desc: selectedProduct.desc,
    });
    
    router.push("/checkout");
  };

  if (!products.length) {
    return (
      <div className="w-full py-20 text-center text-gray-500">
        Belum ada produk di kategori ini.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white flex flex-col items-center pt-16 pb-8 px-4 md:px-8 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
              {product.name}
            </h2>
            <p className="text-gray-600 font-medium mb-8">
              Mulai dari {product.price}
            </p>
            
            <div className="flex gap-3 mb-10 z-10 relative">
              <button 
                onClick={() => openProductModal(product)}
                className="bg-[#191919] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-black transition-colors"
              >
                Beli sekarang
              </button>
              <button 
                onClick={() => openProductModal(product)}
                className="bg-transparent border border-gray-400 text-gray-800 px-6 py-2.5 rounded-full font-bold text-sm hover:border-gray-800 transition-colors"
              >
                Learn More
              </button>
            </div>

            <div className="w-full max-w-[300px] aspect-square flex items-center justify-center relative mt-auto group">
              {product.img && (product.img.startsWith('http') || product.img.startsWith('/')) ? (
                <Image 
                  src={product.img} 
                  alt={product.name} 
                  fill 
                  sizes="(max-width: 768px) 300px, 400px" 
                  className="object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <span className="text-[120px]">{product.img}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* QUICK VIEW MODAL */}
      {selectedProduct && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProduct(null)}>
          <div 
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 max-h-[90vh] md:max-h-[600px] cursor-default relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors shadow-sm"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100 relative">
               <div className="w-48 h-48 md:w-80 md:h-80 flex items-center justify-center text-[100px] md:text-[150px] drop-shadow-xl hover:scale-105 transition-transform duration-500 relative">
                 {selectedProduct.img && (selectedProduct.img.startsWith('http') || selectedProduct.img.startsWith('/')) ? (
                    <Image src={selectedProduct.img} alt={selectedProduct.name} fill sizes="(max-width: 768px) 192px, 320px" className="object-contain" />
                 ) : (
                    selectedProduct.img
                 )}
               </div>
            </div>

            <div className="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-12 overflow-y-auto">
               <div className="mb-6 border-b border-gray-100 pb-6">
                 <span className="text-xs font-bold bg-[#ff6700]/10 text-[#ff6700] px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Detail Produk</span>
                 <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                   {selectedProduct.name}
                 </h2>
                 <p className="text-3xl font-bold text-[#ff6700] tracking-tighter">
                   {selectedVariant ? formatIDR(selectedVariant.price) : selectedProduct.price}
                 </p>
               </div>
               
               <div className="flex-1">
                 {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                   <div className="mb-6">
                     <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pilih Varian</h3>
                     <div className="flex flex-wrap gap-2">
                       {selectedProduct.variants.map((v: any, i: number) => (
                         <button
                           key={i}
                           onClick={() => setSelectedVariant(v)}
                           className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                             selectedVariant?.id === v.id || selectedVariant?.color === v.color 
                               ? 'border-[#ff6700] text-[#ff6700] bg-orange-50' 
                               : 'border-gray-200 text-gray-600 hover:border-gray-300'
                           }`}
                         >
                           {v.color} {v.storage ? `- ${v.storage}` : ''}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Spesifikasi & Deskripsi</h3>
                 <p className="text-gray-600 leading-relaxed text-sm">
                   {selectedProduct.desc}
                 </p>
                 
                 <div className="mt-6 flex gap-4 text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-1.5"><span className="text-green-500">✔</span> Garansi Resmi 1 Tahun</div>
                    <div className="flex items-center gap-1.5"><span className="text-green-500">✔</span> Bebas Ongkir</div>
                 </div>
                 
                 <ProductReviews productId={selectedProduct.id} />
               </div>

               <div className="mt-8 flex gap-3 sticky bottom-0 bg-white pt-4 pb-2 z-10">
                 <button 
                   onClick={handleModalAddToCart}
                   className="flex-1 bg-white border-2 border-gray-900 text-gray-900 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                 >
                   <ShoppingCart size={18} strokeWidth={2.5} /> + Keranjang
                 </button>
                 <button 
                   onClick={handleModalBuyNow}
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
    </div>
  );
}
