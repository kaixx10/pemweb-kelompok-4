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

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}

export interface CartStore {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Omit<CartItem, 'quantity' | 'selected'>) => void;
  removeFromCart: (itemId: number) => void;
  updateCartQuantity: (itemId: number, quantity: number) => void;
  toggleItemSelect: (itemId: number) => void;
  toggleAllSelect: (selected: boolean) => void;
  removeSelectedItems: () => void;
  emptyCart: () => void;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
  getTotalItems: () => number;
  getSelectedItemsCount: () => number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

// Daftar kupon yang tersedia (Mock Data)
const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'XIAOMI20', discountType: 'percentage', value: 20 }, // 20% diskon
  { code: 'HEMAT50', discountType: 'fixed', value: 50000 },     // Potongan 50rb
  { code: 'PROMO10', discountType: 'percentage', value: 10 }, // 10% diskon
];

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

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
        const { items, appliedCoupon } = get();
        const subtotal = items.filter(item => item.selected !== false).reduce((total, item) => {
          let price = 0;
          if (typeof item.price === 'number') {
            price = item.price;
          } else if (typeof item.price === 'string') {
            price = parseInt((item.price as string).replace(/[^\d]/g, ''), 10) || 0;
          }
          const qty = item.quantity || 1;
          return total + (price * qty);
        }, 0);

        if (!appliedCoupon) return subtotal;

        let discount = 0;
        if (appliedCoupon.discountType === 'percentage') {
          discount = (subtotal * appliedCoupon.value) / 100;
        } else {
          discount = appliedCoupon.value;
        }

        return Math.max(0, subtotal - discount);
      },

      getDiscountAmount: () => {
        const { items, appliedCoupon } = get();
        const subtotal = items.filter(item => item.selected !== false).reduce((total, item) => {
          let price = 0;
          if (typeof item.price === 'number') {
            price = item.price;
          } else if (typeof item.price === 'string') {
            price = parseInt((item.price as string).replace(/[^\d]/g, ''), 10) || 0;
          }
          const qty = item.quantity || 1;
          return total + (price * qty);
        }, 0);

        if (!appliedCoupon) return 0;

        if (appliedCoupon.discountType === 'percentage') {
          return (subtotal * appliedCoupon.value) / 100;
        } else {
          return appliedCoupon.value;
        }
      },

      getTotalItems: () => {
        const { items } = get();
        return items.filter(item => item.selected !== false).reduce((total, item) => total + item.quantity, 0);
      },

      getSelectedItemsCount: () => {
        const { items } = get();
        return items.filter(item => item.selected !== false).length;
      },

      applyCoupon: (code) => {
        const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (coupon) {
          set({ appliedCoupon: coupon });
          return { success: true, message: `Kupon ${coupon.code} berhasil dipasang!` };
        }
        return { success: false, message: 'Kode kupon tidak valid.' };
      },

      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    {
      name: 'cart-storage', // nama key di localStorage
    }
  )
);
