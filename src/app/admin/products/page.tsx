import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductActionButtons from "@/components/admin/ProductActionButtons";

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your store's inventory and items.</p>
        </div>
        <Link href="/admin/products/new">
          <button className="bg-[#ff6700] hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={18} />
            <span className="hidden sm:block">Add Product</span>
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold w-16">Image</th>
                <th className="p-4 font-semibold">Name & Slug</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {products.length > 0 ? (
                products.map((product) => {
                  let imgUrl = "";
                  try {
                    const parsed = JSON.parse(product.images || "[]");
                    imgUrl = parsed[0] || product.images;
                  } catch {
                    imgUrl = product.images || "";
                  }
                  
                  // Deteksi apakah imageUrl adalah emoji (kurang dari 10 karakter dan bukan URL)
                  const isEmoji = imgUrl.length < 10 && !imgUrl.startsWith("http") && !imgUrl.startsWith("/");

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                           {isEmoji ? (
                             <span className="text-2xl">{imgUrl}</span>
                           ) : imgUrl && (imgUrl.startsWith('http') || imgUrl.startsWith('/')) ? (
                             <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-xs text-gray-400">No img</span>
                           )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{product.slug}</p>
                      </td>
                      <td className="p-4 font-bold text-gray-800">
                        Rp {Number(product.basePrice).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        {(product.category as any)?.name || "N/A"}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <ProductActionButtons id={product.id} name={product.name} />
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No products found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
