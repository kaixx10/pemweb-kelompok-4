// export { default } from "next-auth/middleware";

// export const config = {
//   // Tambahkan "/cart" di sini agar dikunci juga seperti "/payment"
//   matcher: ["/payment", "/cart"] 
// };
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/payment", "/cart"],
};