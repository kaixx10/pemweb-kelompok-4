import { prisma } from "@/lib/prisma";
import OrderStatusDropdown from "@/components/admin/OrderStatusDropdown";
import { ShoppingBag, PackageOpen } from "lucide-react";

export default async function AdminOrdersPage() {
  // Ambil semua order dari yang paling baru
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      orderItems: { include: { product: true } }
    }
  });

  return (
    <div className="w-full flex justify-center pb-20">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <ShoppingBag className="text-[#ff6700]" /> Manajemen Pesanan
            </h1>
            <p className="text-sm text-gray-500 mt-1">Kelola seluruh transaksi dari pelanggan Neo Store.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 flex flex-col items-center">
                <PackageOpen size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">Belum ada pesanan</h3>
                <p className="text-gray-400">Silakan lakukan ujicoba checkout di halaman depan.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-5 font-semibold w-1/4">ID Pembeli</th>
                    <th className="p-5 font-semibold">Produk (Qty)</th>
                    <th className="p-5 font-semibold">Tanggal</th>
                    <th className="p-5 font-semibold text-right">Total Harga</th>
                    <th className="p-5 font-semibold text-center">Aksi Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-gray-900">{order.user?.name || "Anonim"}</div>
                        <div className="text-xs font-mono text-gray-400 mt-0.5">#{order.id.slice(0, 8)}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          {order.orderItems.map(item => (
                            <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded inline-block w-fit">
                              <span className="font-bold">{item.quantity}x</span> {item.product.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-gray-500 text-xs">
                        {order.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-5 font-bold text-gray-900 text-right">
                        Rp {Number(order.total).toLocaleString('id-ID')}
                      </td>
                      <td className="p-5 text-center">
                        <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
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
