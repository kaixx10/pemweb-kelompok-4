const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori TVs & Home Appliances...");

  let tvsha = await prisma.category.findFirst({
    where: { slug: "tvs-ha" }
  });

  if (!tvsha) {
    tvsha = await prisma.category.create({
      data: { id: "tvs-ha", name: "TVs & HA", slug: "tvs-ha" }
    });
  }

  console.log("📦 Memasukkan produk TVs & HA...");

  // 1. Projector
  const projector = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-projector-l1" },
    update: { basePrice: 1319670, images: JSON.stringify(["/uploads/products/tvha-projector.jpg"]), categoryId: tvsha.id },
    create: {
      name: "Xiaomi Smart Projector L1 Series",
      slug: "xiaomi-smart-projector-l1",
      description: `Resolusi: Full HD 1080p (mendukung pemutaran video 4K).
Kecerahan: 200 ISO Lumens untuk model L1.
Fitur Pintar: Android TV dengan Google Assistant dan Chromecast bawaan.
Konektivitas: Wi-Fi Dual-band (2.4GHz/5GHz) dan Bluetooth 5.0.
Audio: Dual speaker 3W dengan dukungan Dolby Audio.
Kemudahan Penggunaan: Auto Focus dan Omnidirectional Auto Keystone Correction.`,
      basePrice: 1319670,
      stock: 30,
      images: JSON.stringify(["/uploads/products/tvha-projector.jpg"]),
      categoryId: tvsha.id,
    }
  });

  // 2. Refrigerator
  const fridge = await prisma.product.upsert({
    where: { slug: "xiaomi-mijia-refrigerator-510l" },
    update: { basePrice: 7800000, images: JSON.stringify(["/uploads/products/tvha-refrigerator.png"]), categoryId: tvsha.id },
    create: {
      name: "Xiaomi Mijia Refrigerator Cross Door 510L",
      slug: "xiaomi-mijia-refrigerator-510l",
      description: `Tipe: Kulkas 4 pintu (Cross Door) / Smart Refrigerator
Kapasitas: 510 Liter total (Fridge: 303 L, Freezer: 178 L, i-Fresh: 29 L)
Desain: Ultra-slim (kedalaman ±60 cm), warna Slate Gray
Dimensi: 852 × 600 × 1912 mm
Kompresor: Dual Inverter (hemat listrik & senyap)
Sistem Pendingin: No Frost (tidak berembun)
Kebisingan: ±38 dB (cukup senyap)`,
      basePrice: 7800000,
      stock: 15,
      images: JSON.stringify(["/uploads/products/tvha-refrigerator.png"]),
      categoryId: tvsha.id,
    }
  });

  // 3. TV Stick
  const tvstick = await prisma.product.upsert({
    where: { slug: "xiaomi-mi-tv-stick" },
    update: { basePrice: 400000, images: JSON.stringify(["/uploads/products/tvha-tv-stick.png"]), categoryId: tvsha.id },
    create: {
      name: "Xiaomi Mi TV Stick",
      slug: "xiaomi-mi-tv-stick",
      description: `Tipe: Android TV Stick / perangkat streaming TV
Resolusi: Full HD 1080p (1920 × 1080)
Prosesor: Quad-core Cortex-A53, RAM: 1 GB, ROM: 8 GB
Sistem Operasi: Android TV 9
Konektivitas: Wi-Fi 2.4GHz / 5GHz, Bluetooth 4.2
Fitur: Chromecast built-in, voice search, screen mirroring
Ukuran: ±92.4 × 30.2 × 15.2 mm (28.5 gram)`,
      basePrice: 400000,
      stock: 120,
      images: JSON.stringify(["/uploads/products/tvha-tv-stick.png"]),
      categoryId: tvsha.id,
    }
  });

  // 4. Washing Machine
  const washer = await prisma.product.upsert({
    where: { slug: "mijia-front-load-washer-10-5kg" },
    update: { basePrice: 4798000, images: JSON.stringify(["/uploads/products/tvha-washer.jpg"]), categoryId: tvsha.id },
    create: {
      name: "Mijia Front Load Washer Dryer 10.5kg",
      slug: "mijia-front-load-washer-10-5kg",
      description: `Kapasitas: Mencuci hingga 10,5 kg dan mengeringkan hingga 7,0 kg.
Teknologi Motor: DD Direct Drive motor (suara lebih halus, hemat energi).
Kecepatan Putar: Maksimal hingga 1.200 rpm.
Fitur Sterilisasi: Steam Wash (menghilangkan 99,99% bakteri/virus).
Kontrol Pintar: Aplikasi Xiaomi Home & Layar sentuh berwarna.
Konsumsi Daya: Pemanasan 1.800W–2.200W, Pengeringan 1.400W–1.800W.`,
      basePrice: 4798000,
      stock: 20,
      images: JSON.stringify(["/uploads/products/tvha-washer.jpg"]),
      categoryId: tvsha.id,
    }
  });

  console.log("\n🎉 Produk TVs & HA Berhasil!");
  console.log(`  Projector          : ${projector.id}`);
  console.log(`  Kulkas (Fridge)    : ${fridge.id}`);
  console.log(`  TV Stick           : ${tvstick.id}`);
  console.log(`  Washing Machine    : ${washer.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
