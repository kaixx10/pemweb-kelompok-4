"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/app/actions/product";
import ProductGrid from "@/components/home/ProductGrid";
import { Search, Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await searchProducts(query);
      if (res.success) {
        // Map data agar sesuai dengan format ProductGrid
        const mappedResults = res.data?.map((p: any) => ({
          ...p,
          price: p.basePrice,
          categoryName: p.category?.name || "Lainnya"
        })) || [];
        setResults(mappedResults);
      }
      setLoading(false);
    }
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header Pencarian */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Search className="text-[#ff6700]" size={28} />
              Hasil Pencarian
            </h1>
            <p className="text-gray-500 mt-2">
              {loading ? "Mencari..." : query ? `Menampilkan ${results.length} hasil untuk "${query}"` : "Masukkan kata kunci untuk mencari"}
            </p>
          </div>
        </div>

        {/* State Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-[#ff6700]" size={40} />
            <p className="text-gray-500 font-medium">Menyiapkan hasil terbaik untuk Anda...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProductGrid initialProducts={results} />
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Maaf, kami tidak dapat menemukan produk yang sesuai dengan "{query}". Coba gunakan kata kunci yang lebih umum.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-[#ff6700] text-white px-8 py-3 rounded-full font-bold hover:bg-[#e65c00] transition-all"
            >
              Kembali
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#ff6700]" size={40} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
