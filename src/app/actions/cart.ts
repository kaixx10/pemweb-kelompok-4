export interface CartItem {
  id: number;
  name: string;
  price: string;
  img: string;
  desc: string;
  quantity: number;
  selected?: boolean;
}

/**
 * Menambah barang ke keranjang
 * Jika barang sudah ada, tambah quantity-nya saja
 */
export const addItem = (cartItems: CartItem[], product: Omit<CartItem, 'quantity' | 'selected'>): CartItem[] => {
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    return cartItems.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1, selected: true }
        : item
    );
  }
  
  return [...cartItems, { ...product, quantity: 1, selected: true }];
};

/**
 * Menghapus barang dari keranjang berdasarkan ID
 */
export const removeItem = (cartItems: CartItem[], itemId: number): CartItem[] => {
  return cartItems.filter(item => item.id !== itemId);
};

/**
 * Mengubah jumlah barang (+ atau -)
 */
export const updateQuantity = (
  cartItems: CartItem[],
  itemId: number,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeItem(cartItems, itemId);
  }
  
  return cartItems.map(item =>
    item.id === itemId
      ? { ...item, quantity }
      : item
  );
};

/**
 * Mengosongkan keranjang
 */
export const clearCart = (): CartItem[] => {
  return [];
};
