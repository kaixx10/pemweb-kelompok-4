import HeroBento from "@/components/home/HeroBento";
import ProductGrid from "@/components/home/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <div className="flex-1 w-full relative pb-16">
        {/* Bento UI Showcase Section */}
        <HeroBento />
        
        {/* Product Catalog Standard Grid Section */}
        <ProductGrid />
      </div>
    </main>
  );
}