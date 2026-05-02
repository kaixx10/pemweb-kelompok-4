"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

// ============================================
// CUSTOMER: Buat atau ambil chat room yang aktif
// ============================================
export async function getOrCreateChatRoom() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Login diperlukan." };

  const userId = (session.user as any).id;

  // Cari chat room yang masih WAITING atau ACTIVE milik user ini
  let room = await prisma.chatRoom.findFirst({
    where: {
      customerId: userId,
      status: { in: ["WAITING", "ACTIVE"] },
    },
    include: {
      admin: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, image: true, role: true } } },
      },
    },
  });

  // Jika belum ada, buat baru
  if (!room) {
    room = await prisma.chatRoom.create({
      data: { customerId: userId },
      include: {
        admin: { select: { id: true, name: true, image: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, image: true, role: true } } },
        },
      },
    });
  }

  return { success: true, data: room };
}

// ============================================
// KIRIM PESAN (Customer atau Admin)
// ============================================
export async function sendChatMessage(chatRoomId: string, message?: string, fileUrl?: string, fileType?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Login diperlukan." };

  const userId = (session.user as any).id;

  if (!message?.trim() && !fileUrl) return { success: false, error: "Pesan kosong." };

  // Pastikan user punya akses ke room ini
  const room = await prisma.chatRoom.findUnique({
    where: { id: chatRoomId },
  });

  if (!room) return { success: false, error: "Chat room tidak ditemukan." };

  const isCustomer = room.customerId === userId;
  const userRole = (session.user as any).role;

  if (!isCustomer && userRole !== "ADMIN") {
    return { success: false, error: "Anda tidak memiliki akses." };
  }

  // Jika admin baru pertama kali membalas, assign admin ke room
  if (userRole === "ADMIN" && !room.adminId) {
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { adminId: userId, status: "ACTIVE" },
    });
  }

  const newMessage = await prisma.chatMessage.create({
    data: {
      chatRoomId,
      senderId: userId,
      message: message?.trim() || null,
      fileUrl: fileUrl || null,
      fileType: fileType || null,
    },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  // Update updatedAt di chat room
  await prisma.chatRoom.update({
    where: { id: chatRoomId },
    data: { updatedAt: new Date() }
  });

  return { success: true, data: newMessage };
}

// ============================================
// UPLOAD FILE KE LOKAL (BUKAN CLOUDINARY)
// ============================================
import fs from "fs/promises";
import path from "path";

export async function uploadChatFile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Login diperlukan." };

  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "File tidak ditemukan." };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Buat nama file unik
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "chat");
    
    // Pastikan direktori ada
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const isImage = file.type.startsWith("image/");
    const publicUrl = `/uploads/chat/${fileName}`;

    return { 
      success: true, 
      url: publicUrl,
      fileType: isImage ? "image" : "file" 
    };
  } catch (error) {
    console.error("Local Upload Error:", error);
    return { success: false, error: "Gagal menyimpan file secara lokal." };
  }
}

// ============================================
// POLLING: Ambil pesan terbaru dari room
// ============================================
export async function getChatMessages(chatRoomId: string, afterDate?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Login diperlukan." };

  const messages = await prisma.chatMessage.findMany({
    where: {
      chatRoomId,
      ...(afterDate ? { createdAt: { gt: new Date(afterDate) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  return { success: true, data: messages };
}

// ============================================
// ADMIN: Ambil semua chat rooms
// ============================================
export async function getAllChatRooms() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Akses ditolak." };
  }

  const rooms = await prisma.chatRoom.findMany({
    where: {
      messages: {
        some: {} // Hanya ambil room yang punya minimal 1 pesan
      }
    },
    orderBy: [
      { status: "asc" },    // WAITING muncul pertama
      { updatedAt: "desc" }, // Terbaru di atas
    ],
    include: {
      customer: { select: { id: true, name: true, email: true, image: true } },
      admin: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
      _count: { select: { messages: true } },
    },
  });

  // Hitung pesan belum dibaca per room untuk admin
  const roomsWithUnread = await Promise.all(
    rooms.map(async (room) => {
      const unreadCount = await prisma.chatMessage.count({
        where: {
          chatRoomId: room.id,
          isRead: false,
          senderId: { not: (session.user as any).id },
        },
      });
      return { ...room, unreadCount };
    })
  );

  return { success: true, data: roomsWithUnread };
}

// ============================================
// ADMIN: Claim/Take Over sebuah chat room
// ============================================
export async function claimChatRoom(chatRoomId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Akses ditolak." };
  }

  const adminId = (session.user as any).id;

  await prisma.chatRoom.update({
    where: { id: chatRoomId },
    data: { adminId, status: "ACTIVE" },
  });

  return { success: true };
}

// ============================================
// ADMIN/CUSTOMER: Tandai pesan sudah dibaca
// ============================================
export async function markMessagesAsRead(chatRoomId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false };

  const userId = (session.user as any).id;

  await prisma.chatMessage.updateMany({
    where: {
      chatRoomId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  return { success: true };
}

// ============================================
// RESOLVE: Selesaikan chat
// ============================================
export async function resolveChatRoom(chatRoomId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false };

  await prisma.chatRoom.update({
    where: { id: chatRoomId },
    data: { status: "RESOLVED" },
  });

  return { success: true };
}

// ============================================
// ADMIN: Hitung total chat menunggu (untuk badge)
// ============================================
export async function getWaitingChatCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { success: false, count: 0 };
  }

  const count = await prisma.chatRoom.count({
    where: { 
      status: "WAITING",
      messages: { some: {} }
    },
  });

  return { success: true, count };
}
