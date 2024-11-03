// cash-register/src/lib/stores/inventory.ts
import { writable, derived } from "svelte/store";
import type { Product } from "$lib/types";
import { db } from "$lib/db";

function createInventoryStore() {
  const { subscribe, set, update } = writable<Product[]>([]);
  let initialized = false;

  return {
    subscribe,

    async initialize() {
      if (initialized) return;
      try {
        const products = await db.products.toArray();
        set(products);
        initialized = true;
      } catch (error) {
        console.error("Failed to initialize inventory:", error);
        throw error;
      }
    },

    async addProduct(product: Product) {
      try {
        const id = await db.products.add(product);
        update((products) => [...products, product]);
        return id;
      } catch (error) {
        console.error("Failed to add product:", error);
        throw error;
      }
    },

    async updateProduct(product: Product) {
      try {
        await db.products
          .where("barcode")
          .equals(product.barcode)
          .modify(product);
        update((products) =>
          products.map((p) => (p.barcode === product.barcode ? product : p)),
        );
      } catch (error) {
        console.error("Failed to update product:", error);
        throw error;
      }
    },

    async removeProduct(barcode: string) {
      try {
        await db.products.where("barcode").equals(barcode).delete();
        update((products) => products.filter((p) => p.barcode !== barcode));
      } catch (error) {
        console.error("Failed to remove product:", error);
        throw error;
      }
    },

    async findByBarcode(barcode: string): Promise<Product | undefined> {
      try {
        // First try to find in IndexedDB
        const product = await db.products
          .where("barcode")
          .equals(barcode)
          .first();
        return product;
      } catch (error) {
        console.error("Failed to find product:", error);
        throw error;
      }
    },
  };
}

export const inventoryStore = createInventoryStore();
export const productCount = derived(
  inventoryStore,
  ($inventory) => $inventory.length,
);
