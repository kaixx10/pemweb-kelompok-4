'use client';

import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, removeFromCart, updateCartQuantity, emptyCart, getTotalPrice, getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          <div className="h-96 flex items-center justify-center">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 w-full bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#ff6700] transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Kembali</span>
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          </div>

          {items.length === 0 ? (
            // Empty Cart
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
              <p className="text-gray-500 mb-8">Belum ada produk di keranjang Anda. Mari mulai berbelanja!</p>
              <Link href="/">
                <button className="bg-[#ff6700] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#ff6700]/90 transition-colors">
                  Lanjutkan Belanja
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-6 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                        {item.img}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                        <p className="font-bold text-[#ff6700] text-lg">{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-4">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Hapus dari keranjang"
                        >
                          <Trash2 size={20} />
                        </button>

                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                            disabled={item.quantity === 1}
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
                  <h2 className="font-bold text-lg text-gray-900 mb-6">Ringkasan Pesanan</h2>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Item</span>
                      <span className="font-semibold text-gray-900">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Pengiriman</span>
                      <span className="font-semibold text-gray-900">Gratis</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-8">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-[#ff6700]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <button 
                    onClick={() => router.push('/payment')}
                    className="w-full bg-[#ff6700] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#ff6700]/90 transition-colors mb-3"
                  >
                    Checkout
                  </button>

                  <button
                    onClick={() => emptyCart()}
                    className="w-full border-2 border-red-200 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
