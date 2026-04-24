import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PayButton from "@/components/orders/PayButton";
import Link from "next/link";
import { PackageSearch, ShoppingBag, Clock, CheckCircle2, Truck } from "lucide-react";

export default async function UserOrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const formatIDR = (price: any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200"><Clock size={14} /> Menunggu Pembayaran</span>;
      case "PAID":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200"><PackageSearch size={14} /> Sedang Dikemas</span>;
      case "SHIPPED":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200"><Truck size={14} /> Sedang Dikirim</span>;
      case "COMPLETED":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200"><CheckCircle2 size={14} /> Selesai</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  const parseImage = (imgStr: string | null) => {
    if (!imgStr) return "📦";
    try {
      const parsed = JSON.parse(imgStr);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return imgStr;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-0 pt-24">
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pesanan Saya</h1>
              <p className="text-gray-500 mt-2">Lacak status dan riwayat belanja Anda di Neo Store</p>
           </div>
           <Link href="/profile" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
              Kembali ke Profil
           </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 flex flex-col items-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 text-gray-400">
                <ShoppingBag />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h3>
             <p className="text-gray-500 mb-6">Anda belum pernah melakukan transaksi apapun.</p>
             <Link href="/" className="bg-[#ff6700] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#e05a00] transition-colors">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                 {/* Header Struk */}
                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                       <div className="text-xs text-gray-500 font-medium font-mono mb-1">{order.id}</div>
                       <div className="text-sm font-bold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                       </div>
                    </div>
                    <div>
                       {getStatusBadge(order.status)}
                    </div>
                 </div>
                 
                 {/* Isi Struk (Barang) */}
                 <div className="p-6">
                    <div className="space-y-4">
                      {order.orderItems.map((item) => {
                         const img = parseImage(item.product.images);
                         return (
                           <div key={item.id} className="flex gap-4 items-center">
                             <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 relative">
                                {img.startsWith('/') || img.startsWith('http') 
                                  ? <Image src={img} alt="Product" fill sizes="64px" className="object-contain p-2 mix-blend-multiply" />
                                  : img
                                }
                             </div>
                             <div className="flex-1 min-w-0">
                               <h4 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h4>
                               <p className="text-xs text-gray-500 mt-1">{item.quantity} barang x {formatIDR(item.price)}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-sm font-bold text-gray-900">{formatIDR(Number(item.price) * item.quantity)}</p>
                             </div>
                           </div>
                         );
                      })}
                    </div>
                 </div>

                 {/* Footer Struk */}
                 <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                       <p className="text-xs text-gray-500 font-medium">Dikirim ke:</p>
                       <p className="text-sm font-bold text-gray-900 line-clamp-1 mt-0.5">{order.shippingAddress || "Alamat tidak direkam"}</p>
                    </div>
                    <div className="text-right sm:text-left">
                       <p className="text-xs text-gray-500 font-medium mb-0.5">Total Belanja</p>
                       <p className="text-lg font-black text-[#ff6700] tracking-tight">{formatIDR(order.total)}</p>
                    </div>

                    {order.status === "PENDING" && order.snapToken && (
                       <div className="sm:ml-auto w-full sm:w-auto flex justify-end mt-3 sm:mt-0">
                          <PayButton snapToken={order.snapToken} orderId={order.id} />
                       </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
