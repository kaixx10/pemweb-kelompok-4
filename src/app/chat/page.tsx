"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCheck, Clock, MessageCircle, Headphones } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  getOrCreateChatRoom,
  sendChatMessage,
  getChatMessages,
  markMessagesAsRead,
  resolveChatRoom,
  uploadChatFile,
} from "@/app/actions/chat";
import { Paperclip, Image as ImageIcon, FileText, Download } from "lucide-react";
import Swal from "sweetalert2";

export default function LiveChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect jika belum login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Inisialisasi chat room
  useEffect(() => {
    if (!session) return;

    async function init() {
      setLoading(true);
      const res = await getOrCreateChatRoom();
      if (res.success && res.data) {
        setRoom(res.data);
        setMessages(res.data.messages || []);
        await markMessagesAsRead(res.data.id);
      }
      setLoading(false);
    }
    init();
  }, [session]);

  // Polling pesan baru setiap 3 detik
  useEffect(() => {
    if (!room?.id) return;

    const poll = async () => {
      const lastMsg = messages[messages.length - 1];
      const afterDate = lastMsg?.createdAt;
      const res = await getChatMessages(room.id, afterDate);
      if (res.success && res.data && res.data.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m: any) => m.id));
          const newMsgs = res.data!.filter((m: any) => !existingIds.has(m.id));
          return [...prev, ...newMsgs];
        });
        await markMessagesAsRead(room.id);
      }
    };

    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [room?.id, messages]);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEndChat = async () => {
    const result = await Swal.fire({
      title: "Akhiri Percakapan?",
      text: "Chat ini akan ditutup dan Anda bisa memulai chat baru nanti.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff6700",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Ya, Akhiri",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await resolveChatRoom(room.id);
      setRoom(null);
      setMessages([]);
      // Buat room baru
      const res = await getOrCreateChatRoom();
      if (res.success && res.data) {
        setRoom(res.data);
        setMessages(res.data.messages || []);
      }
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !room?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("File Terlalu Besar", "Maksimal ukuran file adalah 5MB", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res: any = await uploadChatFile(formData);
    if (res.success) {
      await sendChatMessage(room.id, undefined, res.url, res.fileType);
      // Trigger polling manual or add optimistically
    } else {
      Swal.fire("Gagal", res.error, "error");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !room?.id || sending) return;

    const tempMessage = input.trim();
    setInput("");
    setSending(true);

    const res = await sendChatMessage(room.id, tempMessage);
    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data]);
    }
    setSending(false);
  };



  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ff6700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Menyiapkan ruang chat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans p-2 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl h-[calc(100vh-80px)] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/support"
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 overflow-hidden relative">
                <Headphones size={22} className="text-[#ff6700]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  {room?.admin ? `Customer Service (${room.admin.name})` : "Pusat Bantuan Xiaomi"}
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${room?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                    {room?.status === "WAITING" ? "Menunggu Antrian" : room?.status === "ACTIVE" ? "Online" : "Selesai"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {room?.status !== "RESOLVED" && messages.length > 0 && (
            <button
              onClick={handleEndChat}
              className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-tight transition-colors"
            >
              Akhiri Chat
            </button>
          )}
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4 md:p-8 space-y-6 custom-scrollbar">
          {/* Welcome Info */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white border border-gray-100 px-5 py-2.5 rounded-full shadow-sm">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                Sesi Chat Dimulai — Tim Kami Siap Membantu
              </p>
            </div>
          </div>

          {messages.map((msg: any, idx: number) => {
            const isMe = msg.senderId === user?.id;
            const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
                  {!isMe && (
                    <div className={`w-8 h-8 rounded-full bg-orange-50 flex-shrink-0 mt-1 overflow-hidden relative border border-orange-100 flex items-center justify-center ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                      <Headphones size={16} className="text-[#ff6700]" />
                    </div>
                  )}
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-3 text-sm leading-relaxed shadow-sm overflow-hidden ${
                        isMe
                          ? "bg-[#ff6700] text-white rounded-2xl rounded-tr-none font-medium"
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-200"
                      }`}
                    >
                      {msg.fileUrl ? (
                        msg.fileType === "image" ? (
                          <div className="rounded-lg overflow-hidden -mx-1 -my-1">
                            <img 
                              src={msg.fileUrl} 
                              alt="Attachment" 
                              className="max-w-full max-h-[300px] object-contain cursor-pointer hover:opacity-90 transition"
                              onClick={() => window.open(msg.fileUrl, "_blank")}
                            />
                          </div>
                        ) : (
                          <a 
                            href={msg.fileUrl} 
                            target="_blank" 
                            className="flex items-center gap-3 p-1 hover:underline"
                          >
                            <div className="bg-gray-100 p-2 rounded-lg"><FileText size={20} className="text-gray-600" /></div>
                            <div className="text-xs">
                              <p className="font-bold truncate max-w-[150px]">Lampiran File</p>
                              <p className="opacity-70 flex items-center gap-1"><Download size={10} /> Klik untuk unduh</p>
                            </div>
                          </a>
                        )
                      ) : null}
                      
                      {msg.message && (
                        <div className={msg.fileUrl ? "mt-2" : ""}>
                          {msg.message}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? "justify-end mr-1" : "ml-1"}`}>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {formatTime(msg.createdAt)}
                      </span>
                      {isMe && (
                        <CheckCheck
                          size={12}
                          className={msg.isRead ? "text-blue-500" : "text-gray-300"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 relative">
          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-[#ff6700]/20 border-t-[#ff6700] rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-[#ff6700] animate-pulse">Sedang mengunggah file...</p>
            </div>
          )}
          
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-1.5 focus-within:border-[#ff6700]/50 focus-within:ring-4 focus-within:ring-[#ff6700]/5 transition-all shadow-inner"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 text-gray-400 hover:text-[#ff6700] hover:bg-white rounded-xl flex items-center justify-center transition-all"
              title="Lampirkan File"
            >
              <Paperclip size={20} />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm text-gray-800 font-medium"
            />
            
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="w-11 h-11 bg-[#ff6700] hover:bg-[#e05a00] disabled:bg-gray-200 text-white rounded-[14px] flex items-center justify-center transition-all flex-shrink-0 shadow-lg shadow-orange-100"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="mt-3 text-center">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">
              Layanan CS Xiaomi Indonesia — Enkripsi 256-bit
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
