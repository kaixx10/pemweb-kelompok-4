import { prisma } from "@/lib/prisma";
import { DollarSign, Eye, ShieldCheck, Download } from "lucide-react";

export default async function AdminDashboard() {
  // 1. Kalkulasi Hitungan Kuantitas Utama
  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();

  // 2. Kalkulasi TOTAL EARNINGS Asli (Khusus yang valid/dibayar)
  const earningsAgg = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ["PAID", "SHIPPED", "COMPLETED"] } }
  });
  const totalEarnings = earningsAgg._sum.total ? Number(earningsAgg._sum.total) : 0;
  
  // 3. Tarik Pesanan Terkini Asli
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  // 4. Tarik Aktivitas User Asli
  const recentUsers = await prisma.user.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-gradient-to-br from-[#fc8a51] to-[#f56e25] rounded-xl p-5 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
            <div className="absolute right-0 top-0 opacity-10 pt-4 pr-4"><DollarSign size={80} /></div>
            <div>
              <p className="text-[13px] font-semibold opacity-90 mb-1">TOTAL EARNINGS</p>
              <h3 className="text-3xl font-black mb-4">Rp {totalEarnings.toLocaleString('id-ID')}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium border-t border-white/20 pt-3">
              <span className="opacity-80">Dari order Selesai/Dibayar</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#20d087] to-[#14b370] rounded-xl p-5 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
            <div className="absolute right-0 top-0 opacity-10 pt-4 pr-4"><Eye size={80} /></div>
            <div>
              <p className="text-[13px] font-semibold opacity-90 mb-1">TOTAL PESANAN</p>
              <h3 className="text-3xl font-black mb-4">{orderCount} Trx</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium border-t border-white/20 pt-3">
              <span>Seluruh pesanan masuk</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#ff5370] to-[#e63c58] rounded-xl p-5 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
            <div className="absolute right-0 top-0 opacity-10 pt-4 pr-4"><ShieldCheck size={80} /></div>
            <div>
              <p className="text-[13px] font-semibold opacity-90 mb-1">TOTAL PRODUCTS</p>
              <h3 className="text-3xl font-black mb-4">{productCount}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium border-t border-white/20 pt-3">
              <span className="opacity-80">Sinkron dengan Database</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00bcd4] to-[#01a7bc] rounded-xl p-5 shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
            <div className="absolute right-0 top-0 opacity-10 pt-4 pr-4"><Download size={80} /></div>
            <div>
              <p className="text-[13px] font-semibold opacity-90 mb-1">TOTAL USERS</p>
              <h3 className="text-3xl font-black mb-4">{userCount}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium border-t border-white/20 pt-3">
              <span className="opacity-80">Pengguna Terdaftar</span>
            </div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="font-bold text-gray-800">Sales Analytics</h3>
              <p className="text-xs text-gray-500 mt-1">Grafik Statis (Akan diupdate dengan chart JS nantinya)</p>
            </div>
            
            <div className="flex-1 w-full flex items-end gap-2 md:gap-4 h-64 pt-8 border-b border-gray-100 relative">
              <div className="absolute left-0 right-0 top-0 border-t border-gray-50"></div>
              <div className="absolute left-0 right-0 top-1/4 border-t border-gray-50"></div>
              <div className="absolute left-0 right-0 top-2/4 border-t border-gray-50"></div>
              <div className="absolute left-0 right-0 top-3/4 border-t border-gray-50"></div>
              
              {[40, 65, 30, 85, 55, 90, 45, 75, 40, 95].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-10">
                  <div 
                    className="w-full max-w-[2rem] bg-gradient-to-t from-[#ff6700] to-orange-300 rounded-t-sm transition-all duration-300 group-hover:opacity-80 relative"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <h3 className="font-bold text-gray-800 mb-6">User Terdaftar Terbaru</h3>
            <div className="flex flex-col gap-6">
              {recentUsers.length > 0 ? recentUsers.map(u => (
                <div key={u.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-[#ff6700] flex items-center justify-center font-bold flex-shrink-0 uppercase">
                    {(u.name || "U").charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{u.name || "Pengguna Baru"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">{u.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center">Belum ada pengguna. Minta temanmu mendaftar!</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Application Sales Table - TANPA MOCK DATA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">5 Pesanan Terakhir</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Total Harga</th>
                  <th className="p-4 font-semibold">Tanggal Order</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{order.user?.name || "Bapak/Ibu tanpa nama"}</td>
                      <td className="p-4 text-gray-500">#{order.id.slice(0,8).toUpperCase()}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold
                          ${order.status === 'COMPLETED' || order.status === 'SHIPPED' ? 'bg-green-100 text-green-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        Rp {Number(order.total).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        {order.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      Toko Anda masih sepi pesanan nih. Bagikan toko ini ke teman-temanmu agar cuan!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
