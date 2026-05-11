import { useEffect, useState } from "react";

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  date: string; // ISO yyyy-mm-dd
};

const KEY = "fintrack:transactions:v1";

function load(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

function save(items: Transaction[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

let listeners = new Set<() => void>();

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
    const cb = () => setItems(load());
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  const persist = (next: Transaction[]) => {
    save(next);
    setItems(next);
    listeners.forEach((l) => l());
  };

  const add = (t: Omit<Transaction, "id">) => {
    const next = [{ ...t, id: crypto.randomUUID() }, ...load()];
    persist(next);
  };

  const remove = (id: string) => {
    persist(load().filter((t) => t.id !== id));
  };

  return { items, hydrated, add, remove };
}