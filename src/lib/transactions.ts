

import { useEffect, useState } from "react";
import { api } from "./api";


export type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "entrada" | "saida";
  date: string;
};

type Summary = {
  saldo_total: number;
  entradas: number;
  saidas: number;
};

const API_URL = "/api/transactions";

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    saldo_total: 0,
    entradas: 0,
    saidas: 0,
  });

  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);

      const [resList, resSummary] = await Promise.all([
        api.get(`${API_URL}/`),
        api.get(`${API_URL}/summary`),
      ]);

      setItems(resList.data);
      setSummary(resSummary.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function add(transaction: Omit<Transaction, "id">) {
    try {
      await api.post(`${API_URL}/`, transaction);

      await fetchData();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
    }
  }

  async function remove(id: number) {
    try {
      await api.delete(`${API_URL}/${id}`);

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao remover:", error);
    }
  }

  return {
    items,
    summary,
    loading,
    add,
    remove,
    refresh: fetchData,
  };
}