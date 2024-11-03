// src/lib/stores/transactions.ts
import { writable, derived } from 'svelte/store';
import type { Transaction } from '$lib/types';
import { db } from '$lib/db';

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
        console.error('Failed to initialize transactions:', error);
        throw error;
      }
    },

    async addTransaction(transaction: Transaction) {
      try {
        const id = await db.transactions.add(transaction);
        update(transactions => [...transactions, { ...transaction, id }]);
        return id;
      } catch (error) {
        console.error('Failed to add transaction:', error);
        throw error;
      }
    },

    getTodaysSales(): number {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();

      return get(this).reduce((sum, transaction) => {
        if (transaction.timestamp >= todayTimestamp) {
          return sum + transaction.total;
        }
        return sum;
      }, 0);
    }
  };
}

export const transactionStore = createTransactionStore();
export const todaysSales = derived(
  transactionStore,
  ($transactions) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    return $transactions.reduce((sum, transaction) => {
      if (transaction.timestamp >= todayTimestamp) {
        return sum + transaction.total;
      }
      return sum;
    }, 0);
  }
);

export const transactionCount = derived(
  transactionStore,
  ($transactions) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    return $transactions.filter(t => t.timestamp >= todayTimestamp).length;
  }
);