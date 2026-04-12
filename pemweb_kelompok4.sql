-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2026 at 09:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pemweb_kelompok4`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`) VALUES
('cmnw171if00011dfmyrg9ina8', 'cmne4g3tg000012al107h9tcw', 'oauth', 'google', '109277467084291055244', NULL, 'ya29.a0Aa7MYiovNbsHWxyTIRo8BNE9KzBskyJj4ev87YQ96GpKchmedzVLJmWQX8ipQxQWr821fZZ_aMyHDw-F7SfWDm1SVara_tcHnUFXGpS2ZSgh3HpkEIdB4IOX0EpjBYHp8J0BjFjQyG2e0J9eaQy_BtvpYJ98AOI8OM2GSHOyDZ7-mR3Tnn_LL8uXsX7DCKk7hKuT_t4aCgYKATYSARQSFQHGX2MiWd1waEOVH1g976xitttHoA0206', 1776018128, 'Bearer', 'https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile', 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImIzZDk1Yjk1ZmE0OGQxODBiODVmZmU4MDgyZmNmYTIxNzRiMDQ2NjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3OTM0MTY3NjY5ODUtc2NtOHRraWRmMWVpZmEzZDBjMjRuYWdkb3QzNjNyc3YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3OTM0MTY3NjY5ODUtc2NtOHRraWRmMWVpZmEzZDBjMjRuYWdkb3QzNjNyc3YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDkyNzc0NjcwODQyOTEwNTUyNDQiLCJlbWFpbCI6ImFuaW1laW5kMTlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJQS25rbGtEV2MyMTRBczREam9ObmZ3IiwibmFtZSI6IkJhZGFyIFJhaG1hbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMdHJ0cFM4dC10ZnVZeW9NM3lVaDF4Z3ZSWmdoQnJfa3FKaEY3NFh3b042ZUdQQXVBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkJhZGFyIiwiZmFtaWx5X25hbWUiOiJSYWhtYW4iLCJpYXQiOjE3NzYwMTQ1MzAsImV4cCI6MTc3NjAxODEzMH0.SEjnQ5PizRBhSZUAaeXt3V4PnSv3dieNCN5011YLhHZQK_9hDrBTfGXtiQfW76tP2wkw8ND2On7pMM6-HSB0qu3s8V9Oewd2nIlC376pfvVu9jB-V-Wx-sg52nKQqVk-1SXFM31aC1sPisBzjw-x9y5-9rEPPQJ2IP0ZzHhudyV2WHu2xcJOHG50xJzAtiSlhhuxm4Uzd3tWbDO3oUSMmLfDovnjf3sV2pXX_cQGQ5vrj5vnoskGqNx1kgUh-xdm0Ek4tIHLghhsiSJ7RLnu0fviTqoYIZrYCpozDnLaVZhvAeqN7ceBQaCj89nQ6I3cpEy4Qcd-9VBGtqsqZOU4wg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
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
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `total` decimal(15,2) NOT NULL,
  `status` enum('PENDING','PAID','SHIPPED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` varchar(191) DEFAULT NULL,
  `paymentId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `categoryId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `slug`, `description`, `price`, `stock`, `images`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('p1', 'Xiaomi 17 Ultra', 'xiaomi-17-ultra', 'Leica 200MP Professional Camera', 19999000.00, 50, '[\"📱\"]', 'cat_Phones_1', '2026-04-01 20:57:32.000', '2026-04-12 18:32:26.040'),
('p2', 'Xiaomi 17', 'xiaomi-17', 'Leica 50MP Camera Flagship', 14999000.00, 100, '[\"📱\"]', 'cat_Phones_1', '2026-04-01 20:57:32.000', '2026-04-12 18:32:32.408'),
('p3', 'Xiaomi Pad 8', 'xiaomi-pad-8', 'Large 144Hz AMOLED Display', 7199000.00, 30, '[\"💻\"]', 'cat_Tablets_2', '2026-04-01 20:57:32.000', '2026-04-12 18:32:42.283'),
('p4', 'Xiaomi Watch S5', 'xiaomi-watch-s5', 'Smart Health Tracking Wear OS', 4699000.00, 75, '[\"⌚\"]', 'cat_Tablets_2', '2026-04-01 20:57:32.000', '2026-04-12 18:33:10.268'),
('p8894', 'test111', 'test111', '1', 1000.00, 1, '[\"/uploads/products/neo-product-1776018884871-625726701.webp\"]', 'cat_HealthFitness_7', '2026-04-12 18:35:03.187', '2026-04-12 18:35:03.185');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `image` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `emailVerified` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `image`, `createdAt`, `updatedAt`, `emailVerified`) VALUES
('cmne4g3tg000012al107h9tcw', 'Dar', 'animeind19@gmail.com', '$2b$10$8ZTSTcDXUcmWDSGee9Np0eLohmOUIcWtDxnWNv5zKfOv.rYR9hLPi', 'ADMIN', '', '2026-03-31 04:33:20.212', '2026-04-12 19:30:07.643', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `verificationtoken`
--

CREATE TABLE `verificationtoken` (
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  ADD KEY `Account_userId_fkey` (`userId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_slug_key` (`slug`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  ADD KEY `Session_userId_fkey` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `verificationtoken`
--
ALTER TABLE `verificationtoken`
  ADD UNIQUE KEY `VerificationToken_token_key` (`token`),
  ADD UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
