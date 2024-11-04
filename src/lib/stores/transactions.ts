// src/lib/stores/transactions.ts
import { writable, derived } from "svelte/store";
import type { Transaction } from "$lib/types";
import { db } from "$lib/db";

function createTransactionStore() {
  const { subscribe, set, update } = writable<Transaction[]>([]);
  let initialized = false;

  return {
    subscribe,

    async initialize() {
      if (initialized) return;
      try {
        const transactions = await db.transactions.toArray();
        set(transactions);
        initialized = true;
      } catch (error) {
        console.error("Failed to initialize transactions:", error);
        throw error;
      }
    },

    async addTransaction(transaction: Transaction) {
      try {
        const id = await db.transactions.add(transaction);
        update((transactions) => [...transactions, { ...transaction, id }]);
        return id;
      } catch (error) {
        console.error("Failed to add transaction:", error);
        throw error;
      }
    },
  };
}

export const transactionStore = createTransactionStore();

function getStartOfDay(date: Date): number {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

function getStartOfWeek(date: Date): number {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
  return start.getTime();
}

export const salesStats = derived(transactionStore, ($transactions) => {
  const now = new Date();
  const todayStart = getStartOfDay(now);
  const weekStart = getStartOfWeek(now);

  const stats = $transactions.reduce(
    (acc, transaction) => {
      const amount = transaction.total;

      // Add to total sales
      acc.total += amount;

      // Add to today's sales if transaction is from today
      if (transaction.timestamp >= todayStart) {
        acc.today += amount;
      }

      // Add to this week's sales if transaction is from this week
      if (transaction.timestamp >= weekStart) {
        acc.week += amount;
      }

      return acc;
    },
    {
      today: 0,
      week: 0,
      total: 0,
    },
  );

  return stats;
});
