const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Menyuntikkan Kategori...");
  const catMobile = await prisma.category.create({ data: { name: "Mobile", slug: "mobile" } });
  const catWearable = await prisma.category.create({ data: { name: "Wearables", slug: "wearables" } });

  console.log("Menyuntikkan Produk...");
  await prisma.product.create({
    data: {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "Smartphone flagship dari Apple dengan Titanium body.",
      basePrice: 20000000,
      stock: 15,
      images: JSON.stringify(["https://res.cloudinary.com/stikom/image/upload/v1/dummy/iphone.jpg"]),
      categoryId: catMobile.id,
    }
  });

  await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-s24-ultra",
      description: "Smartphone Android terbaik dengan AI terintegrasi.",
      basePrice: 21999000,
      stock: 10,
      images: JSON.stringify(["https://res.cloudinary.com/stikom/image/upload/v1/dummy/samsung.jpg"]),
      categoryId: catMobile.id,
    }
  });

  await prisma.product.create({
    data: {
      name: "Apple Watch Series 9",
      slug: "apple-watch-s9",
      description: "Jam pintar dengan fitur kesehatan terlengkap.",
      basePrice: 6500000,
      stock: 25,
      images: JSON.stringify(["https://res.cloudinary.com/stikom/image/upload/v1/dummy/watch.jpg"]),
      categoryId: catWearable.id,
    }
  });

  console.log("🎉 Berhasil menyuntikkan 3 Produk Dummy!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
