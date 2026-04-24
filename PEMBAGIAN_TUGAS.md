# Rencana Penyelesaian Proyek: Neo Store
Daftar seluruh kekurangan dan pembagian tugas untuk 5 anggota kelompok (A, B, C, D, E).

> [!IMPORTANT]
> **Definisi Selesai (Definition of Done)**: Proyek dianggap "Cukup Bagus/Realistis" apabila pengguna bisa mendaftar, melihat katalog nyata dari database, menambahkan ke keranjang dengan *session* yang aman, melakukan *checkout*, dan Admin dapat memonitor atau menambah barang tersebut.

## Kekurangan Proyek Saat Ini (The Backlog)
Sebelum membagi tugas, berikut adalah daftar fitur esensial dari sebuah *e-commerce* yang **belum** ada di Neo Store saat ini:
1. **Database & ORM:** Skema MySQL dan Prisma belum ada (Tabel User, Produk, Kategori, Tranksasi).
2. **Autentikasi (Login/Register):** Perlindungan akun pengguna dan pemisahan hak akses antara Pembeli dan Admin.
3. **Katalog Dinamis:** Halaman detail produk tunggal (`/product/[id]`) dan halaman filter kategori berdasarkan database.
4. **Checkout & Gateway Pembayaran:** Sistem pengolahan tagihan sungguhan dan integrasi API Pembayaran (contoh: Midtrans).
5. **Dashboard Admin:** Antarmuka khusus untuk Pemilik Toko (CRUD Produk dan pantau pemesanan).

---

## Pembagian Kerja (Job Desk) per Sprint/Part

Berikut adalah pembagian tugas ke dalam 4 *Part* (Tahap/Sprint) agar semua orang punya porsi *Front-End* maupun *Back-End* (Mull Stack) yang seimbang.

### Part 1: Pondasi Database & Autentikasi User
Fokus tahap ini adalah menyiapkan sistem pendaftaran dan memastikan mesin basis data bisa dihubungkan ke Next.js.

| Status | Anggota | Tugas Spesifik (Job Desk) | Output yang Diharapkan |
| :---: | :---: | :--- | :--- |
| ✅ **SELESAI** | **A** | Mendesain Skema Database (Prisma) | File `schema.prisma` dengan tabel User, Product, Category, Order yang berelasi sempurna. |
| ✅ **SELESAI** | **B** | Sistem Login & Registrasi | Form authentikasi dengan **NextAuth.js** lengkap dengan keamanan *password hashing*. |
| ✅ **SELESAI** | **C** | Manajemen Penyimpanan Gambar | *Setup* Cloudinary / AWS S3 agar gambar produk bisa di-*upload* ke *cloud*, bukan folder lokal. |
| ✅ **SELESAI** | **D** | Kerangka Dashboard Admin | Membuat *layout* kosong (Sidebar & Header) khusus rute `/admin` yang terproteksi (hanya admin yang bisa akses). |
| ✅ **SELESAI** | **E** | Migrasi Homepage ke Database | Menyambungkan data *mockup dummy* ganti menjadi data *fetch* langsung dari Prisma (API Read). |

### Part 2: Katalog Dinamis & Search Engine
Fokus tahap ini adalah mengolah produk tunggal dan memfungsikan fitur pencarian serta navigasi kategori.

| Status | Anggota | Tugas Spesifik (Job Desk) | Output yang Diharapkan |
| :---: | :---: | :--- | :--- |
| ✅ **SELESAI** | **A** | API CRUD Database Produk | Membuat *Server Actions* / API endpoint untuk *Create, Read, Update, Delete* produk dan relasinya. |
| ✅ **SELESAI** | **B** | Form Tambah/Edit Produk Admin | Membuat antarmuka form pengisian spesifikasi HP dan unggah foto produk di dashboard admin. |
| ✅ **SELESAI** | **C** | Halaman Detail Produk User | Membangun UI Quick View Modal di beranda yang menampilkan deskripsi utuh, gambar raksasa, dan tombol *Cart* (tanpa rute penuh). |
| ✅ **SELESAI** | **D** | Algoritma *Search* & *Sort* | Memfungsikan kolom pencarian (*Search Bar*) di Navbar & fitur urutkan harga (Termahal/Termurah). |
| ✅ **SELESAI** | **E** | Halaman Kategori & Relasinya | Memfungsikan rute `/mobile`, `/wearables` agar hanya menampilkan daftar tipe barang terkait secara dinamis. |

### Part 3: Migrasi Keranjang & Struktur Order (Logistik)
*Cart* yang dikerjakan saat ini murni UI lokal (Zustand). Di tahap ini, keranjang akan disatukan dengan sistem akun (*user session*) dan menghasilkan "Nomor Tagihan".

| Status | Anggota | Tugas Spesifik (Job Desk) | Output yang Diharapkan |
| :---: | :---: | :--- | :--- |
| ✅ **SELESAI** | **A** | Database Keranjang & Sinkronisasi | Mengecek apakah *cart Zustand* saat *log in* bisa tersinkron ke tabel *Cart* di database secara permanen. |
| ✅ **SELESAI** | **B** | Halaman Alamat & Review Order | Membuat UI form pengisian alamat pengiriman dan Ringkasan Total Harga Netto di tahap Checkout. |
| ✅ **SELESAI** | **C** | Struktur Transaksi (Backend) | Menulis logika saat "Klik Pesan" mencetak struk di tabel *Orders* & mengosongkan keranjang si User. |
| ✅ **SELESAI** | **D** | Lacak Pesanan (Halaman User) | Membuat halaman "Pesanan Saya" untuk pembeli, agar pembeli bisa melihat status barang (Diproses/Dikirim). |
| ✅ **SELESAI** | **E** | Manajemen Order (Halaman Admin) | Halaman dasbor khusus si Bos Toko untuk melihat pesanan masuk & menekan tombol "Resi Dikirim". |

### Part 4: Integrasi Pembayaran nyata & Polishing (Finalisasi)
Tahap kelulusan situs, menghubungkan uang sungguhan/simulasi.

| Status | Anggota | Tugas Spesifik (Job Desk) | Output yang Diharapkan |
| :---: | :---: | :--- | :--- |
| ⏳ *BELUM*  | **A** | Setup API Payment Gateway | Memasang modul Midtrans SNAP (Simulasi Kartu Kredit/GoPay/BCA Virtual Account). |
| ⏳ *BELUM*  | **B** | Respon Webhook Midtrans | Membuat API penerima konfirmasi agar status *Order* otomatis berubah jadi "Lunas" bila Midtrans sukses ditekan pembeli. |
| ⏳ *BELUM*  | **C** | Fitur Rating & Review | Membuat form ulasan bintang (1-5) jika status order sudah "Barang Diterima". |
| ⏳ *BELUM*  | **D** | Optimalisasi Performa (SEO/Speed) | Mengatur struktur gambar pakai `<Image>` bawaan Next, mengecek responsivitas ukuran HP, menambah Metadata per-HP. |
| ⏳ *BELUM*  | **E** | Penanggung Jawab Deployment | Memastikan kode proyek naik ke Vercel dengan *environment variables* yang benar dan database terhubung tanpa *error 500*. |

> [!TIP]
> **Kenapa dibagi begini?** Karena di dunia kerja nyata (sistem *Agile*), setiap orang berhak menyentuh *Frontend* maupun *Backend*. Memecah pekerjaan berdasarkan alur logika aplikasi (*Sprint*) akan melatih kelima anggota kelompok (A,B,C,D,E) untuk bisa membangun pondasi *full-stack* secara rata, alih-alih mengeksploitasi 1 orang hanya mengurus CSS.
