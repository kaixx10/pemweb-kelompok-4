"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Star } from "lucide-react";
import { addReview } from "@/app/actions/review";
import { useRouter } from "next/navigation";

export default function ReviewButton({ 
  orderItemId, 
  productId,
  productName,
  hasReviewed
}: { 
  orderItemId: string;
  productId: string;
  productName: string;
  hasReviewed: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (hasReviewed) {
    return (
      <button disabled className="mt-3 px-4 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed flex items-center gap-1.5 w-fit">
        <Star size={14} className="fill-gray-400" /> Diulas
      </button>
    );
  }

  const handleReviewClick = () => {
    // Membuka modal dengan input HTML khusus untuk bintang
    Swal.fire({
      title: 'Beri Ulasan',
      html: `
        <div class="mb-4 text-sm text-gray-500">Bagaimana produk <b>${productName}</b> ini?</div>
        
        <div class="flex justify-center gap-2 mb-6" id="star-container">
           ${[1,2,3,4,5].map(i => `
             <svg data-rating="${i}" class="star-icon w-8 h-8 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
             </svg>
           `).join('')}
        </div>
        <input type="hidden" id="rating-value" value="5">

        <textarea id="review-comment" class="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black resize-none" rows="4" placeholder="Tuliskan pendapat Anda tentang barang ini... (Opsional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Kirim Ulasan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ff6700',
      didOpen: () => {
        // Logika agar bintang bisa ditekan dan berubah warna
        const stars = document.querySelectorAll('.star-icon');
        const ratingInput = document.getElementById('rating-value') as HTMLInputElement;
        
        // Default 5 star
        stars.forEach((s: any) => s.classList.replace('text-gray-300', 'text-yellow-400'));

        stars.forEach((star: any) => {
          star.addEventListener('click', (e: any) => {
            const rating = parseInt(star.getAttribute('data-rating'));
            ratingInput.value = rating.toString();
            
            stars.forEach((s: any, idx: number) => {
              if (idx < rating) {
                s.classList.replace('text-gray-300', 'text-yellow-400');
              } else {
                s.classList.replace('text-yellow-400', 'text-gray-300');
              }
            });
          });
        });
      },
      preConfirm: () => {
        const rating = (document.getElementById('rating-value') as HTMLInputElement).value;
        const comment = (document.getElementById('review-comment') as HTMLTextAreaElement).value;
        return { rating: parseInt(rating), comment };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        setLoading(true);
        const res = await addReview({
          orderItemId,
          productId,
          rating: result.value.rating,
          comment: result.value.comment
        });

        setLoading(false);

        if (res.success) {
          Swal.fire({ icon: 'success', title: 'Terima Kasih!', text: 'Ulasan Anda berhasil disimpan.', confirmButtonColor: '#ff6700' });
          router.refresh();
        } else {
          Swal.fire({ icon: 'error', title: 'Gagal', text: res.error, confirmButtonColor: '#ff6700' });
        }
      }
    });
  };

  return (
    <button 
      onClick={handleReviewClick}
      disabled={loading}
      className="mt-3 px-4 py-1.5 border border-[#ff6700] text-[#ff6700] hover:bg-[#ff6700] hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 w-fit disabled:opacity-50"
    >
      <Star size={14} /> Beri Ulasan
    </button>
  );
}
