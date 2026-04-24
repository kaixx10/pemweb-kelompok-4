'use client';

import Image from 'next/image';

import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/checkout/StepIndicator';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, removeFromCart, updateCartQuantity, getTotalPrice, getTotalItems, toggleItemSelect, toggleAllSelect, getSelectedItemsCount } = useCartStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-12">
        <div className="h-96 flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const checkedItemsCount = getSelectedItemsCount();
  const isAllSelected = items.length > 0 && items.every(item => item.selected !== false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-white border-b border-gray-200">
        <StepIndicator currentStep={1} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kasir Kosong</h2>
            <p className="text-gray-500 mb-8">Belum ada produk di keranjang Anda. Mari mulai berbelanja!</p>
            <Link href="/">
              <button className="bg-[#ff6700] text-white px-10 py-3.5 rounded-lg font-bold hover:bg-[#e05a00] transition-colors shadow-lg shadow-orange-200">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Kiri: Daftar Barang */}
            <div className="w-full lg:w-[65%]">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Header Checkbox */}
                <div className="p-5 border-b border-gray-100 flex items-center gap-4 text-sm font-bold text-gray-700 bg-white">
                  <div 
                    onClick={() => toggleAllSelect(!isAllSelected)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      isAllSelected ? 'border-[#ff6700] bg-[#ff6700]' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isAllSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span>Semua</span>
                </div>

                {items.map((item) => {
                  const isSelected = item.selected !== false;
                  return (
                    <div key={item.id} className={`flex items-center gap-6 p-6 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors ${!isSelected ? 'opacity-50' : ''}`}>
                      {/* Checkbox item */}
                      <div 
                        onClick={() => toggleItemSelect(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                          isSelected ? 'border-[#ff6700] bg-[#ff6700]' : 'border-gray-300 bg-white'
                        }`}
                      >
                         {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>

                    {/* Gambar */}
                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center relative">
                      {item.img && (item.img.startsWith('http') || item.img.startsWith('/')) ? (
                        <Image src={item.img} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                      ) : (
                        <span className="text-3xl">{item.img}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                      <p className="font-bold text-gray-900 mt-2">{formatPrice(Number(item.price))}</p>
                    </div>

                    {/* Kuantitas & Hapus (Kolom Kanan) */}
                    <div className="flex flex-col items-end gap-6 justify-between h-full">
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button
                          onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                          disabled={item.quantity === 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm font-bold text-gray-900 bg-gray-50/50 border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Hapus */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Kanan: Ringkasan Total & Benefit */}
            <div className="w-full lg:w-[35%]">
              {/* Box Total */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg text-gray-900 font-bold">Total</span>
                  <span className="text-xl text-[#ff6700] font-bold">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">Biaya pengiriman <span className="w-3 h-3 border border-gray-400 text-[8px] rounded-full flex items-center justify-center text-gray-500 cursor-help">i</span></span>
                    <span className="text-gray-900 font-medium">Gratis</span>
                  </div>
                </div>

                {/* Kupon */}
                <div className="border-t border-b border-gray-100 py-4 mb-6">
                  <div className="flex justify-between items-center bg-orange-50/50 p-3 rounded-lg border border-orange-100 cursor-pointer">
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-2">🎟️ Kupon</span>
                    <span className="text-[11px] font-bold text-[#ff6700]">Tersedia &gt;</span>
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  disabled={checkedItemsCount === 0}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg ${
                    checkedItemsCount === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-[#ff6700] text-white hover:bg-[#e05a00] shadow-orange-200'
                  }`}
                >
                  Checkout ({checkedItemsCount})
                </button>
              </div>

              {/* Box Manfaat Belanja */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-5 flex justify-between items-center">
                  Manfaat belanja di mi.com <span className="text-gray-400 text-lg rotate-180">^</span>
                </h3>
                
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <Truck className="text-gray-600 mt-0.5" size={24} strokeWidth={1.5} />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Metode pengiriman</h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Estimasi pengiriman area Jawa 2-5 hari kerja, area Sumatera 4-9 hari kerja.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <ShieldCheck className="text-gray-600 mt-0.5" size={24} strokeWidth={1.5} />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Layanan purnajual</h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Penggantian 15 hari untuk masalah manufaktur.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <CreditCard className="text-gray-600 mt-0.5" size={24} strokeWidth={1.5} />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Metode pembayaran</h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Check out mudah dan aman. Cepat dan praktis dengan e-wallet dan Bank Transfer.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed text-center">
                  Perlu bantuan lebih lanjut? Chat kami sekarang atau hubungi <a href="#" className="text-[#ff6700] hover:underline underline-offset-2">00180300650029</a>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
