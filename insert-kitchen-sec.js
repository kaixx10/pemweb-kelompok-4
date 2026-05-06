const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Smart Home...");

  let smarthome = await prisma.category.findFirst({
    where: { slug: "smart-home" }
  });

  if (!smarthome) {
    smarthome = await prisma.category.create({
      data: { id: "smart-home", name: "Smart Home", slug: "smart-home" }
    });
  }

  console.log("📦 Memasukkan produk Kitchen & Security...");

  // 1. Air Fryer
  const airfryer = await prisma.product.upsert({
    where: { slug: "xiaomi-mi-smart-air-fryer" },
    update: { basePrice: 900000, images: JSON.stringify(["/uploads/products/ks-air-fryer.png"]), categoryId: smarthome.id },
    create: {
      name: "Xiaomi Mi Smart Air Fryer",
      slug: "xiaomi-mi-smart-air-fryer",
      description: `Kapasitas: ± 3.5 – 4 liter
Daya listrik: ± 1500 Watt
Rentang suhu: 40°C – 200°C
Timer: hingga 24 jam (bisa untuk fermentasi / dehidrasi ringan)
Kontrol: knob putar + layar OLED digital
Fitur pintar: Bisa terhubung ke aplikasi (Mi Home), Preset menu, Voice control
Fungsi: Air frying, Baking, Defrost, Reheat.`,
      basePrice: 900000,
      stock: 35,
      images: JSON.stringify(["/uploads/products/ks-air-fryer.png"]),
      categoryId: smarthome.id,
    }
  });

  // 2. Induction Cooker Lite
  const cooker = await prisma.product.upsert({
    where: { slug: "xiaomi-induction-cooker-lite" },
    update: { basePrice: 500000, images: JSON.stringify(["/uploads/products/ks-induction-cooker.png"]), categoryId: smarthome.id },
    create: {
      name: "Xiaomi Induction Cooker Lite",
      slug: "xiaomi-induction-cooker-lite",
      description: `Jenis: Electric hot pot / multi cooker
Kapasitas: ± 2 – 4 liter
Daya listrik: ± 1000 – 2100 Watt
Kontrol: tombol + knob putar
Material: coating anti lengket, Body plastik + metal
Fitur utama: Pengaturan suhu / level panas, Pemanasan merata
Cocok untuk: Rebus, tumis, hot pot, grill tipis.`,
      basePrice: 500000,
      stock: 40,
      images: JSON.stringify(["/uploads/products/ks-induction-cooker.png"]),
      categoryId: smarthome.id,
    }
  });

  // 3. Security Camera C200
  const camera = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-camera-c200" },
    update: { basePrice: 426000, images: JSON.stringify(["/uploads/products/ks-security-camera.png"]), categoryId: smarthome.id },
    create: {
      name: "Xiaomi Smart Camera C200",
      slug: "xiaomi-smart-camera-c200",
      description: `Resolusi: Full HD 1080p (2MP)
Sudut pandang: Horizontal 360° (pan), Vertikal 106° (tilt)
Night Vision: Infrared 940nm
Fitur Pintar: AI Human Detection, Auto Tracking, Notifikasi real-time, 2-Way Audio (Intercom)
Konektivitas: WiFi 2.4GHz
Penyimpanan: MicroSD sampai 256GB / Cloud storage.`,
      basePrice: 426000,
      stock: 80,
      images: JSON.stringify(["/uploads/products/ks-security-camera.png"]),
      categoryId: smarthome.id,
    }
  });

  // 4. Smart Doorbell (Teks kosong dari user, saya generate otomatis)
  const doorbell = await prisma.product.upsert({
    where: { slug: "xiaomi-smart-doorbell-3" },
    update: { basePrice: 1099000, images: JSON.stringify(["/uploads/products/ks-smart-doorbell.png"]), categoryId: smarthome.id },
    create: {
      name: "Xiaomi Smart Doorbell 3",
      slug: "xiaomi-smart-doorbell-3",
      description: `Resolusi: 2K Ultra Clear
Sudut pandang: Diagonal 180° ultra-wide
Night Vision: Advanced Infrared
Baterai: 5200mAh (hingga 4.8 bulan)
Fitur: Pemantauan real-time, Notifikasi gerakan pintu, 2-Way Audio, Perubahan suara cerdas.
Dilengkapi dengan Chime internal yang bervolume tinggi.`,
      basePrice: 1099000,
      stock: 25,
      images: JSON.stringify(["/uploads/products/ks-smart-doorbell.png"]),
      categoryId: smarthome.id,
    }
  });

  console.log("\n🎉 Produk Kitchen & Security Berhasil!");
  console.log(`  Air Fryer         : ${airfryer.id}`);
  console.log(`  Induction Cooker  : ${cooker.id}`);
  console.log(`  Security Camera   : ${camera.id}`);
  console.log(`  Smart Doorbell    : ${doorbell.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
