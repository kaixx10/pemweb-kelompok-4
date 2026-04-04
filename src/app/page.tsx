import HeroBento from "@/components/home/HeroBento";
import ProductGrid from "@/components/home/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Ambil semua produk dari database (terbaru di atas)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Hapus Decimal yang tidak bisa dibaca oleh Next.js Client Component
  const safeProducts = products.map((p) => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <div className="flex-1 w-full relative pb-16">
        {/* Bento UI Showcase Section */}
        <HeroBento />
        
        {/* Product Catalog Standard Grid Section */}
        <ProductGrid initialProducts={safeProducts} />
      </div>
    </main>
  );
}