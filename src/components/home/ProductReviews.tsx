"use client";

import { useEffect, useState } from "react";
import { getProductReviews } from "@/app/actions/review";
import { Star, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getProductReviews(productId);
      if (res.success && res.data) {
        setReviews(res.data.reviews);
        setStats({
          averageRating: res.data.averageRating,
          totalReviews: res.data.totalReviews
        });
      }
      setLoading(false);
    };
    
    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div className="animate-pulse flex space-x-4 mt-8"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>;
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-black text-gray-900">Ulasan Pembeli</h3>
        {stats.totalReviews > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-yellow-700">{stats.averageRating}</span>
            <span className="text-yellow-600/70 text-sm">({stats.totalReviews})</span>
          </div>
        )}
      </div>

      {stats.totalReviews === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
          <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Belum ada ulasan untuk produk ini.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                    {review.user.image ? (
                      <Image src={review.user.image} alt={review.user.name || "User"} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#ff6700]/10 text-[#ff6700] font-bold text-xs">
                        {(review.user.name || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{review.user.name || "Pengguna Neo"}</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={12} 
                      className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"} 
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-xl break-words">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
