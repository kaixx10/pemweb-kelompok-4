"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { updateUserAddress } from "@/app/actions/user";
import { useRouter } from "next/navigation";

// Import peta secara dinamis (penting karena Leaflet butuh objek Window di browser)
const AddressMap = dynamic(() => import("@/components/profile/AddressMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse border border-gray-200">
      <p className="text-gray-400 font-medium">Memuat Peta GPS...</p>
    </div>
  ),
});

export default function AddressPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Ambil data user yang ada di session saat komponen dimuat
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      if (user.address) setAddress(user.address);
      if (user.latitude && user.longitude) {
        setCoordinates({ lat: user.latitude, lng: user.longitude });
      }
    }
  }, [session]);

  const handleSave = async () => {
    if (!address.trim()) {
      return Swal.fire("Alamat Kosong", "Silakan tulis alamat lengkap Anda", "warning");
    }
    if (!coordinates) {
      return Swal.fire("Titik Peta Kosong", "Silakan geser peta dan tentukan titik lokasi rumah Anda", "warning");
    }

    setIsSaving(true);
    try {
      const result = await updateUserAddress((session?.user as any).id, {
        address,
        lat: coordinates.lat,
        lng: coordinates.lng
      });

      if (result.success) {
        // Perbarui data sesi lokal agar segera sinkron
        await update({
          ...session,
          user: {
            ...session?.user,
            address: result.data.address,
            latitude: result.data.latitude,
            longitude: result.data.longitude
          }
        });

        Swal.fire({
          icon: "success",
          title: "Alamat Disimpan!",
          text: "Buku alamat Anda berhasil diperbarui dengan koordinat GPS.",
          confirmButtonColor: "#ff6700"
        }).then(() => {
          router.push("/profile");
        });
      } else {
        Swal.fire("Gagal", result.error, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan alamat ke server.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Daftar Alamat</h1>
            <p className="text-gray-500 text-sm mt-1">Atur lokasi pengiriman untuk pesanan Anda</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-8">
            
            {/* Bagian Peta */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-[#ff6700]" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Titik Koordinat GPS</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Klik atau geser peta untuk menaruh pin (jarum merah) tepat di lokasi rumah Anda.</p>
              
              <AddressMap 
                initialPosition={coordinates}
                onPositionChange={setCoordinates}
              />
              
              {coordinates && (
                <div className="mt-3 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-xs font-mono font-medium border border-green-100 flex justify-between items-center">
                  <span>Pin Terkunci:</span>
                  <span>{coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</span>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Bagian Detail Alamat */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Detail Alamat Lengkap</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                placeholder="Contoh: Jln. Merpati No. 12, RT 01/RW 02, Kel. Sudirman, Kec. Pusat Kota. (Patokan: Depan warung warna biru)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6700] outline-none text-sm transition-colors resize-none"
              />
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#ff6700] hover:bg-[#ff6700]/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm shadow-[#ff6700]/20"
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Save size={18} />
                    Simpan Alamat
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
