"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { getCartFromDB, syncCartToDB } from "@/app/actions/dbCartAction";

export default function CartSync() {
  const { status } = useSession();
  const items = useCartStore((state) => state.items);
  const isInitialLoad = useRef(true);
  const prevStatus = useRef(status);

  // 1. Saat *User* berhasil LOGIN pertama kali di sesi ini
  useEffect(() => {
    if (status === "authenticated") {
      getCartFromDB().then((res) => {
        if (res.success && res.items) {
           const localCartStore = useCartStore.getState();
           
           // Jika di laptop ini keranjangnya kosong, sedot keranjang yg ada di awan/MySQL
           if (localCartStore.items.length === 0 && res.items.length > 0) {
              // Tembakkan perlahan ke Zustand via loop addToCart atau reset paksa
              // Disini kita gunakan addToCart
              localCartStore.emptyCart();
              res.items.forEach((item: any) => localCartStore.addToCart(item));
           } else if (localCartStore.items.length > 0) {
              // Jika User sebelumnya iseng nabung barang tanpa login, lalu dia login,
              // timpa rekam jejak awan dengan barang-barang lokal ini!
              syncCartToDB(localCartStore.items);
           }
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // 2. Pemantau (Observer) Perubahan Keranjang
  // Kapanpun tombol +, -, atau Delete ditekan (Zustand berubah), lapor ke MySQL secara senyap.
  useEffect(() => {
    if (status === "authenticated" && !isInitialLoad.current) {
        // Gunakan jurus Debounce (jeda 1 detik) agar tidak memborbardir MySQL setiap klik cepat
        const delay = setTimeout(() => {
           syncCartToDB(items);
        }, 1500); 
        return () => clearTimeout(delay);
    }
    isInitialLoad.current = false;
  }, [items, status]);

  // 3. Reset keranjang lokal ketika User LOGOUT
  useEffect(() => {
    if (prevStatus.current === "authenticated" && status === "unauthenticated") {
       useCartStore.getState().emptyCart();
    }
    prevStatus.current = status;
  }, [status]);

  return null; // Komponen "Gaib" (Invisible Hook)
}
