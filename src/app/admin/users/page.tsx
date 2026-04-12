import { prisma } from "@/lib/prisma";
import UserRoleButton from "@/components/admin/UserRoleButton";
import AdminUserActions from "@/components/admin/AdminUserActions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Users, Mail, Shield, User } from "lucide-react";
import Image from "next/image";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).id) {
     return <div className="p-10 font-bold text-red-500 text-center text-xl">Harap Login Kembali.</div>;
  }

  const currentUser = session.user as any;

  // Ambil semua pengguna
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full flex justify-center pb-20">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <Users className="text-[#00bcd4]" /> Manajemen Pengguna
            </h1>
            <p className="text-sm text-gray-500 mt-1">Lihat dan atur hak akses pelanggan Neo Store.</p>
          </div>
          <div className="text-sm font-bold text-gray-400 border border-gray-200 bg-white px-4 py-2 rounded-lg">
            Total {users.length} Akun
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {users.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 flex flex-col items-center">
                <Users size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">Belum ada Pelanggan</h3>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-5 font-semibold">Profil</th>
                    <th className="p-5 font-semibold">Info Kontak</th>
                    <th className="p-5 font-semibold">Jabatan</th>
                    <th className="p-5 font-semibold">Tanggal Daftar</th>
                    <th className="p-5 font-semibold text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className={`hover:bg-[#00bcd4]/5 transition-colors ${u.id === currentUser.id ? 'bg-blue-50/30' : ''}`}>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center bg-gray-100 text-xl font-bold text-gray-400">
                            {u.image ? (
                              <img src={u.image} alt={u.name || "User"} className="w-full h-full object-cover" />
                            ) : (
                              (u.name || "U").charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              {u.name || "Bapak/Ibu tanpa nama"} 
                              {u.id === currentUser.id && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Anda</span>}
                            </div>
                            <div className="text-[10px] font-mono text-gray-400 mt-0.5">ID: {u.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {u.email}
                        </div>
                      </td>
                      <td className="p-5">
                        {u.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200">
                            <Shield size={14} /> ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                            <User size={14} /> USER
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-gray-500 text-xs">
                        {u.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex flex-col xl:flex-row items-center justify-center gap-2">
                          <UserRoleButton userId={u.id} currentRole={u.role} currentUserId={currentUser.id} />
                          <AdminUserActions user={{ id: u.id, name: u.name, email: u.email, image: u.image, role: u.role }} currentUserId={currentUser.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
