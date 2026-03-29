'use client';

import { useCartStore } from '@/store/useCartStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PaymentPage() {
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card' | 'ewallet'>('ewallet');
  const { items, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-12">
          <div className="h-96 flex items-center justify-center">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  const totalPrice = getTotalPrice();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethods = [
    {
      id: 'transfer',
      name: 'Transfer Bank',
      icon: '🏦',
      desc: 'Transfer langsung ke rekening bank kami',
    },
    {
      id: 'card',
      name: 'Kartu Kredit/Debit',
      icon: '💳',
      desc: 'Visa, Mastercard, atau kartu lokal',
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: '📱',
      desc: 'GCash, Dana, OVO, atau GoPay',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex-1 w-full bg-gray-50 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/cart">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Kembali</span>
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Alamat Pengiriman</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <textarea
                      placeholder="Masukkan alamat lengkap"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
                      <input
                        type="text"
                        placeholder="Jakarta"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pos</label>
                      <input
                        type="text"
                        placeholder="12345"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Metode Pembayaran</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                        className="w-5 h-5"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 sticky top-6">
                <h2 className="font-bold text-lg text-gray-900 mb-6">Ringkasan Pesanan</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(
                          parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pengiriman</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Pajak</span>
                    <span className="font-semibold text-gray-900">{formatPrice(totalPrice * 0.1)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-black">
                    {formatPrice(totalPrice * 1.1)}
                  </span>
                </div>

                <button className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-black/90 transition-colors">
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
