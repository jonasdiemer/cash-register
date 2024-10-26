import { writable } from 'svelte/store';
import type { CartItem } from '$lib/types';

function createCartStore() {
  const { subscribe, set, update } = writable<CartItem[]>([]);

  return {
    subscribe,
    addItem: (item: CartItem) => update(items => {
      const existingItem = items.find(i => i.barcode === item.barcode);
      if (existingItem) {
        return items.map(i => 
          i.barcode === item.barcode 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, { ...item, quantity: 1 }];
    }),
    removeItem: (barcode: string) => update(items => 
      items.filter(i => i.barcode !== barcode)
    ),
    updateQuantity: (barcode: string, quantity: number) => update(items =>
      items.map(i => 
        i.barcode === barcode 
          ? { ...i, quantity: Math.max(0, quantity) }
          : i
      ).filter(i => i.quantity > 0)
    ),
    clear: () => set([]),
    getTotal: (items: CartItem[]) => 
      items.reduce((total, item) => total + (item.price * item.quantity), 0)
  };
}

export const cartStore = createCartStore();
