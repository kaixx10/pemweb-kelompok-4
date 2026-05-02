const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Lifestyle...");

  // Cari atau buat kategori Lifestyle
  let lifestyle = await prisma.category.findFirst({
    where: { slug: "lifestyle" }
  });

  if (!lifestyle) {
    console.log("📁 Kategori Lifestyle belum ada, membuatnya...");
    lifestyle = await prisma.category.create({
      data: { id: "lifestyle", name: "Lifestyle", slug: "lifestyle" }
    });
  }

  console.log(`✅ Kategori ditemukan: ${lifestyle.name} (ID: ${lifestyle.id})`);
  console.log("📦 Memasukkan produk Lifestyle...");

  // 1. Xiaomi Electric Scooter 4 Lite 2nd Gen
  const scooter = await prisma.product.upsert({
    where: { slug: "xiaomi-scooter-4-lite-2nd" },
    update: {
      basePrice: 6090000,
      stock: 15,
      images: JSON.stringify(["/uploads/products/scooter-4-lite.png"]),
    },
    create: {
      name: "Xiaomi Electric Scooter 4 Lite 2nd Gen",
      slug: "xiaomi-scooter-4-lite-2nd",
      description: `Kecepatan max: 25 km/jam
Jarak tempuh: hingga 25 km
Motor: 300W nominal / 500W max
Tanjakan: hingga 15%
Baterai: 221Wh
Waktu cas: ±8 jam
Ban: 10 inci pneumatic
Rem: E-ABS + drum brake
Berat: 16.2 kg
Beban max: 100 kg
Tahan air: IPX4
Fitur: bisa dilipat, 3 mode kecepatan, lampu depan, koneksi aplikasi Xiaomi Home`,
      basePrice: 6090000,
      stock: 15,
      images: JSON.stringify(["/uploads/products/scooter-4-lite.png"]),
      categoryId: lifestyle.id,
    }
  });
  console.log(`  ✅ Scooter → ID: ${scooter.id}`);

  // 2. Xiaomi Luggage Classic Pro 26"
  const luggage = await prisma.product.upsert({
    where: { slug: "xiaomi-luggage-classic-pro-26" },
    update: {
      basePrice: 1899000,
      stock: 25,
      images: JSON.stringify(["/uploads/products/luggage-classic-pro.png"]),
    },
    create: {
      name: 'Xiaomi Luggage Classic Pro 26"',
      slug: "xiaomi-luggage-classic-pro-26",
      description: `Ukuran: 26 inci
Kapasitas: ±80 Liter
Berat: ±4.5 kg
Dimensi body: 660 × 440 × 290 mm
Dimensi total: 710 × 456 × 290 mm
Material shell: Polycarbonate (PC)
Material lining: Polyester
Roda: 4 roda putar 360°
Handle: Telescopic aluminium adjustable
Kunci: TSA Lock
Fitur: Anti gores, resleting anti-pecah, ruang penyimpanan luas, desain flat top`,
      basePrice: 1899000,
      stock: 25,
      images: JSON.stringify(["/uploads/products/luggage-classic-pro.png"]),
      categoryId: lifestyle.id,
    }
  });
  console.log(`  ✅ Luggage → ID: ${luggage.id}`);

  // 3. Xiaomi Portable Electric Air Compressor 1S
  const compressor = await prisma.product.upsert({
    where: { slug: "xiaomi-air-compressor-1s" },
    update: {
      basePrice: 549000,
      stock: 40,
      images: JSON.stringify(["/uploads/products/air-compressor-1s.png"]),
    },
    create: {
      name: "Xiaomi Portable Electric Air Compressor 1S",
      slug: "xiaomi-air-compressor-1s",
      description: `Tekanan max: 150 PSI / 10.3 bar
Baterai: 14.8 Wh lithium internal
Input charging: 5V ⎓ 2A
Port charging: USB Type-C
Waktu cas: < 3 jam
Ukuran: 124 × 71 × 45.3 mm
Berat: ±480 gram
Kebisingan: < 80 dB (jarak 1 meter)
Mode: Mobil, motor, sepeda, bola, manual
Fitur: layar digital, auto stop saat tekanan tercapai, lampu LED + SOS, akurasi ±1 PSI`,
      basePrice: 549000,
      stock: 40,
      images: JSON.stringify(["/uploads/products/air-compressor-1s.png"]),
      categoryId: lifestyle.id,
    }
  });
  console.log(`  ✅ Air Compressor → ID: ${compressor.id}`);

  console.log("\n🎉 Semua produk Lifestyle berhasil dimasukkan ke database!");
  console.log("\n📋 Ringkasan ID Produk (catat untuk navbar):");
  console.log(`  Scooter     : ${scooter.id}`);
  console.log(`  Luggage     : ${luggage.id}`);
  console.log(`  Compressor  : ${compressor.id}`);
}

main()
  .catch(e => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
