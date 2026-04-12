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
  });

  const safeProducts = products.map((p) => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      
      {/* Kategori Header Banner */}
      <div className="w-full bg-[#111] text-white py-16 md:py-24 px-6 relative overflow-hidden">
        {/* Dekorasi Cahaya Abstrak */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff6700]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
            <span className="text-[#ff6700] text-xs font-bold tracking-[0.2em] uppercase mb-4">Etalase Tematik</span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter shadow-sm">{categoryInfo.title}</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">{categoryInfo.desc}</p>
        </div>
      </div>

      <div className="flex-1 w-full relative pb-16 mt-8">
        <ProductGrid initialProducts={safeProducts} />
      </div>

    </main>
  );
}
