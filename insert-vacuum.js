const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Vacuum Cleaners...");

  let vacuumCat = await prisma.category.findFirst({
    where: { slug: "vacuum-cleaners" }
  });

  if (!vacuumCat) {
    vacuumCat = await prisma.category.create({
      data: { id: "vacuum-cleaners", name: "Vacuum Cleaners", slug: "vacuum-cleaners" }
    });
  }

  console.log("📦 Memasukkan produk Vacuum Cleaners...");

  // 1. Handled Vacuum (Filter Accessory)
  const handled = await prisma.product.upsert({
    where: { slug: "xiaomi-mijia-k10-pro-filter" },
    update: { basePrice: 549000, images: JSON.stringify(["/uploads/products/vac-handled.png"]), categoryId: vacuumCat.id },
    create: {
      name: "Xiaomi Mijia K10 Pro / G11 HEPA Filter",
      slug: "xiaomi-mijia-k10-pro-filter",
      description: `Tipe: HEPA filter (High Efficiency Particulate Air)
Kompatibilitas: Xiaomi Mijia K10 Pro, Xiaomi G11, MJWXCQ05XY / MJWXCQ05XYHW
Material: filter partikel efisiensi tinggi (menangkap debu halus & alergen)
Fungsi utama:
- Menyaring debu mikro
- Menjaga udara keluar tetap bersih
- Memastikan performa vacuum tetap maksimal`,
      basePrice: 549000,
      stock: 50,
      images: JSON.stringify(["/uploads/products/vac-handled.png"]),
      categoryId: vacuumCat.id,
    }
  });

  // 2. Robot Vacuum
  const robot = await prisma.product.upsert({
    where: { slug: "xiaomi-robot-vacuum-h50" },
    update: { basePrice: 4999000, images: JSON.stringify(["/uploads/products/vac-robot.png"]), categoryId: vacuumCat.id },
    create: {
      name: "Xiaomi Robot Vacuum H50",
      slug: "xiaomi-robot-vacuum-h50",
      description: `Daya hisap: 10.000 Pa
Navigasi: Laser LDS (360° mapping)
Baterai: 5200 mAh (maks)
Daya: sekitar 55W
Berat unit: ± 3.7 kg
Dimensi robot: ± 355 × 353 × 93 mm`,
      basePrice: 4999000,
      stock: 20,
      images: JSON.stringify(["/uploads/products/vac-robot.png"]),
      categoryId: vacuumCat.id,
    }
  });

  // 3. Wet Dry Vacuum
  const wetdry = await prisma.product.upsert({
    where: { slug: "xiaomi-truclean-w20" },
    update: { basePrice: 2799000, images: JSON.stringify(["/uploads/products/vac-wetdry.png"]), categoryId: vacuumCat.id },
    create: {
      name: "Xiaomi Truclean W20 Wet Dry Vacuum",
      slug: "xiaomi-truclean-w20",
      description: `Daya hisap: 15.000 Pa
Daya listrik: 200W
Baterai: 2500 mAh
Waktu pakai: ± 30 menit
Berat: ± 4.2 kg
Fungsi ganda untuk mengepel (wet) dan menyedot debu (dry).`,
      basePrice: 2799000,
      stock: 15,
      images: JSON.stringify(["/uploads/products/vac-wetdry.png"]),
      categoryId: vacuumCat.id,
    }
  });

  // 4. Accessories (Data placeholder karena file .docx)
  const accessory = await prisma.product.upsert({
    where: { slug: "xiaomi-vacuum-essential-accessories" },
    update: { basePrice: 250000, images: JSON.stringify(["/uploads/products/vac-accessories.png"]), categoryId: vacuumCat.id },
    create: {
      name: "Xiaomi Vacuum Essential Accessories Kit",
      slug: "xiaomi-vacuum-essential-accessories",
      description: `Satu set kelengkapan dan aksesoris pengganti (replacement parts) untuk lini Xiaomi Robot Vacuum.
Termasuk: Main Brush, Side Brush, dan Washable Mop Pads.
Didesain untuk menjaga kinerja pembersihan tetap prima di berbagai jenis lantai.`,
      basePrice: 250000,
      stock: 100,
      images: JSON.stringify(["/uploads/products/vac-accessories.png"]),
      categoryId: vacuumCat.id,
    }
  });

  console.log("\n🎉 Produk Vacuum Cleaners Berhasil!");
  console.log(`  Handled (Filter)   : ${handled.id}`);
  console.log(`  Robot Vacuum       : ${robot.id}`);
  console.log(`  Wet Dry Vacuum     : ${wetdry.id}`);
  console.log(`  Accessories Kit    : ${accessory.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
