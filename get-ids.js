const { PrismaClient } = require('./node_modules/@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  const data = products.map(p => ({ slug: p.slug, id: p.id }));
  fs.writeFileSync('C:\\xampp\\htdocs\\pemweb-kelompok-4\\all-ids.json', JSON.stringify(data, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
