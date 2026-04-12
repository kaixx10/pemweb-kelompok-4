import { Building2, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="w-full flex justify-center pb-20">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Building2 className="text-[#ff6700]" /> Pengaturan Toko
            </h1>
            <p className="text-sm text-gray-500 mt-1">Konfigurasi pengaturan fundamental untuk operasional Neo Store.</p>
            <p className="text-xs text-orange-600 bg-orange-50 font-semibold px-3 py-1.5 rounded-lg mt-2 inline-block">
              Catatan: Untuk pengaturan Data Diri/Ganti Foto, silakan buka menu "Pusat Pelanggan (Profile)" dari ikon navigasi di atas.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-8">
             <div className="max-w-2xl flex flex-col gap-6">
                
                {/* Informasi Dasar Toko */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Informasi Publik</h3>
                   
                   <div className="flex flex-col gap-4">
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nama Toko *</label>
                         <input type="text" defaultValue="Neo Store Indonesia" className="w-full bg-white text-gray-900 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#ff6700] outline-none" />
                      </div>
                      
                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Alamat Email Dukungan Resmi</label>
                         <input type="email" defaultValue="support@neostore.co.id" className="w-full bg-white text-gray-900 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#ff6700] outline-none" />
                      </div>

                      <div>
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Alamat Kantor Pusat</label>
                         <textarea rows={3} defaultValue="Gedung Cyber 2 Tower Lantai 12.&#13;&#10;Jalan H.R. Rasuna Said Blok X-5, Kuningan, Jakarta Selatan" className="w-full bg-white text-gray-900 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#ff6700] outline-none resize-none"></textarea>
                      </div>
                   </div>
                </div>

                {/* Preferensi Sistem */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Preferensi Sistem Operasional</h3>
                   
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-gray-900">Mode Pemeliharaan (Maintanence)</p>
                            <p className="text-xs text-gray-500">Tutup toko sementara waktu dari akses publik.</p>
                         </div>
                         <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-not-allowed">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-sm font-bold text-gray-900">Izinkan Pendaftaran Pengguna Baru</p>
                            <p className="text-xs text-gray-500">Buka registrasi via Google Auth form.</p>
                         </div>
                         <div className="w-12 h-6 bg-[#20d087] rounded-full relative cursor-not-allowed">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow"></div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Tombol Simpan (Dummy) */}
                <button className="bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors w-max px-8 flex items-center gap-2 cursor-not-allowed opacity-80">
                   <Save size={18} /> Simpan Pengaturan
                </button>

             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
