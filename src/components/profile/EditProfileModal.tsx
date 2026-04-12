"use client";

import { useState, useEffect } from "react";
import { updateUserProfile } from "@/app/actions/user";
import Swal from "sweetalert2";
import { Camera, Mail, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function EditProfileModal({ user }: { user: { id: string, name: string, email: string, image: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user.image);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = user.image;

      // 1. Jika ada foto baru, upload dulu via API upload lokal
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/auth/upload", {
          method: "POST",
          body: formData,
        });
        
        const uploadData = await uploadRes.json();
        
        if (uploadRes.ok) {
          finalImageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || "Gagal mengunggah gambar profil.");
        }
      }

      // 2. Simpan Data
      const res = await updateUserProfile(user.id, {
        name,
        email,
        image: finalImageUrl
      });

      if (res.success) {
        Swal.fire({
          icon: "success",
           title: "Profil Diperbarui!",
           text: "Informasimu berhasil diamankan di brankas Neo.",
           confirmButtonColor: "#ff6700"
        });
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(res.error);
      }

    } catch (err: any) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan yang tidak diketahui.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-4 md:mt-2 text-sm font-semibold text-gray-700 bg-white/60 hover:bg-white backdrop-blur-md px-5 py-2 rounded-full border border-gray-200/50 shadow-sm transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-1.5 w-max"
      >
        Edit Informasi &gt;
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="text-lg font-bold text-gray-900">Edit Informasi</h3>
               <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 font-bold transition-colors">
                  ✕
               </button>
             </div>

             <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
               {/* FOTO UPLOAD */}
               <div className="flex flex-col items-center justify-center relative w-max mx-auto group">
                   <div className="w-24 h-24 rounded-[30%] overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-sm relative group-hover:border-[#ff6700]/30 transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 bg-gray-50">
                          {(name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer pointer-events-none">
                         <Camera size={24} />
                      </div>
                      
                      <input 
                         type="file" 
                         accept="image/*"
                         onChange={handleImageChange}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                   </div>
               </div>

               {/* FORMS */}
               <div className="flex flex-col gap-4 mt-2">
                 <div>
                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">ID NEO</label>
                   <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono cursor-not-allowed flex items-center gap-2">
                     <Shield size={16} className="text-gray-400" /> {user.id}
                   </div>
                 </div>

                 <div>
                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Alamat Email</label>
                   <div className="w-full bg-gray-100 text-gray-500 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold cursor-not-allowed flex items-center gap-2">
                     <Mail size={16} className="text-gray-400" /> {user.email}
                   </div>
                 </div>

                 <div>
                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nama Panggilan</label>
                   <div className="relative">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                     <input 
                       type="text" 
                       required 
                       value={name} 
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-white text-gray-900 pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#ff6700] focus:ring-2 focus:ring-[#ff6700]/20 transition-all outline-none"
                     />
                   </div>
                 </div>
               </div>

               <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gray-900 border-2 border-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
               </div>
             </form>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
