import { writable } from 'svelte/store';
import type { CartItem, Product } from '$lib/types';

function createCartStore() {
  const { subscribe, set, update } = writable<CartItem[]>([]);

  return {
    subscribe,
    addItem: (product: Product) => update(items => {
      const existingItem = items.find(item => item.barcode === product.barcode);
      if (existingItem) {
        return items.map(item =>
          item.barcode === product.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    }),
    removeItem: (barcode: string) => update(items =>
      items.filter(item => item.barcode !== barcode)
    ),
    updateQuantity: (barcode: string, quantity: number) => update(items =>
      items.map(item =>
        item.barcode === barcode
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    ),
    clear: () => set([]),
    getTotal: (items: CartItem[]) =>
      items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };
}

export const cartStore = createCartStore();
