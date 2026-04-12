"use client";

import { useState } from "react";
import { deleteUser, adminUpdateUserProfile } from "@/app/actions/user";
import Swal from "sweetalert2";
import { Trash2, Edit3, Camera, User, Mail, ShieldAlert } from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function AdminUserActions({ user, currentUserId }: { user: { id: string, name: string | null, email: string | null, image: string | null, role: string }, currentUserId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user.image);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = user.image || undefined;

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
          throw new Error(uploadData.error || "Gagal mengunggah foto.");
        }
      }

      const res = await adminUpdateUserProfile(user.id, {
        name,
        password: password.trim() !== "" ? password : undefined,
        image: finalImageUrl
      });

      if (res.success) {
        Swal.fire("Berhasil", "Profil pengguna berhasil diperbarui.", "success");
        setIsEditOpen(false);
        router.refresh();
      } else {
        throw new Error(res.error);
      }

    } catch (err: any) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (user.id === currentUserId) {
      Swal.fire("Peringatan", "Anda tidak dapat menghapus akun Anda sendiri.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Hapus Pengguna",
      html: `Apakah Anda yakin ingin menghapus pengguna <b>${user.name || user.email}</b>?<br><br>
             <span class="text-red-600 font-bold">Peringatan:</span><br>
             Seluruh riwayat transaksi milik pengguna ini akan ikut terhapus dari sistem.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (confirm.isConfirmed) {
      Swal.fire({
        title: 'Menghapus...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const res = await deleteUser(user.id);
      
      if (res.success) {
        Swal.fire("Terhapus", res.message, "success");
        router.refresh();
      } else {
        Swal.fire("Gagal", res.error, "error");
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-2 md:mt-0 justify-center">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
          title="Edit Data Pengguna"
        >
          <Edit3 size={16} />
        </button>
        <button 
          onClick={handleDelete}
          disabled={user.id === currentUserId}
          className={`p-1.5 rounded-lg transition-colors border border-transparent ${user.id === currentUserId ? 'text-gray-300' : 'text-red-600 hover:bg-red-50 hover:border-red-200'}`}
          title={user.id === currentUserId ? "Akun Anda Sendiri" : "Hapus Pengguna"}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isEditOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 Edit Data Pengguna
               </h3>
               <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-red-500 font-bold transition-colors">
                  ✕
               </button>
             </div>

             <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-5 text-left">
               <div className="flex flex-col items-center justify-center relative w-max mx-auto group">
                   <div className="w-24 h-24 rounded-[30%] overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-sm relative group-hover:border-red-500/30 transition-colors">
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

               <div className="flex flex-col gap-4 mt-2">
                 <div>
                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">ID Target</label>
                   <div className="w-full bg-gray-100 text-gray-400 px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono cursor-not-allowed flex items-center gap-2">
                     {user.id}
                   </div>
                 </div>

                 <div>
                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Nama Pengguna</label>
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

                 <div>
                   <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Ubah Password (Kosongkan bila tidak diubah)</label>
                   <div className="relative">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></div>
                     <input 
                       type="password" 
                       value={password} 
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Masukkan password baru"
                       className="w-full bg-white text-gray-900 pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold focus:border-[#ff6700] focus:ring-2 focus:ring-[#ff6700]/20 transition-all outline-none"
                     />
                   </div>
                 </div>
               </div>

               <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gray-900 border-2 border-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
