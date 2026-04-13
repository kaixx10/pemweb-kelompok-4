-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 13 Apr 2026 pada 04.43
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `pemweb_kelompok4`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `account`
--

CREATE TABLE `account` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerAccountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `access_token` text COLLATE utf8mb4_unicode_ci,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` text COLLATE utf8mb4_unicode_ci,
  `session_state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `category`
--

CREATE TABLE `category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `category`
--

INSERT INTO `category` (`id`, `name`, `slug`) VALUES
('cat_Chargings_3', 'Chargings', 'chargings'),
('cat_Environment_11', 'Environment', 'environment'),
('cat_HealthFitness_7', 'Health & Fitness', 'health-fitness'),
('cat_KitchenSec_12', 'Kitchen & Sec', 'kitchen-sec'),
('cat_Offices_5', 'Offices', 'offices'),
('cat_Outdoors_4', 'Outdoors', 'outdoors'),
('cat_PersonalCare_6', 'Personal Care', 'personal-care'),
('cat_Phones_1', 'Phones', 'phones'),
('cat_SmartWatches_0', 'Smart Watches', 'smart-watches'),
('cat_Tablets_2', 'Tablets', 'tablets'),
('cat_Tools_8', 'Tools', 'tools'),
('cat_TVsHA_9', 'TVs & HA', 'tvs-ha'),
('cat_VacuumCleaners_10', 'Vacuum Cleaners', 'vacuum-cleaners');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order`
--

CREATE TABLE `order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` decimal(15,2) NOT NULL,
  `status` enum('PENDING','PAID','SHIPPED','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE `product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `basePrice` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `images` text COLLATE utf8mb4_unicode_ci,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `basePrice`, `stock`, `images`, `categoryId`, `slug`, `createdAt`, `updatedAt`) VALUES
('p178', 'Xiaomi Mi Pad 8', '11.2\" 3.2K 144Hz display with Dolby Vision®\nSnapdragon® 8s Gen 4 Mobile Platform\n9,200mAh (typ) battery with 45W turbo charging\nQuad speakers with Dolby Atmos®', 7499000.00, 50, '[\"/uploads/products/neo-product-1776052607121-659425259.webp\"]', 'cat_Tablets_2', 'xiaomi-mi-pad-8', '2026-04-13 03:58:32.315', '2026-04-13 03:58:43.257'),
('p1823', 'REDMI A7 Pro', 'Immersive 6.9\" display\nMassive 6000mAh battery', 1649000.00, 50, '[\"/uploads/products/neo-product-1776050209703-897195172.webp\"]', 'cat_Phones_1', 'redmi-a7-pro', '2026-04-13 03:25:38.790', '2026-04-13 03:42:18.761'),
('p1921', 'Xiaomi 17 Ultra', 'Light Fusion 1050L 50MP LOFIC HDR main sensor\n200MP periscope telephoto lens with 75-100mm optical zoom', 19999000.00, 50, '[\"/uploads/products/neo-product-1776051074818-257222761.webp\"]', 'cat_Phones_1', 'xiaomi-17-ultra', '2026-04-13 03:41:14.770', '2026-04-13 03:42:01.659'),
('p220', 'POCO C85', 'Massive 6000mAh (typ) battery\nImmersive 6.9\" display', 1699000.00, 50, '[\"/uploads/products/neo-product-1776054940909-513469930.webp\"]', 'cat_Chargings_3', 'poco-c85', '2026-04-13 04:39:42.517', '2026-04-13 04:39:42.517'),
('p2290', 'Xiaomi 15T Pro', 'Leica Summilux optical lens\n6.83\" 144Hz eye-care display', 10399000.00, 50, '[\"/uploads/products/neo-product-1776053817229-827613014.webp\"]', 'cat_Phones_1', 'xiaomi-15t-pro', '2026-04-13 04:16:59.759', '2026-04-13 04:16:59.759'),
('p2898', 'Xiaomi Watch S4 41mm', '41mm AMOLED display with a slim, elegant design', 1994000.00, 50, '[\"/uploads/products/neo-product-1776054216337-191000896.webp\"]', 'cat_Chargings_3', 'xiaomi-watch-s4-41mm', '2026-04-13 04:25:23.785', '2026-04-13 04:25:34.599'),
('p316', 'Mijia Refrigerator Side', '635L total capacity with ultra-slim design\nAg+ Silver Ion antibacterial & deodorizing technology\nDual Inverter cooling system with Triple-Layer Multi-Airflow\nSmart control via Xiaomi Home App', 7499000.00, 50, '[\"/uploads/products/neo-product-1776052829830-336730713.webp\"]', 'cat_KitchenSec_12', 'mijia-refrigerator-side', '2026-04-13 04:01:11.522', '2026-04-13 04:01:11.522'),
('p3341', 'Xiaomi 17', 'Light Fusion 950 high dynamic sensor\n6330mAh (typ) Xiaomi Surge Battery', 16999000.00, 50, '[\"/uploads/products/neo-product-1776053218365-355376790.webp\"]', 'cat_Phones_1', 'xiaomi-17', '2026-04-13 04:10:49.890', '2026-04-13 04:10:49.890'),
('p5148', 'REDMI Buds 8 Active', 'Semi-in-ear design / 14.2mm driver / Clear calls with dual-mics', 299000.00, 50, '[\"/uploads/products/neo-product-1776051914100-646660617.webp\"]', 'cat_Tools_8', 'redmi-buds-8-active', '2026-04-13 03:48:08.277', '2026-04-13 03:48:08.277'),
('p7342', 'Mi Precision Screwdriver', '24 precision bit set made of high-strength S2 steel\nMagnetic bit holder with ergonomic anti-slip rotating cap\nAluminum alloy storage case with integrated bit slots', 269000.00, 50, '[\"/uploads/products/neo-product-1776052965061-728327902.webp\"]', 'cat_Tools_8', 'mi-precision-screwdriver', '2026-04-13 04:04:24.375', '2026-04-13 04:04:24.375'),
('p8172', 'Xiaomi TV A 43 FHD 2026', 'Full HD (1920 x 1080) display with 60Hz refresh rate and 178° wide viewing angle\n2x10W speakers with Dolby Audio, DTS:X, DTS Virtual:X\nGoogle TV OS with built-in Google Assistant and Google Cast', 7999000.00, 50, '[\"/uploads/products/neo-product-1776052289009-52780260.webp\"]', 'cat_TVsHA_9', 'xiaomi-tv-a-43-fhd-2026', '2026-04-13 03:52:57.611', '2026-04-13 03:55:09.375');

-- --------------------------------------------------------

--
-- Struktur dari tabel `productvariant`
--

CREATE TABLE `productvariant` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(65,30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `productvariant`
--

INSERT INTO `productvariant` (`id`, `productId`, `color`, `storage`, `price`) VALUES
('cmnwnc723000qh9ythyw567ib', 'p1921', 'White', '16/512GB', 19999000.000000000000000000000000000000),
('cmnwnc723000rh9ytwcmcrrf4', 'p1921', 'White 2', '16/1TB', 22999000.000000000000000000000000000000),
('cmnwnc723000sh9yt5ri8iump', 'p1921', 'Black', '16/512GB', 19999000.000000000000000000000000000000),
('cmnwnc723000th9yt4wm24lrn', 'p1921', 'Black 2', '16/1TB', 22999000.000000000000000000000000000000),
('cmnwnc723000uh9ytkh4ozgz8', 'p1921', 'Starlit Green', '16/512GB', 19999000.000000000000000000000000000000),
('cmnwnc723000vh9yt0cyluzzt', 'p1921', 'Starlit Green 2', '16/1TB', 22998000.000000000000000000000000000000),
('cmnwnck96000wh9ytsn3mc0er', 'p1823', 'Palm Green', '4/128GB', 1799000.000000000000000000000000000000),
('cmnwnck96000xh9ytp7ckvudf', 'p1823', 'Palm Green 2', '4/64GB', 1649000.000000000000000000000000000000),
('cmnwnck96000yh9ytv6p85ewk', 'p1823', 'Sunset Orange', '4/128GB', 1799000.000000000000000000000000000000),
('cmnwnck96000zh9ytonny42sz', 'p1823', 'Sunset Orange 2', '4/64GB', 1649000.000000000000000000000000000000),
('cmnwnck960010h9yt9sk0cl82', 'p1823', 'Mist Blue', '4/128GB', 1799000.000000000000000000000000000000),
('cmnwnck960011h9ytk47266tj', 'p1823', 'Mist Blue 2', '4/64GB', 1649000.000000000000000000000000000000),
('cmnwnck960012h9ytz7smv5zf', 'p1823', 'Black', '4/128GB', 1799000.000000000000000000000000000000),
('cmnwnck960013h9yt9a7trqco', 'p1823', 'Black 2', '4/64GB', 1649000.000000000000000000000000000000),
('cmnwnk1yx0014h9yt6gk7ryxo', 'p5148', 'Black', '', 299000.000000000000000000000000000000),
('cmnwnk1yx0015h9yt3ov1ffos', 'p5148', 'White', '', 299000.000000000000000000000000000000),
('cmnwnk1yx0016h9ytof8xgwn5', 'p5148', 'Blue', '', 299000.000000000000000000000000000000),
('cmnwnxnw9001ah9yth2u8q2u2', 'p178', 'Pine Green', '8/256GB', 7499000.000000000000000000000000000000),
('cmnwnxnw9001bh9ytenswqmpq', 'p178', 'Blue', '8/256GB', 7499000.000000000000000000000000000000),
('cmnwnxnw9001ch9ytq3u4nysz', 'p178', 'Gray', '8/256GB', 7499000.000000000000000000000000000000),
('cmnwod8l0001dh9yt6ht8sj70', 'p3341', 'Alpine Pink', '12/512GB', 16999000.000000000000000000000000000000),
('cmnwod8l0001eh9yty772z75l', 'p3341', ' Ice Blue', '12/512GB', 16999000.000000000000000000000000000000),
('cmnwod8l0001fh9ytpuckjlnb', 'p3341', 'Black', '12/512GB', 16999000.000000000000000000000000000000),
('cmnwod8l0001gh9ytopb88tfj', 'p3341', 'Venture Green', '12/512GB', 16998000.000000000000000000000000000000),
('cmnwol5yv001hh9ytw0qzcee7', 'p2290', 'Black', '12/512GB', 10399000.000000000000000000000000000000),
('cmnwol5yv001ih9ytp6z9cs98', 'p2290', 'Black 2', '12/1TB', 11499000.000000000000000000000000000000),
('cmnwol5yv001jh9ytchdpqte6', 'p2290', 'Gray', '12/512GB', 10399000.000000000000000000000000000000),
('cmnwol5yw001kh9yt4dt9dn9u', 'p2290', 'Gray 2', '12/1TB', 11499000.000000000000000000000000000000),
('cmnwol5yw001lh9ytjv1j7p2k', 'p2290', 'Mocha Gold', '12/512GB', 10399000.000000000000000000000000000000),
('cmnwol5yw001mh9ytk9nfpr9m', 'p2290', 'Mocha Gold 2', '12/1TB', 11499000.000000000000000000000000000000),
('cmnwow77r001rh9yt2rj02ilm', 'p2898', 'Sunset gold', '', 1994000.000000000000000000000000000000),
('cmnwow77r001sh9ytmqwkikgc', 'p2898', 'Black', '', 1994000.000000000000000000000000000000),
('cmnwow77r001th9yt32h9clhj', 'p2898', 'Mint green', '', 1992000.000000000000000000000000000000),
('cmnwow77r001uh9ytd9io3j30', 'p2898', 'White', '', 1992000.000000000000000000000000000000),
('cmnwpedh8001vh9ytkliw163f', 'p220', 'Black', '6/128GB', 1697000.000000000000000000000000000000),
('cmnwpedh8001wh9yt59wbyxf4', 'p220', 'Black 2', '8/256GB', 1999000.000000000000000000000000000000),
('cmnwpedh8001xh9yt7qa91lo7', 'p220', 'Purple', '6/128GB', 1697000.000000000000000000000000000000),
('cmnwpedh8001yh9yt8hg7pm83', 'p220', 'Purple 2', '8/256GB', 1999000.000000000000000000000000000000),
('cmnwpedh8001zh9ytv4a39oiy', 'p220', 'Green', '6/128GB', 1695000.000000000000000000000000000000),
('cmnwpedh80020h9ytgi85kjdf', 'p220', 'Green 2', '8/256GB', 1999000.000000000000000000000000000000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `session`
--

CREATE TABLE `session` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionToken` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `image`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('cmnwgmiza0000v8bcbx7wv763', 'kai', 'kai@gmail.com', NULL, NULL, '$2b$10$xeNeqTlVdrI68BeW2rtOM.kfXU1yzPoeMPH/l90iKMkX/eCSpJCpG', 'ADMIN', '2026-04-13 00:34:06.359', '2026-04-13 00:34:06.359');

-- --------------------------------------------------------

--
-- Struktur dari tabel `verificationtoken`
--

CREATE TABLE `verificationtoken` (
  `identifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  ADD KEY `Account_userId_fkey` (`userId`);

--
-- Indeks untuk tabel `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indeks untuk tabel `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indeks untuk tabel `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Indeks untuk tabel `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_slug_key` (`slug`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indeks untuk tabel `productvariant`
--
ALTER TABLE `productvariant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductVariant_productId_fkey` (`productId`);

--
-- Indeks untuk tabel `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  ADD KEY `Session_userId_fkey` (`userId`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indeks untuk tabel `verificationtoken`
--
ALTER TABLE `verificationtoken`
  ADD UNIQUE KEY `VerificationToken_token_key` (`token`),
  ADD UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `productvariant`
--
ALTER TABLE `productvariant`
  ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
