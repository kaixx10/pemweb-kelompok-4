const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Smart Home...");

  // Cari atau buat kategori smarthome
  let smarthome = await prisma.category.findFirst({
    where: { slug: "smart-home" }
  });

  if (!smarthome) {
    smarthome = await prisma.category.create({
      data: { id: "smart-home", name: "Smart Home", slug: "smart-home" }
    });
  }

  console.log("📦 Memasukkan produk Smart Home...");

  // 1. Xiaomi Smart Air Purifier 4 Lite Filter
  const purifierFilter = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-air-purifier-4-lite-filter" },
    update: { 
      basePrice: 369000, 
      images: JSON.stringify(["/uploads/products/smarthome-purifier-filter.png"]),
      categoryId: smarthome.id // Memastikan kategorinya Smart Home
    },
    create: {
      name: "Xiaomi Smart Air Purifier 4 Lite Filter",
      slug: "xiaomi-smart-air-purifier-4-lite-filter",
      description: `Model: M17-FLP-GL
Dimensi: diameter ± 200 mm, tinggi ± 310 mm
Kompatibilitas: khusus untuk Xiaomi Smart Air Purifier 4 Lite
Sistem Filtrasi (3 lapis):
- Pre-filter: Menyaring debu besar, rambut, bulu hewan
- High-efficiency filter (HEPA): Menyaring hingga 99,97% partikel kecil
- Activated carbon filter: Menyerap bau, asap, dan zat kimia
Umur Pakai: 6–12 bulan`,
      basePrice: 369000,
      stock: 50,
      images: JSON.stringify(["/uploads/products/smarthome-purifier-filter.png"]),
      categoryId: smarthome.id, // Didaftarkan ke kategori Smart Home!
    }
  });

  console.log("\n🎉 Produk Smart Home Berhasil!");
  console.log(`  Purifier Filter : ${purifierFilter.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
