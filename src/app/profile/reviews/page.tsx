import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Star, MessageSquare, ExternalLink, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).id) {
    redirect("/");
  }

  const userId = (session.user as any).id;

  // Tarik semua ulasan yang pernah ditulis oleh user ini
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          name: true,
          images: true,
          slug: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fungsi untuk render bintang
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "fill-[#ff6700] text-[#ff6700]" : "fill-gray-200 text-gray-200"} 
      />
    ));
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-28 font-sans">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ulasan Saya</h1>
            <p className="text-gray-500 text-sm mt-1">Riwayat penilaian Anda terhadap produk Neo Store</p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={40} className="text-[#ff6700] opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada ulasan</h2>
            <p className="text-gray-500 max-w-sm mb-6">Anda belum pernah memberikan penilaian pada produk apapun. Beli produk dan bagikan pengalaman Anda!</p>
            <Link href="/" className="bg-[#ff6700] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e05a00] transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const productImages = review.product.images ? JSON.parse(review.product.images) : [];
              const mainImage = productImages.length > 0 ? productImages[0] : null;

              return (
                <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
                  {/* Gambar Produk */}
                  <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {mainImage ? (
                      <Image 
                        src={mainImage} 
                        alt={review.product.name} 
                        fill 
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>

                  {/* Konten Ulasan */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/product/${review.product.slug}`} className="font-bold text-gray-900 hover:text-[#ff6700] transition-colors flex items-center gap-1 group">
                        {review.product.name}
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {renderStars(review.rating)}
                    </div>

                    <div className="relative bg-orange-50/50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed italic border border-orange-100/50">
                      <Quote className="absolute top-4 right-4 text-orange-200/50 rotate-180 w-12 h-12" strokeWidth={1} />
                      <div className="relative z-10 break-all whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        &quot;{review.comment || "Pengguna ini tidak meninggalkan ulasan tertulis, hanya memberikan rating bintang."}&quot;
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
