'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CartItem,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from '@/app/actions/cart';

export interface CartStore {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: number) => void;
  updateCartQuantity: (itemId: number, quantity: number) => void;
  emptyCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) =>
        set((state) => ({
          items: addItem(state.items, product),
        })),

      removeFromCart: (itemId) =>
        set((state) => ({
          items: removeItem(state.items, itemId),
        })),

      updateCartQuantity: (itemId, quantity) =>
        set((state) => ({
          items: updateQuantity(state.items, itemId, quantity),
        })),

      emptyCart: () =>
        set(() => ({
          items: clearCart(),
        })),

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let price = 0;
          
          // 1. Jika harga sudah berupa Angka mentah (Number), langsung gunakan
          if (typeof item.price === 'number') {
            price = item.price;
          } 
          // 2. Jika harga masih berupa Teks sisa dari kode lama (contoh: "Rp 15.000"), bersihkan
          else if (typeof item.price === 'string') {
            price = parseInt((item.price as string).replace(/[^\d]/g, ''), 10) || 0;
          }

          // Kalikan dengan kuantitas (pastikan kuantitas minimal 1 jika error)
          const qty = item.quantity || 1;
          
          return total + (price * qty);
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // nama key di localStorage
    }
  )
);
