const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Environment...");

  // Cari atau buat kategori Environment
  let environment = await prisma.category.findFirst({
    where: { slug: "environment" }
  });

  if (!environment) {
    environment = await prisma.category.create({
      data: { id: "environment", name: "Environment", slug: "environment" }
    });
  }

  console.log("📦 Memasukkan 4 produk Environment...");

  // 1. Air Purifier 4 Compact
  const purifier = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-air-purifier-4-compact" },
    update: { 
      basePrice: 1199000, 
      images: JSON.stringify(["/uploads/products/env-air-purifier-4-compact.png"]),
      categoryId: environment.id 
    },
    create: {
      name: "Xiaomi Smart Air Purifier 4 Compact",
      slug: "xiaomi-smart-air-purifier-4-compact",
      description: `CADR: ± 230 m³/jam
Cakupan ruangan: hingga ± 48 m²
Filtrasi: 3 lapis (pre-filter + HEPA-style + karbon aktif)
Efisiensi: 99,97% partikel 0,3 mikron
Noise: mulai ± 20 dB (mode tidur)
Daya: ± 27 Watt (hemat listrik)
Motor: brushless DC (lebih awet & efisien)
Fitur: Sensor kualitas udara real-time, Auto mode, Sleep mode, Kontrol via aplikasi Xiaomi Home.`,
      basePrice: 1199000,
      stock: 40,
      images: JSON.stringify(["/uploads/products/env-air-purifier-4-compact.png"]),
      categoryId: environment.id,
    }
  });

  // 2. Air Purifier 4 Lite Filter (Accessories)
  const filter = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-air-purifier-4-lite-filter" },
    update: { 
      basePrice: 369000, 
      images: JSON.stringify(["/uploads/products/env-purifier-filter.png"]),
      categoryId: environment.id 
    },
    create: {
      name: "Xiaomi Smart Air Purifier 4 Lite Filter",
      slug: "xiaomi-smart-air-purifier-4-lite-filter",
      description: `Model: M17-FLP-GL
Dimensi: diameter ± 200 mm, tinggi ± 310 mm
Kompatibilitas: khusus untuk Xiaomi Smart Air Purifier 4 Lite
Sistem Filtrasi (3 lapis):
- Pre-filter: Menyaring debu besar, bulu hewan
- High-efficiency filter (HEPA): Menyaring hingga 99,97% partikel kecil
- Activated carbon filter: Menyerap bau dan zat kimia
Umur Pakai: 6–12 bulan`,
      basePrice: 369000,
      stock: 60,
      images: JSON.stringify(["/uploads/products/env-purifier-filter.png"]),
      categoryId: environment.id,
    }
  });

  // 3. Dehumidifier Lite
  const dehumidifier = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-dehumidifier-lite" },
    update: { 
      basePrice: 3512000, 
      images: JSON.stringify(["/uploads/products/env-dehumidifier-lite.png"]),
      categoryId: environment.id 
    },
    create: {
      name: "Xiaomi Smart Dehumidifier Lite",
      slug: "xiaomi-smart-dehumidifier-lite",
      description: `Kapasitas dehumidifikasi: sekitar 13 liter per hari
Kapasitas tangki air: 3 liter
Daya listrik: sekitar 190W (maksimal 250W)
Airflow: sekitar 140 m³/jam
Tingkat kebisingan: kisaran 34–38 dB
Berat: sekitar 11 kg
Ukuran: kurang lebih tinggi 52 cm`,
      basePrice: 3512000,
      stock: 25,
      images: JSON.stringify(["/uploads/products/env-dehumidifier-lite.png"]),
      categoryId: environment.id,
    }
  });

  // 4. Curved Gaming Monitor
  const monitor = await prisma.product.upsert({
    where: { slug: "xiaomi-curved-gaming-monitor-g34wqi" },
    update: { 
      basePrice: 3898000, 
      images: JSON.stringify(["/uploads/products/env-monitor-curved.png"]),
      categoryId: environment.id 
    },
    create: {
      name: "Xiaomi Curved Gaming Monitor G34WQi",
      slug: "xiaomi-curved-gaming-monitor-g34wqi",
      description: `Layar: 34 inci ultrawide
Resolusi: 3440 x 1440 (WQHD / 2K ultrawide)
Aspect ratio: 21:9 (lebih lebar dari monitor biasa)
Curved: 1500R (lebih immersive buat gaming)`,
      basePrice: 3898000,
      stock: 15,
      images: JSON.stringify(["/uploads/products/env-monitor-curved.png"]),
      categoryId: environment.id,
    }
  });

  console.log("\n🎉 Produk Environment Berhasil!");
  console.log(`  Air Purifier       : ${purifier.id}`);
  console.log(`  Filter (Aksesoris) : ${filter.id}`);
  console.log(`  Dehumidifier       : ${dehumidifier.id}`);
  console.log(`  Monitor Curved     : ${monitor.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
