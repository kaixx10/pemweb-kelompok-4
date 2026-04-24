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
  addToCart: (product: Omit<CartItem, 'quantity' | 'selected'>) => void;
  removeFromCart: (itemId: number) => void;
  updateCartQuantity: (itemId: number, quantity: number) => void;
  toggleItemSelect: (itemId: number) => void;
  toggleAllSelect: (selected: boolean) => void;
  removeSelectedItems: () => void;
  emptyCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getSelectedItemsCount: () => number;
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

      toggleItemSelect: (itemId) =>
        set((state) => ({
          items: state.items.map((item) => 
            item.id === itemId ? { ...item, selected: item.selected === false ? true : false } : item
          ),
        })),

      toggleAllSelect: (selected) =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        })),

      removeSelectedItems: () => 
        set((state) => ({
          items: state.items.filter((item) => item.selected === false),
        })),

      emptyCart: () =>
        set(() => ({
          items: clearCart(),
        })),

      getTotalPrice: () => {
        const { items } = get();
        return items.filter(item => item.selected !== false).reduce((total, item) => {
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
        return items.filter(item => item.selected !== false).reduce((total, item) => total + item.quantity, 0);
      },

      getSelectedItemsCount: () => {
        const { items } = get();
        return items.filter(item => item.selected !== false).length;
      },
    }),
    {
      name: 'cart-storage', // nama key di localStorage
    }
  )
);
