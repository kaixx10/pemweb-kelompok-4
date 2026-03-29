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
          // Parse harga dari format "Rp X.XXX.XXX"
          const price = parseInt(item.price.replace(/[^\d]/g, ''), 10);
          return total + price * item.quantity;
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
