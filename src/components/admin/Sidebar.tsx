"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Products", icon: <Package size={20} />, path: "/admin/products" },
    { name: "Orders", icon: <ShoppingCart size={20} />, path: "/admin/orders" },
    { name: "Customers", icon: <Users size={20} />, path: "/admin/users" },
  ];

  return (
    <aside className="w-64 bg-[#1a1a1a] text-gray-300 flex flex-col min-h-screen">
      <div className="h-[72px] flex items-center px-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg font-black text-xs">
             NS
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Neo Admin</span>
        </Link>
      </div>

      <div className="p-4 flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Navigation</p>
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`) && item.path !== '/admin';
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-[#ff6700] text-white font-semibold shadow-lg shadow-[#ff6700]/20" 
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4 px-2">System</p>
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 hover:text-white"
            >
              <Settings size={20} />
              <span className="text-sm">Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800 mt-auto">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 hover:text-white cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center overflow-hidden border-2 border-gray-700 group-hover:border-white transition-colors">
            <LogOut size={14} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Sign Out</span>
            <span className="text-xs text-gray-500">End session</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
