"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

export async function toggleUserRole(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    // Keamanan super ketat: Hanya ADMIN yang boleh mengangkat Admin baru
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      throw new Error("Akses ditolak: Anda tidak memiliki wewenang ini.");
    }

    // Hindari Super-Admin merubah rolenya sendiri secara tidak sengaja
    if ((session.user as any).id === userId) {
      throw new Error("Anda tidak bisa mencabut hak akses Anda sendiri!");
    }

    // Ambil data user yang akan diubah
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    // Jika dia ADMIN jadi USER, jika USER jadi ADMIN
    const newRole: UserRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    revalidatePath("/admin/users");

    return { 
      success: true, 
      data: updatedUser, 
      message: `Berhasil mengubah jabatan ${updatedUser.name} menjadi ${newRole}` 
    };
  } catch (error: any) {
    console.error("Gagal mengubah jabatan pengguna:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

export async function updateUserProfile(userId: string, data: { name?: string; email?: string; image?: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).id !== userId) {
      throw new Error("Akses ditolak: Anda hanya dapat mengedit profil Anda sendiri.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.image !== undefined && { image: data.image })
      }
    });

    // Revalidate halaman profil dan navbar agar foto baru muncul
    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error("Gagal memperbarui profil:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

import bcrypt from "bcryptjs";

// ==========================================
// PENGATURAN DATA PENGGUNA (UNTUK ADMIN)
// ==========================================

export async function adminUpdateUserProfile(userId: string, data: { name?: string; password?: string; image?: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      throw new Error("Akses ditolak: Anda tidak memiliki wewenang untuk aksi ini.");
    }

    // Jika password diisi, lakukan proses hashing
    let hashedPassword = undefined;
    if (data.password && data.password.trim() !== "") {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(hashedPassword !== undefined && { password: hashedPassword }),
        ...(data.image !== undefined && { image: data.image })
      }
    });

    revalidatePath("/admin/users");

    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error("Gagal memperbarui profil pengguna lain:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      throw new Error("Akses ditolak: Anda tidak memiliki wewenang untuk menghapus pengguna.");
    }

    if ((session.user as any).id === userId) {
      throw new Error("Tindakan dicegah: Anda tidak dapat menghapus akun Anda sendiri.");
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin"); 

    return { success: true, message: "Pengguna beserta seluruh histori pesanannya berhasil dihapus." };
  } catch (error: any) {
    console.error("Gagal menghapus pengguna:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem database." };
  }
}
