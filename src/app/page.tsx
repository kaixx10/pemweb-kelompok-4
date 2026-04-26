import HeroNeo from "@/components/home/HeroNeo";
import ProductGrid from "@/components/home/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 1. Ambil produk dari database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true, 
      variants: true  
    }
  });

  // 2. Sinkronisasi nama kolom & hapus Decimal
  const safeProducts = products.map((p: any) => {
    // Tangkap harga aslinya, entah di database Anda bernama basePrice atau price
    const realPrice = p.basePrice ? p.basePrice : (p.price ? p.price : 0);
    const finalPriceNumber = parseFloat(realPrice.toString());

    return {
      ...p,
      // Timpa kedua properti ini agar Decimal hilang & harganya terbaca di etalase
      basePrice: finalPriceNumber, 
      price: finalPriceNumber,     
      
      categoryName: p.category?.name || "", 
    variants: p.variants?.map((v) => ({
      ...v,
      price: v.price ? parseFloat(v.price.toString()) : 0
      })) || []
    };
  });

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <div className="flex-1 w-full relative pb-16">
        <HeroNeo />
        <ProductGrid initialProducts={safeProducts} />
      </div>
    </main>
  );
}