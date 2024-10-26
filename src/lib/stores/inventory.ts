import { writable } from 'svelte/store';
import type { Product } from '$lib/types';

function createInventoryStore() {
  // Load initial data from localStorage if available
  const storedInventory = typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('inventory') || '[]')
    : [];

  const { subscribe, set, update } = writable<Product[]>(storedInventory);

  return {
    subscribe,
    addProduct: (product: Product) => {
      update(products => {
        const newProducts = [...products, product];
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('inventory', JSON.stringify(newProducts));
        }
        return newProducts;
      });
    },
    updateProduct: (barcode: string, updatedProduct: Product) => {
      update(products => {
        const newProducts = products.map(p => 
          p.barcode === barcode ? updatedProduct : p
        );
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('inventory', JSON.stringify(newProducts));
        }
        return newProducts;
      });
    },
    removeProduct: (barcode: string) => {
      update(products => {
        const newProducts = products.filter(p => p.barcode !== barcode);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('inventory', JSON.stringify(newProducts));
        }
        return newProducts;
      });
    },
    updateStock: (barcode: string, quantity: number) => {
      update(products => {
        const newProducts = products.map(p => 
          p.barcode === barcode 
            ? { ...p, stock: Math.max(0, p.stock + quantity) }
            : p
        );
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('inventory', JSON.stringify(newProducts));
        }
        return newProducts;
      });
    }
  };
}

export const inventoryStore = createInventoryStore();
