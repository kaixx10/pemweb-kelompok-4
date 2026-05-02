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

  console.log("📦 Memasukkan produk Chargings...");

  // 1. Xiaomi 90W Charger
  const adapter = await prisma.product.upsert({
    where: { slug: "xiaomi-90w-charger-hypercharge" },
    update: { basePrice: 349000, images: JSON.stringify(["/uploads/products/charge-adapter-90w.png"]) },
    create: {
      name: "Xiaomi 90W HyperCharge Adapter",
      slug: "xiaomi-90w-charger-hypercharge",
      description: `Daya max: 90W
Input: 100–240V~ 50/60Hz 2A
Output: 5V/3A sampai 20V/4.5A
Port: USB-A (Combo)
Fast charge: HyperCharge Xiaomi
Isi box: Charger + kabel USB-C`,
      basePrice: 349000,
      stock: 30,
      images: JSON.stringify(["/uploads/products/charge-adapter-90w.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 2. Xiaomi 50W Wireless Charging Stand
  const wireless = await prisma.product.upsert({
    where: { slug: "xiaomi-50w-wireless-charging-stand" },
    update: { basePrice: 499000, images: JSON.stringify(["/uploads/products/charge-wireless-stand-50w.png"]) },
    create: {
      name: "Xiaomi 50W Wireless Charging Stand",
      slug: "xiaomi-50w-wireless-charging-stand",
      description: `Daya max: 50W
Input: Hingga 20V/2.25A Max
Output wireless: Hingga 50W
Standar: Qi Wireless Charging
Fitur: Pendingin kipas internal, proteksi panas, overcharge`,
      basePrice: 499000,
      stock: 20,
      images: JSON.stringify(["/uploads/products/charge-wireless-stand-50w.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 3. Xiaomi 6A USB-C to USB-C Cable
  const cable = await prisma.product.upsert({
    where: { slug: "xiaomi-6a-usb-c-to-usb-c-cable" },
    update: { basePrice: 129000, images: JSON.stringify(["/uploads/products/charge-cable-c-to-c.png"]) },
    create: {
      name: "Xiaomi 6A USB-C to USB-C Cable (1m)",
      slug: "xiaomi-6a-usb-c-to-usb-c-cable",
      description: `Arus max: 6A
Daya dukung: hingga 120W HyperCharge
Panjang: 1 meter
Material: Braided nylon + TPE
Fitur: Fast charging, tahan tekuk, kompatibel HP/tablet/laptop`,
      basePrice: 129000,
      stock: 100,
      images: JSON.stringify(["/uploads/products/charge-cable-c-to-c.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 4. Xiaomi Power Bank 20,000 mAh
  const powerbank = await prisma.product.upsert({
    where: { slug: "xiaomi-power-bank-20000-integrated" },
    update: { basePrice: 449000, images: JSON.stringify(["/uploads/products/charge-powerbank-20k.png"]) },
    create: {
      name: "Xiaomi Power Bank 20,000 (Integrated Cable)",
      slug: "xiaomi-power-bank-20000-integrated",
      description: `Kapasitas: 20,000 mAh
Daya baterai: 74 Wh
Output: Integrated USB-C Cable
Fitur: Fast charging, proteksi ganda, desain portable dengan strap`,
      basePrice: 449000,
      stock: 40,
      images: JSON.stringify(["/uploads/products/charge-powerbank-20k.png"]),
      categoryId: lifestyle.id,
    }
  });

  console.log("\n🎉 Produk Chargings Berhasil!");
  console.log(`  Adapter     : ${adapter.id}`);
  console.log(`  Wireless    : ${wireless.id}`);
  console.log(`  Cable       : ${cable.id}`);
  console.log(`  Power Bank  : ${powerbank.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
