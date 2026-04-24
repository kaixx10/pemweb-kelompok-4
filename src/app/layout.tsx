import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Import komponen UI dan Auth
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import AuthModal from "@/components/auth/AuthModal";
import CartSync from "@/components/CartSync";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neo Store | Smartphone & Gadget Kekinian Terlengkap",
  description: "Belanja produk elektronik, smartphone, wearable, dan gadget original dengan garansi resmi dan pengiriman gratis se-Indonesia hanya di Neo Store.",
  openGraph: {
    title: "Neo Store | Smartphone & Gadget Kekinian",
    description: "Nikmati pengalaman berbelanja gadget dengan antarmuka Bento UI modern. Temukan Poco, Redmi, dan Xiaomi edisi terbaru di sini!",
    type: "website",
    locale: "id_ID",
    siteName: "Neo Store Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Bungkus seluruh aplikasi dengan Providers */}
        <Providers>
          <CartSync />
          <Navbar />
          <AuthModal />
          {/* Children adalah isi halaman web kita (seperti Hero, ProductGrid, dll) */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}