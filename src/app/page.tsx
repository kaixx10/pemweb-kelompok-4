import Navbar from "@/components/layout/Navbar";
import HeroBento from "@/components/home/HeroBento";
import ProductGrid from "@/components/home/ProductGrid";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 w-full relative pb-16">
        {/* Bento UI Showcase Section */}
        <HeroBento />
        
        {/* Product Catalog Standard Grid Section */}
        <ProductGrid />
      </div>

      <Footer />
    </main>
  );
}
