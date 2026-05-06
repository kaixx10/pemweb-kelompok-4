const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Mengambil data ID produk dari database...");
  const products = await prisma.product.findMany();
  const idMap = {};
  products.forEach(p => { idMap[p.slug] = p.id; });

  const navbarPath = path.join(__dirname, 'src', 'components', 'layout', 'Navbar.tsx');
  let content = fs.readFileSync(navbarPath, 'utf-8');

  console.log("✏️ Memperbarui Navbar.tsx secara otomatis...");

  function rep(text, slug, hasNewBadge = false, justify = false) {
    const id = idMap[slug];
    if (!id) {
        console.log(`⚠️ Produk ${slug} tidak ditemukan!`);
        return;
    }
    
    let search = `<li className="hover:text-black cursor-pointer`;
    if (justify || hasNewBadge) search += ` flex justify-between`;
    search += ` hover:translate-x-1 transition-transform">${text}`;
    if (hasNewBadge) search += ` <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span>`;
    search += `</li>`;
    
    let replacement = `<li onClick={() => { setActiveMenu(null); router.push('/?view_product=${id}'); }} className="hover:text-black cursor-pointer`;
    if (justify || hasNewBadge) replacement += ` flex justify-between`;
    replacement += ` hover:translate-x-1 transition-transform">${text}`;
    if (hasNewBadge) replacement += ` <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span>`;
    replacement += `</li>`;

    content = content.replace(search, replacement);
  }

  // ==== TVs & HA ====
  rep("TV Boxes/Sticks", "xiaomi-mi-tv-stick", true);
  rep("Projectors", "xiaomi-smart-projector-l1", false);
  content = content.replace(
    /<li onClick={\(\) => \{ setActiveMenu\(null\); router.push\('\/\?view_product=p316'\); \}\} className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Refrigerators <span className="text-gray-800 text-\[9px\] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU<\/span><\/li>/, 
    `<li onClick={() => { setActiveMenu(null); router.push('/?view_product=${idMap["xiaomi-mijia-refrigerator-510l"]}'); }} className="hover:text-black cursor-pointer flex justify-between hover:translate-x-1 transition-transform">Refrigerators <span className="text-gray-800 text-[9px] bg-gray-100 px-1 rounded font-bold border border-gray-300">BARU</span></li>`
  );
  rep("Washing Machines", "mijia-front-load-washer-10-5kg", false);
  
  // ==== Vacuum Cleaners ====
  rep("Robot Vacuums", "xiaomi-robot-vacuum-h50", false);
  rep("Handheld Vacuums", "xiaomi-mijia-k10-pro-filter", false);
  rep("Wet Dry Vacuums", "xiaomi-truclean-w20", false);
  rep("Accessories", "xiaomi-vacuum-essential-accessories", true); // Vacuum Accessories
  
  // ==== Environment ====
  rep("Air Purifiers", "xiaomi-smart-air-purifier-4-compact", false);
  rep("Dehumidifiers", "xiaomi-smart-dehumidifier-lite", false);
  rep("Monitors", "xiaomi-curved-gaming-monitor-g34wqi", false);
  // Environment Accessories
  content = content.replace(
    /<li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Accessories<\/li>/,
    `<li onClick={() => { setActiveMenu(null); router.push('/?view_product=${idMap["xiaomi-smart-air-purifier-4-lite-filter"]}'); }} className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Accessories</li>`
  );
  
  // ==== Kitchen & Sec ====
  rep("Security Cameras", "xiaomi-smart-camera-c200", true);
  rep("Smart Doorbells", "xiaomi-smart-doorbell-3", false);
  rep("Air Fryers", "xiaomi-mi-smart-air-fryer", false);
  rep("Induction Cookers", "xiaomi-induction-cooker-lite", false);

  fs.writeFileSync(navbarPath, content, 'utf-8');
  console.log("✅ SELESAI! Semua menu di kategori Smart Home sekarang sudah bisa diklik dan terhubung ke produknya!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
