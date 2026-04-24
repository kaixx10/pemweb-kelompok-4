"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Custom type based on your schema to ensure correct inputs
interface ProductInput {
  id: string; // The user will input an ID like 'p5'
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string; // Stored as a JSON string like '["📱"]'
  categoryId: string; // Must match an existing Category ID
}

/**
 * Utility: Mencegah pengguna biasa (USER) melakukan aksi ADMIN
 */
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Anda harus login terlebih dahulu.");
  }
  
  if ((session.user as any).role !== "ADMIN") {
    throw new Error("Akses ditolak! Hanya Admin yang boleh melakukan aksi ini.");
  }
}

/**
 * CREATE PRODUCT
 * Fungsi untuk memasukkan barang baru ke MySQL
 */
export async function createProduct(data: ProductInput) {
  try {
    // 1. Gembok Keamanan (Hanya ADMIN)
    await checkAdmin();

    // 2. Eksekusi ke Database MySQL
    const newProduct = await prisma.product.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.price, // Prisma will handle Number to Decimal conversion
        stock: data.stock,
        images: data.images,
        categoryId: data.categoryId,
        updatedAt: new Date(),
      },
    });

    // 3. Revalidasi halaman agar katalog otomatis tampil barang baru
    revalidatePath("/");
    
    return { success: true, data: newProduct };
  } catch (error: any) {
    console.error("Gagal menambahkan produk:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * UPDATE PRODUCT
 * Fungsi untuk mengubah data barang yang sudah ada
 */
export async function updateProduct(id: string, data: Partial<ProductInput>) {
  try {
    // 1. Gembok Keamanan (Hanya ADMIN)
    await checkAdmin();

    // 2. Eksekusi ke Database MySQL (Update berdasarkan ID)
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // 3. Revalidasi halaman
    revalidatePath("/");
    revalidatePath("/admin/products"); // Rute masa depan untuk dashboard admin

    return { success: true, data: updatedProduct };
  } catch (error: any) {
    console.error("Gagal mengupdate produk:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * DELETE PRODUCT
 * Fungsi untuk menghapus barang permanen dari MySQL
 */
export async function deleteProduct(id: string) {
  try {
    // 1. Gembok Keamanan (Hanya ADMIN)
    await checkAdmin();

    // 2. Eksekusi ke Database MySQL (Hapus berdasarkan ID)
    await prisma.product.delete({
      where: { id: id },
    });

    // 3. Revalidasi halaman
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true, message: "Produk berhasil dihapus." };
  } catch (error: any) {
    console.error("Gagal menghapus produk:", error);
    return { success: false, error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * GET CATEGORIES
 * Fungsi untuk mengambil semua kategori untuk dropdown form
 */
export async function getCategories() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    // AUTO-SEED: Pastikan kategori dari screenshot ada di database
    const xiaomiCategories = [
      "Smart Watches", "Phones", "Tablets", "Chargings", "Outdoors", 
      "Offices", "Personal Care", "Health & Fitness", "Tools", 
      "TVs & HA", "Vacuum Cleaners", "Environment", "Kitchen & Sec"
    ];

    let categoriesAdded = false;
    for (let i = 0; i < xiaomiCategories.length; i++) {
      const catName = xiaomiCategories[i];
      const exists = categories.find(c => c.name === catName);
      if (!exists) {
        await prisma.category.create({
          data: {
            id: `cat_${catName.replace(/[^a-zA-Z0-9]/g, '')}_${i}`,
            name: catName,
            slug: catName.toLowerCase().replace(/ & /g, '-').replace(/[^a-z0-9]+/g, '-')
          }
        });
        categoriesAdded = true;
      }
    }

    if (categoriesAdded) {
      categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
    }

    return { success: true, data: categories };
  } catch (error: any) {
    console.error("Gagal mengambil kategori:", error);
    return { success: false, error: error.message || "Gagal memuat kategori." };
  }
}

/**
 * GET SINGLE PRODUCT
 * Fungsi untuk mengambil satu produk beserta ID untuk form Edit
 */
export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) throw new Error("Produk tidak ditemukan");
    const safeProduct = {
      ...product,
      basePrice: Number(product.basePrice)
    };
    return { success: true, data: safeProduct };
  } catch (error: any) {
    console.error("Gagal mengambil produk:", error);
    return { success: false, error: error.message || "Gagal memuat produk." };
  }
}

/// Fungsi khusus untuk menyimpan produk yang memiliki varian
export async function createProductWithVariants(formData: any, variants: any[]) {
  try {
    await checkAdmin();

    const product = await prisma.product.create({
      data: {
        id: formData.id || `p${Date.now()}`,
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        images: formData.images,
        
        categoryId: formData.categoryId || formData.category,
        stock: Number(formData.stock || 0),
        
        basePrice: Number(formData.price || formData.basePrice || 0),
        
        variants: {
          create: variants.map((v: any) => ({
            color: v.color,
            storage: v.storage,
            price: Number(v.price || 0)
          }))
        }
      }
    });
    
    // BERSIHKAN DECIMAL SEBELUM DIKIRIM KE CLIENT
    const plainProduct = {
      ...product,
      basePrice: Number(product.basePrice)
    };
    
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, product: plainProduct };
  } catch (error: any) {
    console.error("Error Create Varian:", error);
    return { success: false, error: error.message || "Gagal menyimpan produk." };
  }
}

// Fungsi untuk mengambil data produk BESERTA variannya untuk halaman Edit
export async function getProductWithVariants(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true } 
    });
    
    if (!product) throw new Error("Produk tidak ditemukan");
    
    // BERSIHKAN DECIMAL SEBELUM DIKIRIM KE CLIENT
    const safeProduct = {
      ...product,
      basePrice: Number(product.basePrice), // <- Ini yang menghilangkan Error
      price: Number((product as any).basePrice || 0), 
      categoryId: (product as any).categoryId,
      variants: product.variants?.map((v: any) => ({
        ...v,
        price: Number(v.price) // <- Bersihkan Decimal di Varian juga
      })) || []
    };
    
    return { success: true, data: safeProduct };
  } catch (error: any) {
    console.error("Error Get Varian:", error);
    return { success: false, error: error.message };
  }
}

// Fungsi untuk menyimpan perubahan data Edit
export async function updateProductWithVariants(id: string, formData: any, variants: any[]) {
  try {
    await checkAdmin();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
        images: formData.images,
        
        categoryId: formData.categoryId || formData.category,
        stock: Number(formData.stock || 0),
        
        basePrice: Number(formData.price || formData.basePrice || 0),
        
        variants: {
          deleteMany: {}, 
          create: variants.map((v: any) => ({
            color: v.color,
            storage: v.storage,
            price: Number(v.price || 0) 
          }))
        }
      }
    });
    
    // BERSIHKAN DECIMAL SEBELUM DIKIRIM KE CLIENT
    const plainProduct = {
      ...product,
      basePrice: Number(product.basePrice)
    };
    
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, product: plainProduct };
  } catch (error: any) {
    console.error("Error Update Varian:", error);
    return { success: false, error: error.message || "Gagal memperbarui produk" };
  }
}