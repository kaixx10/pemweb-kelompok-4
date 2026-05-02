const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Lifestyle...");

  let lifestyle = await prisma.category.findFirst({
    where: { slug: "lifestyle" }
  });

  if (!lifestyle) {
    lifestyle = await prisma.category.create({
      data: { id: "lifestyle", name: "Lifestyle", slug: "lifestyle" }
    });
  }

  console.log("📦 Memasukkan produk Health & Fitness...");

  // 1. Xiaomi Smart Pet Food Feeder 2
  const petFeeder = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-pet-food-feeder-2" },
    update: { basePrice: 1500000, images: JSON.stringify(["/uploads/products/health-pet-feeder-2.png"]) },
    create: {
      name: "Xiaomi Smart Pet Food Feeder 2",
      slug: "xiaomi-smart-pet-food-feeder-2",
      description: `Tipe: Automatic pet feeder
Kapasitas: 5 Liter
Porsi makan: terjadwal via aplikasi
Kontrol: Xiaomi Home App
Koneksi: Wi-Fi
Daya: Adaptor listrik + backup battery
Fitur: anti macet, notifikasi makanan habis, jadwal makan otomatis`,
      basePrice: 1500000,
      stock: 15,
      images: JSON.stringify(["/uploads/products/health-pet-feeder-2.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 2. Xiaomi Handheld Garment Steamer
  const steamer = await prisma.product.upsert({
    where: { slug: "xiaomi-handheld-garment-steamer" },
    update: { basePrice: 500000, images: JSON.stringify(["/uploads/products/health-garment-steamer.png"]) },
    create: {
      name: "Xiaomi Handheld Garment Steamer",
      slug: "xiaomi-handheld-garment-steamer",
      description: `Tipe: Handheld garment steamer
Daya: 1300W
Pemanasan cepat: ±30 detik
Kapasitas tangki air: ±160 mL
Uap: kontinu tekanan stabil
Fitur: membunuh bakteri, hilangkan bau, aman untuk berbagai kain, desain portabel`,
      basePrice: 500000,
      stock: 25,
      images: JSON.stringify(["/uploads/products/health-garment-steamer.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 3. Xiaomi Sport Water Bottle 1L
  const bottle = await prisma.product.upsert({
    where: { slug: "xiaomi-sport-water-bottle-1l" },
    update: { basePrice: 219000, images: JSON.stringify(["/uploads/products/health-water-bottle-1l.png"]) },
    create: {
      name: "Xiaomi Sport Water Bottle Transparent 1L",
      slug: "xiaomi-sport-water-bottle-1l",
      description: `Kapasitas: 1 Liter (1000 mL)
Material: Tritan / BPA Free food grade plastic
Tutup: Flip cap one-touch opening
Seal: Anti bocor / leak-proof
Handle: Strap gantung / carry strap
Fitur: ringan, mudah dibawa, desain sporty`,
      basePrice: 219000,
      stock: 50,
      images: JSON.stringify(["/uploads/products/health-water-bottle-1l.png"]),
      categoryId: lifestyle.id,
    }
  });

  console.log("\n🎉 Produk Health & Fitness Berhasil!");
  console.log(`  Pet Feeder    : ${petFeeder.id}`);
  console.log(`  Steamer       : ${steamer.id}`);
  console.log(`  Water Bottle  : ${bottle.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
