"use client";

import Image from "next/image";
import Script from "next/script";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { processCheckout } from "@/app/actions/order";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import StepIndicator from '@/components/checkout/StepIndicator';
import { syncOrderWithMidtrans } from "@/app/actions/syncOrder";

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const { items, getTotalPrice, removeSelectedItems } = useCartStore();
  const [loading, setLoading] = useState(false);

  // Saring hanya barang yang tercentang/terpilih
  const selectedItems = items.filter(item => item.selected !== false);

  // Form State yang presisi seperti Xiaomi
  const [address, setAddress] = useState(""); // Alamat di Xiaomi adalah nama jalan + detail
  const [firstName, setFirstName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const subtotal = getTotalPrice();
  const shippingCost = 0; // Karena di screenshot tulisannya Gratis/Tidak ada
  const finalTotal = subtotal + shippingCost;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    const fullAddress = `${firstName}, ${street}, ${address}, Distrik: ${district}, Kota: ${city}, Provinsi: ${province}, Telp: ${phone}, Email: ${email}`;
    
    setLoading(true);
    const res = await processCheckout(fullAddress, selectedItems, subtotal);
    setLoading(false);

    if (res.success && res.snapToken) {
      removeSelectedItems(); // Barang dicabut dari keranjang karena struk sudah terbit

      // Memunculkan Pop-up Kasir Midtrans
      if (typeof (window as any).snap !== "undefined") {
        (window as any).snap.pay(res.snapToken, {
          onSuccess: async function (result: any) {
            const sync = await syncOrderWithMidtrans(res.orderId, true);
            Swal.fire({
              icon: sync.status === "COMPLETED" ? "success" : "warning",
              title: sync.status === "COMPLETED" ? "Pembayaran Berhasil!" : "Pembayaran Tertunda",
              text: sync.status === "COMPLETED" 
                  ? "Terima kasih! Pesanan Anda telah lunas dan akan segera kami kemas." 
                  : "Pembayaran Anda tersangkut, silakan periksa menu Pesanan Anda nanti.",
              confirmButtonColor: sync.status === "COMPLETED" ? "#ff6700" : "#f59e0b",
            }).then(() => {
               router.refresh();
               router.push("/profile/orders");
            });
          },
          onPending: async function (result: any) {
            await syncOrderWithMidtrans(res.orderId);
            Swal.fire({
              icon: "info",
              title: "Menunggu Pembayaran",
              text: `Jangan lupa selesaikan pembayaran Anda ya!`,
              confirmButtonColor: "#ff6700",
            }).then(() => router.push("/profile/orders"));
          },
          onError: function (result: any) {
            Swal.fire("Gagal!", "Transaksi ditolak oleh sistem pembayaran.", "error").then(() => {
              router.push("/profile/orders");
            });
          },
          onClose: async function () {
            const sync = await syncOrderWithMidtrans(res.orderId);
            if (sync.success && sync.status === "COMPLETED") {
               Swal.fire({
                 icon: "success",
                 title: "Lunas!",
                 text: "Pembayaran terdeteksi sukses di latar belakang.",
                 confirmButtonColor: "#ff6700",
               }).then(() => router.push("/profile/orders"));
            } else {
               Swal.fire({
                 icon: "warning",
                 title: "Pembayaran Tertunda",
                 text: "Anda menutup layar kasir. Pesanan Anda tersimpan di menu Pesanan Saya.",
                 confirmButtonColor: "#ff6700",
               }).then(() => router.push("/profile/orders"));
            }
          }
        });
      } else {
        Swal.fire("Sistem Sibuk", "Mesin kasir sedang tidak tersedia, coba kembali nanti.", "error");
      }
    } else {
      Swal.fire("Gagal!", res.error || "Gagal memproses pesanan.", "error");
    }
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
         <div className="bg-white border-b border-gray-200">
           <StepIndicator currentStep={2} />
         </div>
         <div className="max-w-[1200px] mx-auto px-6 pt-12 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kasir Kosong</h2>
            <button onClick={() => router.push("/")} className="mt-4 bg-[#ff6700] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e05a00] transition-colors">
              Kembali Belanja
            </button>
         </div>
      </div>
    );
  }

  return (
    <>
      {/* Script Kasir Pintar Midtrans */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-white border-b border-gray-200">
        <StepIndicator currentStep={2} />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 pt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* KOLOM KIRI: ALAMAT & METODE TAMPILAN XIAOMI */}
          <div className="w-full lg:w-[65%] space-y-12">
            
            {/* Bagian Alamat Pengiriman */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Alamat pengiriman</h2>
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                
                {/* Nama */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Nama <span className="text-red-500">*</span></label>
                  <input
                    type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                  />
                </div>

                {/* Provinsi & Kota */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Provinsi <span className="text-red-500">*</span></label>
                    <input
                      type="text" required value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Provinsi pengiriman"
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Kota / Kabupaten <span className="text-red-500">*</span></label>
                    <input
                      type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Kota atau Kabupaten"
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Distrik & Kelurahan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Kecamatan <span className="text-red-500">*</span></label>
                    <input
                      type="text" required value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Nama Kecamatan"
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Kelurahan / Desa <span className="text-red-500">*</span></label>
                    <input
                      type="text" required value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Nama Desa atau Kelurahan"
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Alamat Detail */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Alamat <span className="text-red-500">*</span></label>
                  <input
                    type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nomor rumah dan nama Jalan"
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                  />
                </div>

                {/* Telepon */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Nomor telepon <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <div className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl px-4 flex items-center justify-center text-sm font-bold text-gray-600">+62</div>
                    <input
                      type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-r-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">Alamat Email <span className="text-red-500">*</span></label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#ff6700] focus:ring-1 focus:ring-[#ff6700] transition-all text-sm"
                  />
                </div>

                {/* Checkbox Default */}
                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="default-address" className="w-4 h-4 accent-[#ff6700] rounded cursor-pointer" />
                  <label htmlFor="default-address" className="text-sm text-gray-600 cursor-pointer">Tetapkan sebagai alamat default</label>
                </div>

                {/* Tombol Simpan Form */}
                <div className="pt-2">
                  <button type="button" className="bg-black text-white px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                    Simpan
                  </button>
                </div>
              </form>
            </div>

            <hr className="border-gray-200" />

            {/* Metode Pengiriman Placeholder Xiaomi Style */}
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Metode pengiriman</h2>
              <div className="bg-white border-2 border-[#ff6700] rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#ff6700] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">GRATIS</div>
                <h4 className="font-bold text-gray-900 text-sm">Pengiriman Standar</h4>
                <p className="text-sm text-gray-500 mt-1">Estimasi 2-5 hari kerja.</p>
              </div>
            </div>


            
          </div>

          {/* KOLOM KANAN: RINGKASAN PESANAN XIAOMI STYLE */}
          <div className="w-full lg:w-[35%] z-10 sticky top-24">
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan pesanan</h2>
              <h3 className="text-sm font-bold text-gray-900 mb-4">{selectedItems.length} item</h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto mb-6 pr-2">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 relative">
                       {item.img && (item.img.startsWith('/') || item.img.startsWith('http')) 
                         ? <Image src={item.img} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                         : item.img
                       }
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-sm text-gray-900 leading-tight group-hover:text-[#ff6700] transition-colors">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Jumlah: {item.quantity}</p>
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-gray-900 font-medium">{formatIDR(Number(item.price))}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rincian Harga */}
              <div className="border-t border-gray-100 pt-5 space-y-4 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-900 font-bold text-lg">Total</span>
                  <span className="text-xl font-bold text-[#ff6700]">{formatIDR(finalTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">Biaya pengiriman <span className="w-3 h-3 border border-gray-400 text-[8px] rounded-full flex items-center justify-center text-gray-500 cursor-help">i</span></span>
                  <span className="text-gray-900">Tidak ada pengiriman dipilih</span>
                </div>
              </div>

              {/* Kupon */}
              <div className="border-t border-b border-gray-100 py-5 mb-5 relative">
                <span className="text-sm font-bold text-gray-900">Kupon</span>
                <span className="absolute right-0 top-5 text-sm font-medium text-[#ff6700] cursor-pointer hover:underline">Gunakan kupon</span>
                <p className="text-xs text-[#ff6700] font-medium mt-1">0 kupon tersedia</p>
                <p className="text-xs text-gray-500 mt-0.5">Tidak ada kupon yang digunakan</p>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  loading 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {loading ? "Memproses..." : "Bayar sekarang"}
              </button>

              <div className="mt-4 text-[10px] text-gray-400 leading-tight">
                <div className="flex items-start gap-2">
                   <input type="checkbox" className="mt-0.5" defaultChecked />
                   <p>Dengan melakukan pemesanan, berarti Anda telah membaca dan menyetujui <a href="#" className="text-[#ff6700] hover:underline">Ketentuan Penggunaan</a> dan <a href="#" className="text-[#ff6700] hover:underline">Kebijakan Privasi</a> MI.com.</p>
                </div>
                <p className="ml-5 mt-1">Saya telah membaca dan menyetujui <a href="#" className="text-[#ff6700] hover:underline">Kebijakan Pengembalian.</a></p>
              </div>
            </div>

            {/* Manfaat Belanja */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-5 flex justify-between items-center">
                Manfaat belanja di mi.com <span className="text-gray-400 text-lg rotate-180">^</span>
              </h3>
              
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <Truck className="text-gray-600 mt-0.5 w-6 h-6 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Metode pengiriman</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Estimasi pengiriman area Jawa 2-5 hari kerja, area Sumatera 4-9 hari kerja.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <ShieldCheck className="text-gray-600 mt-0.5 w-6 h-6 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Layanan purnajual</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Penggantian 15 hari untuk masalah manufaktur.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
    </>
  );
}
