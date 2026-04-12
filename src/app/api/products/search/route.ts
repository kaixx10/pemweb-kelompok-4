import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q || q.trim() === '') {
    return NextResponse.json([]);
  }
  
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
        }
      },
      take: 6
    });
    
    // Buat format JSON yang ramah Client (mengganti Decimal ke Number)
    const formatted = products.map(p => {
        let imageStr = p.images;
        let emoji = "📦";
        try {
            if (imageStr && typeof imageStr === 'string') {
                const parsed = JSON.parse(imageStr);
                emoji = Array.isArray(parsed) ? parsed[0] : parsed;
            }
        } catch (e) {
            emoji = imageStr || "📦";
        }

        return {
            id: p.id,
            name: p.name,
            img: emoji
        };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Gagal menjalankan pencarian:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
