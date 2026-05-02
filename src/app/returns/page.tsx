"use client";

import React from 'react';
import { RefreshCcw, ShieldCheck, Clock, Truck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Hero Section */}
        <div className="bg-[#f7f7f7] rounded-[40px] p-10 md:p-16 mb-16 relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <div className="bg-[#fff0e5] text-[#ff6700] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Kebijakan Layanan
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Kebijakan <span className="text-[#ff6700]">Pengembalian</span>
            </h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed mb-8">
              Kami berkomitmen untuk memberikan pengalaman berbelanja yang tenang. Jika produk yang Anda terima bermasalah, kami siap membantu proses pengembalian Anda.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 p-10 hidden lg:block opacity-10">
            <RefreshCcw size={300} className="text-[#ff6700]" />
          </div>
        </div>

        {/* 3 Pillar Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ff6700] transition-colors">
              <Clock className="text-gray-900 group-hover:text-white transition-colors" size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">7 Hari Pengembalian</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Pengembalian dapat dilakukan maksimal 7 hari setelah barang diterima untuk alasan cacat produk.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ff6700] transition-colors">
              <ShieldCheck className="text-gray-900 group-hover:text-white transition-colors" size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Jaminan Keaslian</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Semua produk dijamin asli. Jika terbukti palsu, kami akan mengembalikan dana Anda 100%.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ff6700] transition-colors">
              <Truck className="text-gray-900 group-hover:text-white transition-colors" size={24} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900">Proses Cepat</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Setelah barang kami terima dan verifikasi, dana atau barang pengganti akan segera dikirim.
            </p>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-[#ff6700] rounded-full"></div>
              Syarat Pengembalian Barang
            </h2>
            <ul className="space-y-4 text-gray-600 font-light list-disc ml-6">
              <li>Produk yang dikembalikan harus dalam kondisi yang sama seperti saat diterima (lengkap dengan box, kartu garansi, dan aksesori).</li>
              <li>Produk belum pernah digunakan secara berlebihan (khusus untuk alasan berubah pikiran, segel harus masih utuh).</li>
              <li>Wajib melampirkan video unboxing saat paket pertama kali dibuka untuk klaim cacat fisik.</li>
              <li>Menunjukkan bukti pembelian (Invoice) yang sah dari sistem kami.</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-8 md:p-12 rounded-[32px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Langkah-langkah Pengajuan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-[#ff6700] text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Hubungi Admin</h4>
                  <p className="text-sm text-gray-500 font-light">Kirim pesan melalui Live Chat atau WhatsApp dengan menyertakan Nomor Pesanan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-[#ff6700] text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Kirim Barang</h4>
                  <p className="text-sm text-gray-500 font-light">Kemas barang dengan aman dan kirim ke alamat warehouse kami yang akan diinfokan admin.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-[#ff6700] text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Inspeksi Produk</h4>
                  <p className="text-sm text-gray-500 font-light">Tim kami akan melakukan pengecekan kualitas barang dalam 1-2 hari kerja.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-[#ff6700] text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Selesai</h4>
                  <p className="text-sm text-gray-500 font-light">Dana akan dikembalikan atau produk pengganti akan dikirimkan ke alamat Anda.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm font-light italic">Pembaruan terakhir: Mei 2026</p>
          <Link href="/support" className="text-[#ff6700] font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Butuh Bantuan Lain? <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
