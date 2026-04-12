"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-[72px] bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-black">
          <Menu size={24} />
        </button>
        
        {/* Search Bar matching the Adminty reference */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 focus-within:border-black transition-colors w-72">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent outline-none text-sm w-full text-black placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/">
          <button className="flex items-center gap-2 bg-[#ff6700]/10 text-[#ff6700] hover:bg-[#ff6700]/20 px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
            Back to Store
          </button>
        </Link>
        <button className="relative text-gray-500 hover:text-black transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{session?.user?.name || "Admin User"}</p>
            <p className="text-[11px] font-medium text-gray-500">Administrator</p>
          </div>
          {session?.user?.image ? (
            <img src={session.user.image} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff6700] to-orange-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
