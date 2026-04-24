"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductWithVariants, updateProductWithVariants, getCategories } from "@/app/actions/product";
import Swal from "sweetalert2";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon, Trash2 } from "lucide-react"; 
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "", 
  });

  const [variants, setVariants] = useState<{ color: string, storage: string, price: number }[]>([]);

  const addVariant = () => setVariants([...variants, { color: "", storage: "", price: 0 }]);
  
  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProductWithVariants(id)
        ]);

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.basePrice || 0,          // <-- Ubah di sini (sebelumnya p.basePrice)
            stock: p.stock || 0,
            categoryId: p.categoryId || "", // <-- Ubah di sini (sebelumnya p.category)
          });

          // Set Gambar
          try {
            if (p.images) {
              const imgs = JSON.parse(p.images);
              if (imgs && imgs.length > 0) setImgUrl(imgs[0]);
            }
          } catch (e) {
            if (p.images) setImgUrl(p.images);
          }

          // Set Varian
          if (p.variants && p.variants.length > 0) {
            setVariants(p.variants);
          }
        } else {
          Swal.fire("Error", "Produk tidak ditemukan", "error").then(() => router.push("/admin/products"));
        }
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setPageLoading(false);
      }
    }
    if (id) loadData();
  }, [id, router]);

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
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      Swal.fire("Error", "Gagal mengunggah gambar", "error");
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
        price: formData.price,
        categoryId: formData.categoryId,
        images: JSON.stringify([imgUrl]),
        stock: formData.stock
      };

      const res = await updateProductWithVariants(id, productData, variants);

      if (res.success) {
        Swal.fire("Berhasil!", "Perubahan produk berhasil disimpan.", "success").then(() => {
          router.push("/admin/products");
        });
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      Swal.fire("Error!", "Gagal menyimpan perubahan.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold mt-20">Memuat Data Produk...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <p className="text-sm text-gray-500">Update detail informasi atau varian produk Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* 1. GAMBAR */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                {imgUrl ? (
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-4">
                  Upload a high-quality image of your product. Recommended size 800x800px.
                </p>
                <div className="relative inline-block">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. BASIC DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t border-gray-100 pt-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input 
                type="text" required 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
              <input 
                type="text" required 
                className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors bg-gray-50"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Base Price (Rp)</label>
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
                  <>
                    <option value="Mobile">Mobile</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* ====== 3. KODE VARIAN ====== */}
          <div className="pt-6 mt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-900">Product Variants <span className="text-gray-400 font-normal text-xs">(Opsional)</span></label>
            </div>
            
            <div className="flex flex-col gap-6">
              {variants.map((v, i) => (
                <div key={i} className="relative pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Warna {i + 1}</label>
                      <input 
                        placeholder="Contoh: Hitam" 
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors" 
                        value={v.color} 
                        onChange={(e) => updateVariant(i, "color", e.target.value)} 
                      />
                      <button 
                    type="button" 
                    onClick={() => removeVariant(i)} 
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Hapus Varian"
                  >
                    <Trash2 size={16} />
                  </button>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Storage {i + 1}</label>
                      <input 
                        placeholder="Contoh: 256GB" 
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors" 
                        value={v.storage} 
                        onChange={(e) => updateVariant(i, "storage", e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Harga Varian {i + 1} (Rp)</label>
                      <input 
                        type="number" required min="0" step="1000"
                        placeholder="Contoh: 15000000" 
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-xl outline-none focus:border-black transition-colors" 
                        value={v.price || ""} 
                        onChange={(e) => updateVariant(i, "price", Number(e.target.value))} 
                      />
                    </div>
                    
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addVariant} 
                className="self-start text-[#ff6700] font-bold text-sm hover:underline"
              >
                + Tambah Varian Baru
              </button>
            </div>
          </div>
          {/* ====== AKHIR KODE VARIAN ====== */}

          {/* 4. DESCRIPTION */}
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
              disabled={loading} 
              className="bg-[#20d087] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
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