import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
// Tambahkan Sharp untuk auto-convert WebP
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // KITA MATIKAN SEMENTARA JALUR CLOUDINARY SESUAI PERMINTAAN
    /*
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    ... upload stream ...
    */

    // --- JALUR LOKAL + WEBP CONVERTER ---

    // 1. Siapkan folder tujuan di dalam public/uploads/products
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    
    // Auto-create folder jika belum ada (Biar gak error di PC lokal)
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 2. Buat nama file unik berakhiran .webp
    const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `neo-product-${uniqueId}.webp`;
    const finalFilePath = path.join(uploadDir, filename);

    // 3. Konversi gambar memakai 'sharp' (kualitas 80, ubah ke webp, resize maks 800px)
    await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true }) // Mencegah gambar kecil dipaksa besar 
      .webp({ quality: 80 }) // Super kompresi tanpa mengurangi mata keranjang pembeli
      .toFile(finalFilePath);

    // 4. Return URL Relatif untuk web (Ini jalan mulus tanpa Cloudinary)
    const localUrl = `/uploads/products/${filename}`;

    return NextResponse.json({ success: true, url: localUrl }, { status: 200 });

  } catch (error: any) {
    console.error("Error upload file (Lokal/WebP):", error);
    return NextResponse.json({ 
      error: "Gagal memproses gambar. Pastikan module 'sharp' terinstall. Detail: " + (error.message || JSON.stringify(error)) 
    }, { status: 500 });
  }
}

