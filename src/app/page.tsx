import HeroNeo from "@/components/home/HeroNeo";
import ProductGrid from "@/components/home/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 1. Ambil produk lengkap dengan variannya
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { variants: true } // Pastikan menyertakan varian
  });

  // 2. Konversi SEMUA kolom Decimal (produk utama & varian) menjadi Number
  const safeProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice), // Gunakan 'basePrice' sesuai database
    variants: p.variants.map((v) => ({
      ...v,
      price: Number(v.price) // Konversi harga di dalam varian juga
    }))
  }));

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <div className="flex-1 w-full relative pb-16">
        <HeroNeo />
        {/* Sekarang data sudah aman dikirim ke Client Component */}
        <ProductGrid initialProducts={safeProducts} />
      </div>
    </main>
  );
}