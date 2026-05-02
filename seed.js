const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🧼 Membersihkan database lama...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("📁 Membuat Kategori...");
  const catPhones = await prisma.category.create({ data: { name: "Smartphone", slug: "smartphone" } });
  const catTablets = await prisma.category.create({ data: { name: "Tablets", slug: "tablets" } });
  const catWearables = await prisma.category.create({ data: { name: "Wearables", slug: "wearables" } });

  console.log("📦 Membuat Produk Xiaomi...");
  
  // 1. Xiaomi 14
  await prisma.product.create({
    data: {
      name: "Xiaomi 14",
      slug: "xiaomi-14",
      description: "Smartphone flagship dengan kamera Leica, Snapdragon 8 Gen 3, dan desain premium.",
      price: 11999000,
      basePrice: 11999000,
      stock: 50,
      images: JSON.stringify(["📱"]),
      categoryId: catPhones.id,
    }
  });

  // 2. Redmi Note 13 Pro+ 5G
  await prisma.product.create({
    data: {
      name: "Redmi Note 13 Pro+ 5G",
      slug: "redmi-note-13-pro-plus",
      description: "Kamera 200MP, layar lengkung 1.5K AMOLED, dan pengisian daya 120W HyperCharge.",
      price: 5999000,
      basePrice: 5999000,
      stock: 30,
      images: JSON.stringify(["📸"]),
      categoryId: catPhones.id,
    }
  });

  // 3. Xiaomi Pad 6
  await prisma.product.create({
    data: {
      name: "Xiaomi Pad 6",
      slug: "xiaomi-pad-6",
      description: "Tablet performa tinggi dengan layar 144Hz WQHD+ dan Snapdragon 870.",
      price: 4999000,
      basePrice: 4999000,
      stock: 20,
      images: JSON.stringify(["💻"]),
      categoryId: catTablets.id,
    }
  });

  // 4. Xiaomi Watch S3
  await prisma.product.create({
    data: {
      name: "Xiaomi Watch S3",
      slug: "xiaomi-watch-s3",
      description: "Smartwatch elegan dengan bezel yang bisa diganti dan HyperOS.",
      price: 1799000,
      basePrice: 1799000,
      stock: 0, // Sengaja buat testing "Stok Habis"
      images: JSON.stringify(["⌚"]),
      categoryId: catWearables.id,
    }
  });

  console.log("🎉 Database Berhasil di-Seed dengan Produk Xiaomi!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

