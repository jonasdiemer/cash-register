// src/routes/receipt/types.ts
import type { Transaction } from "$lib/types";

export interface ReceiptData extends Transaction {
  storeName: string;
  cashierName: string;
  language: "en" | "de";
}
