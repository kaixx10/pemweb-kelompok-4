import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/home/ProductGrid";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Memetakan Induk Kategori di Navbar dengan kategori detail di Database
const SUPER_CATEGORIES: Record<string, { title: string, slugs: string[], desc: string }> = {
  mobile: {
    title: "Mobile",
    desc: "Evolusi teknologi ponsel cerdas dan tablet di genggaman Anda.",
    slugs: ["phones", "tablets"]
  },
  wearables: {
    title: "Wearables & Audio",
    desc: "Gaya hidup sehat dengan pemantau cerdas di setiap metrik tubuh Anda.",
    slugs: ["smart-watches"] // berdasarkan seding data
  },
  lifestyle: {
    title: "Lifestyle",
    desc: "Alat-alat fungsional untuk menunjang aktivitas luar ruangan, kebugaran, dan keseharian.",
    slugs: ["chargings", "outdoors", "offices", "personal-care", "health-fitness", "tools"]
  },
  "smart-home": {
    title: "Smart Home",
    desc: "Otomatisasi peralatan rumah tangga pintar untuk kehidupan masa depan.",
    slugs: ["tvs-ha", "vacuum-cleaners", "environment", "kitchen-sec"]
  }
};

export default async function SuperCategoryPage({ params }: { params: Promise<{ supercategory: string }> }) {
  const resolvedParams = await params;
  const superCat = resolvedParams.supercategory.toLowerCase();
  
  // Jika pengunjung memasang rute aneh atau melampaui 4 kategori utama, buang ke 404
  if (!SUPER_CATEGORIES[superCat]) {
     return notFound(); 
  }

  const categoryInfo = SUPER_CATEGORIES[superCat];

  // Mengambil produk yang Kategori slug-nya termuat di dalam daftar array slugs
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: {
          in: categoryInfo.slugs
        }
      }
    },
    orderBy: { createdAt: "desc" },
    include: { variants: true },
  });

  const safeProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice), 
    variants: p.variants.map((v) => ({
      ...v,
      price: Number(v.price)
    }))
  }));

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      {/* ... (kode banner kategori) ... */}
      <div className="flex-1 w-full relative pb-16 mt-8">
        <ProductGrid initialProducts={safeProducts} />
      </div>
    </main>
  );
}
