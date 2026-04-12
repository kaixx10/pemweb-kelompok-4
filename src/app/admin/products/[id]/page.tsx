"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateProduct, getCategories, getProduct } from "@/app/actions/product";
import Swal from "sweetalert2";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imgUrl, setImgUrl] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProduct(productId)
        ]);

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || "",
            price: Number(p.price) || 0,
            stock: p.stock || 0,
            categoryId: p.categoryId,
          });

          // Parsing Image JSON
          try {
            const parsed = JSON.parse(p.images || "[]");
            setImgUrl(parsed[0] || p.images);
          } catch {
            setImgUrl(p.images || "");
          }
        } else {
          Swal.fire("Error", "Produk tidak ditemukan", "error").then(() => {
            router.push("/admin/products");
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    
    if (productId) {
      loadData();
    }
  }, [productId, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/auth/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      
      if (data.success) {
        setImgUrl(data.url);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Gambar berhasil diperbarui",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Gagal mengunggah gambar", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        images: JSON.stringify([imgUrl]),
      };

      const res = await updateProduct(productId, productData);

      if (res.success) {
        Swal.fire("Success!", "Perubahan produk berhasil disimpan.", "success").then(() => {
          router.push("/admin/products");
        });
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      Swal.fire("Error!", err.message || "Gagal menyimpan perubahan.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#ff6700]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <p className="text-sm text-gray-500">Ubah informasi produk ini.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden">
                {imgUrl ? (
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-4">
                  Ganti gambar produk. Kosongkan jika tidak ingin mengubah.
                </p>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    Upload New Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input 
                type="text" required 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug (Generated)</label>
              <input 
                type="text" required 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors bg-gray-50 cursor-not-allowed"
                value={formData.slug}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (Rp)</label>
              <input 
                type="number" required min="0" step="1000"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors"
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
              <input 
                type="number" required min="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors bg-white"
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                ) : (
                  <option value="">Loading categories...</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              required rows={5}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-black transition-colors resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !imgUrl} 
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
