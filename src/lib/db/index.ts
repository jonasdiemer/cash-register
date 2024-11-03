import Dexie, { type Table } from "dexie";
import type { Product, Transaction } from "$lib/types";

export class AppDatabase extends Dexie {
  products!: Table<Product>;
  transactions!: Table<Transaction>;

  constructor() {
    super("KidsCashRegisterDB");

    this.version(1).stores({
      products: "++id, barcode, &name",
      transactions: "++id, timestamp",
    });
  }
}

export const db = new AppDatabase();
