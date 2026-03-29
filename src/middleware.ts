export { default } from "next-auth/middleware";

export const config = {
  // Tambahkan "/cart" di sini agar dikunci juga seperti "/payment"
  matcher: ["/payment", "/cart"] 
};