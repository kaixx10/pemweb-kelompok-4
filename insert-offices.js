const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mencari kategori Lifestyle...");

  // Cari atau buat kategori Lifestyle
  let lifestyle = await prisma.category.findFirst({
    where: { slug: "lifestyle" }
  });

  if (!lifestyle) {
    lifestyle = await prisma.category.create({
      data: { id: "lifestyle", name: "Lifestyle", slug: "lifestyle" }
    });
  }

  console.log("📦 Memasukkan produk Offices...");

  // 1. Xiaomi Monitor A24i 2026
  const monitor = await prisma.product.upsert({
    where: { slug: "xiaomi-monitor-a24i-2026" },
    update: { basePrice: 1099000, images: JSON.stringify(["/uploads/products/office-monitor-a24i.png"]) },
    create: {
      name: "Xiaomi Monitor A24i 2026 (24 inci)",
      slug: "xiaomi-monitor-a24i-2026",
      description: `Ukuran layar: 23.8 inci
Resolusi: Full HD 1920 × 1080
Panel: IPS LCD
Refresh rate: 144Hz
Response time: 6ms
Brightness: 300 nits
Color gamut: 99% sRGB
Viewing angle: 178°
Port: HDMI, DisplayPort, DC IN
Mounting: VESA 75×75 mm
Desain: bezel tipis 3 sisi`,
      basePrice: 1099000,
      stock: 20,
      images: JSON.stringify(["/uploads/products/office-monitor-a24i.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 2. Xiaomi Router WiFi 6
  const router = await prisma.product.upsert({
    where: { slug: "xiaomi-router-wifi-6" },
    update: { basePrice: 564000, images: JSON.stringify(["/uploads/products/office-router-wifi6.png"]) },
    create: {
      name: "Xiaomi Router AX1500 WiFi 6",
      slug: "xiaomi-router-wifi-6",
      description: `Wi-Fi Standard: Wi-Fi 6 (802.11ax)
Kecepatan total: hingga 1501 Mbps
Antena: 4× high-gain external antenna
Port: 4× Gigabit Ethernet auto WAN/LAN
Mesh: Xiaomi Mesh support (hingga 10 perangkat)
Fitur: OFDMA, IPTV, gaming acceleration`,
      basePrice: 564000,
      stock: 35,
      images: JSON.stringify(["/uploads/products/office-router-wifi6.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 3. Mi WiFi Range Extender Pro
  const extender = await prisma.product.upsert({
    where: { slug: "mi-wifi-range-extender-pro" },
    update: { basePrice: 119000, images: JSON.stringify(["/uploads/products/office-extender-pro.png"]) },
    create: {
      name: "Mi WiFi Range Extender Pro",
      slug: "mi-wifi-range-extender-pro",
      description: `Kecepatan wireless: hingga 300 Mbps
Frekuensi: 2.4 GHz
Antena: 2 antena eksternal high gain
Jumlah perangkat: hingga 16 perangkat
Kontrol: Xiaomi Home App
Fitur: indikator sinyal, setup cepat`,
      basePrice: 119000,
      stock: 50,
      images: JSON.stringify(["/uploads/products/office-extender-pro.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 4. Xiaomi Selfie Stick Tripod
  const tripod = await prisma.product.upsert({
    where: { slug: "xiaomi-tripod-selfie-stick" },
    update: { basePrice: 229000, images: JSON.stringify(["/uploads/products/office-tripod-selfie.png"]) },
    create: {
      name: "Xiaomi Selfie Stick Tripod 2-in-1",
      slug: "xiaomi-tripod-selfie-stick",
      description: `Tipe: Selfie Stick + Tripod 2-in-1
Material: Aluminium alloy + ABS
Berat: ±155 gram
Panjang maksimal: ±52 cm
Koneksi: Bluetooth Low Energy
Fitur: Remote lepas-pasang, kaki tripod tersembunyi`,
      basePrice: 229000,
      stock: 100,
      images: JSON.stringify(["/uploads/products/office-tripod-selfie.png"]),
      categoryId: lifestyle.id,
    }
  });

  // 5. Xiaomi Pad 5 Pro
  const tablet = await prisma.product.upsert({
    where: { slug: "xiaomi-pad-5-pro" },
    update: { basePrice: 7149000, images: JSON.stringify(["/uploads/products/office-pad-5-pro.png"]) },
    create: {
      name: "Xiaomi Pad 5 Pro 11-inch",
      slug: "xiaomi-pad-5-pro",
      description: `Layar: 11 inci 120Hz, 2.5K
Chipset: Snapdragon 870 5G
RAM/Storage: 8GB/256GB
Baterai: 8600mAh, 67W Fast Charging
Speaker: 8 speaker stereo Dolby Atmos
Fitur: Stylus & Keyboard support`,
      basePrice: 7149000,
      stock: 10,
      images: JSON.stringify(["/uploads/products/office-pad-5-pro.png"]),
      categoryId: lifestyle.id,
    }
  });

  console.log("\n🎉 Produk Offices Berhasil!");
  console.log(`  Monitor    : ${monitor.id}`);
  console.log(`  Router     : ${router.id}`);
  console.log(`  Extender   : ${extender.id}`);
  console.log(`  Tripod     : ${tripod.id}`);
  console.log(`  Tablet     : ${tablet.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
