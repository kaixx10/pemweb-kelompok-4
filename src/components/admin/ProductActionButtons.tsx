"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { deleteProduct } from "@/app/actions/product";

export default function ProductActionButtons({ id, name }: { id: string, name: string }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: `Produk "${name}" akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const res = await deleteProduct(id);
      if (res.success) {
        Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
      } else {
        Swal.fire("Gagal", res.error || "Gagal menghapus produk", "error");
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/products/${id}`}>
        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit Product">
          <Edit size={16} />
        </button>
      </Link>
      <button 
        onClick={handleDelete}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
        title="Delete Product"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
