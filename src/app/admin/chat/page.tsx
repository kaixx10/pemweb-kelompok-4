"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Send,
  CheckCheck,
  MessageCircle,
  Clock,
  CircleCheck,
  Headphones,
  Users,
  Search,
  Zap,
  Paperclip,
  FileText,
  Download,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import {
  getAllChatRooms,
  getChatMessages,
  sendChatMessage,
  claimChatRoom,
  markMessagesAsRead,
  resolveChatRoom,
  uploadChatFile,
} from "@/app/actions/chat";
import Swal from "sweetalert2";

export default function AdminChatPage() {
  const { data: session } = useSession();
  const admin = session?.user as any;

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRoomsRef = useRef<NodeJS.Timeout | null>(null);
  const pollMsgsRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch semua chat rooms
  const fetchRooms = async () => {
    const res = await getAllChatRooms();
    if (res.success && res.data) {
      setRooms(res.data);
    }
    setLoadingRooms(false);
  };

  useEffect(() => {
    fetchRooms();
    // Polling rooms setiap 5 detik
    pollRoomsRef.current = setInterval(fetchRooms, 5000);
    return () => {
      if (pollRoomsRef.current) clearInterval(pollRoomsRef.current);
    };
  }, []);

  // Polling pesan untuk room yang dipilih
  useEffect(() => {
    if (!selectedRoom?.id) return;

    const poll = async () => {
      const lastMsg = messages[messages.length - 1];
      const res = await getChatMessages(selectedRoom.id, lastMsg?.createdAt);
      if (res.success && res.data && res.data.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m: any) => m.id));
          const newMsgs = res.data!.filter((m: any) => !existingIds.has(m.id));
          return [...prev, ...newMsgs];
        });
        await markMessagesAsRead(selectedRoom.id);
      }
    };

    pollMsgsRef.current = setInterval(poll, 3000);
    return () => {
      if (pollMsgsRef.current) clearInterval(pollMsgsRef.current);
    };
  }, [selectedRoom?.id, messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pilih room & load pesan
  const selectRoom = async (room: any) => {
    setSelectedRoom(room);
    const res = await getChatMessages(room.id);
    if (res.success && res.data) {
      setMessages(res.data);
    }
    await markMessagesAsRead(room.id);
    fetchRooms();
  };

  // Claim room
  const handleClaim = async (roomId: string) => {
    await claimChatRoom(roomId);
    await fetchRooms();
    if (selectedRoom?.id === roomId) {
      setSelectedRoom({ ...selectedRoom, status: "ACTIVE", adminId: admin?.id });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRoom?.id) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res: any = await uploadChatFile(formData);
    if (res.success) {
      await sendChatMessage(selectedRoom.id, undefined, res.url, res.fileType);
      const msgRes = await getChatMessages(selectedRoom.id);
      if (msgRes.success) setMessages(msgRes.data || []);
    } else {
      Swal.fire("Gagal", res.error, "error");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedRoom?.id || sending) return;

    const tempText = input.trim();
    setInput("");
    setSending(true);

    const res = await sendChatMessage(selectedRoom.id, tempText);
    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data]);
    }
    setSending(false);
    fetchRooms();
  };

  const handleResolve = async () => {
    if (!selectedRoom) return;
    const result = await Swal.fire({
      title: "Selesaikan Chat?",
      text: "Chat ini akan ditandai selesai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff6700",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Ya, Selesaikan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await resolveChatRoom(selectedRoom.id);
      setSelectedRoom(null);
      setMessages([]);
      fetchRooms();
    }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusBadge = (status: string) => {
    switch (status) {
      case "WAITING":
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1"><Clock size={10} /> Menunggu</span>;
      case "ACTIVE":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full flex items-center gap-1"><Zap size={10} /> Aktif</span>;
      case "RESOLVED":
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full flex items-center gap-1"><CircleCheck size={10} /> Selesai</span>;
    }
  };

  const filteredRooms = rooms.filter((r) =>
    (r.customer?.name || r.customer?.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-72px)] -m-6 lg:-m-8 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
      {uploading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
             <div className="w-5 h-5 border-2 border-[#ff6700]/20 border-t-[#ff6700] rounded-full animate-spin"></div>
             <p className="text-sm font-bold text-gray-700">Mengirim file...</p>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><MessageCircle size={20} className="text-[#ff6700]" /> Live Chat</h2>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{rooms.filter(r => r.status === 'WAITING').length} antrian</span>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari pelanggan..." className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-xl text-sm outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingRooms ? <div className="p-8 text-center text-gray-400 animate-pulse text-xs">Memuat...</div> : filteredRooms.map(room => (
            <div key={room.id} onClick={() => selectRoom(room)} className={`px-4 py-3.5 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 ${selectedRoom?.id === room.id ? 'bg-[#ff6700]/5 border-l-2 border-l-[#ff6700]' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {room.customer?.image ? <Image src={room.customer.image} alt="" fill className="object-cover" /> : <span className="text-sm font-bold text-gray-500">{(room.customer?.name || "?")[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{room.customer?.name || "Pelanggan"}</h4>
                    {statusBadge(room.status)}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{room.messages?.[0]?.message || "File dikirim"}</p>
                  <div className="flex justify-between mt-1 items-center">
                    <span className="text-[10px] text-gray-400">{formatDate(room.updatedAt)}</span>
                    {room.unreadCount > 0 && <span className="w-4 h-4 bg-[#ff6700] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{room.unreadCount}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!selectedRoom ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
             <Headphones size={48} className="opacity-20" />
             <p className="text-sm font-bold">Pilih chat untuk membalas</p>
          </div>
        ) : (
          <>
            <div className="bg-white px-6 py-3 border-b border-gray-200 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 relative overflow-hidden">
                  {selectedRoom.customer?.image ? <Image src={selectedRoom.customer.image} alt="" fill className="object-cover" /> : <span className="flex items-center justify-center h-full text-xs font-bold text-gray-500">{(selectedRoom.customer?.name || "?")[0]}</span>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{selectedRoom.customer?.name || "Pelanggan"}</h3>
                  <p className="text-[10px] text-gray-500">{selectedRoom.customer?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedRoom.status === 'WAITING' && <button onClick={() => handleClaim(selectedRoom.id)} className="bg-[#ff6700] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5"><Zap size={12} /> Ambil Chat</button>}
                {selectedRoom.status === 'ACTIVE' && <button onClick={handleResolve} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5"><CircleCheck size={12} /> Selesaikan</button>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender?.role === "ADMIN";
                const showAvatar = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[70%] ${isAdmin ? "flex-row-reverse" : ""}`}>
                      {showAvatar && !isAdmin ? <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden border border-white shadow-sm flex-shrink-0 mt-1">{msg.sender?.image ? <Image src={msg.sender.image} alt="" fill className="object-cover" /> : <span className="flex items-center justify-center h-full text-[10px] font-bold text-gray-500">?</span>}</div> : !isAdmin ? <div className="w-8 flex-shrink-0"></div> : null}
                      <div className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-2.5 text-sm rounded-2xl shadow-sm ${isAdmin ? "bg-[#ff6700] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-200"}`}>
                          {msg.fileUrl ? (
                            msg.fileType === "image" ? <img src={msg.fileUrl} alt="" className="max-w-full max-h-[250px] rounded-lg cursor-pointer" onClick={() => window.open(msg.fileUrl, "_blank")} /> :
                            <a href={msg.fileUrl} target="_blank" className="flex items-center gap-2 p-1"><FileText size={18} /><span className="text-xs font-bold underline truncate max-w-[120px]">File Lampiran</span><Download size={14} /></a>
                          ) : null}
                          {msg.message && <div className={msg.fileUrl ? "mt-2" : ""}>{msg.message}</div>}
                        </div>
                        <div className="flex items-center gap-1 mt-1"><span className="text-[9px] text-gray-400 font-bold">{formatTime(msg.createdAt)}</span>{isAdmin && <CheckCheck size={10} className={msg.isRead ? "text-blue-500" : "text-gray-300"} />}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {selectedRoom.status !== "RESOLVED" && (
              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSend} className="flex gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 items-center">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf,.doc,.docx" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-[#ff6700] transition-colors"><Paperclip size={18} /></button>
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis balasan..." className="flex-1 px-2 py-1.5 bg-transparent outline-none text-sm" disabled={selectedRoom.status === 'WAITING'} />
                  <button type="submit" disabled={!input.trim() || sending || selectedRoom.status === 'WAITING'} className="w-9 h-9 bg-[#ff6700] text-white rounded-lg flex items-center justify-center disabled:bg-gray-200 transition-colors"><Send size={16} /></button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
