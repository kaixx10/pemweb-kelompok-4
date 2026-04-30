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

// ==========================================
// PENGATURAN ALAMAT PENGGUNA (BUKU ALAMAT)
// ==========================================

export async function updateUserAddress(userId: string, data: { address: string; lat: number; lng: number }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).id !== userId) {
      throw new Error("Akses ditolak: Anda hanya dapat mengubah alamat Anda sendiri.");
    }

    if (!data.address || data.lat === undefined || data.lng === undefined) {
      throw new Error("Data alamat dan koordinat peta tidak lengkap.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        address: data.address,
        latitude: data.lat,
        longitude: data.lng
      }
    });

    revalidatePath("/profile");
    revalidatePath("/profile/address");
    revalidatePath("/checkout");

    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error("Gagal memperbarui alamat:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem saat menyimpan alamat." };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        latitude: true,
        longitude: true,
      }
    });

    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    return { success: true, data: user };
  } catch (error: any) {
    console.error("Gagal mengambil profil:", error);
    return { success: false, error: "Gagal mengambil data dari database." };
  }
}

export async function changePassword(oldPassword: string, newPassword: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      throw new Error("Sesi tidak valid, silakan login ulang.");
    }
    
    const userId = (session.user as any).id;

    // Ambil data user dari database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("Pengguna tidak ditemukan.");
    }

    // Pastikan user mendaftar menggunakan kredensial bukan Oauth (google dll)
    if (!user.password) {
      throw new Error("Akun Anda terhubung dengan provider eksternal (Google/lainnya) dan tidak memiliki kata sandi.");
    }

    // Verifikasi kata sandi lama
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Kata sandi lama yang Anda masukkan salah.");
    }

    // Hash kata sandi baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update ke database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true, message: "Kata sandi berhasil diubah." };
  } catch (error: any) {
    console.error("Gagal mengubah kata sandi:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}
