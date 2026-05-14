
import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "@phosphor-icons/react";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

import { formatCurrency, formatDate } from "../lib/utils";
import { useTransactions } from "../lib/transactions";
import { AddTransactionDialog } from "../components/add-transaction-dialog";
import { ThemeToggle } from "../components/theme-toggle";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { items, summary, loading, remove, refresh } = useTransactions();

  const handleDelete = async (id: number, description: string) => {
    await remove(id);
    await refresh();  // ← adiciona essa linha
    toast.success(`"${description}" removida`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />

      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">FinTrack</span>
            <span className="text-sm text-muted-foreground">Personal finance</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AddTransactionDialog onSuccess={refresh} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-6 sm:px-6 sm:pb-12">
        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="sm:col-span-3">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Saldo total</p>
              <p className={`mt-2 text-3xl font-semibold ${summary.saldo_total < 0 ? "text-destructive" : "text-foreground"}`}>
                {formatCurrency(summary.saldo_total)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Entradas</p>
              <p className="mt-1 text-xl font-semibold text-success">
                {formatCurrency(summary.entradas)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Saídas</p>
              <p className="mt-1 text-xl font-semibold text-destructive">
                {formatCurrency(summary.saidas)}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-10 text-center">Carregando...</div>
              ) : items.length === 0 ? (
                <div className="p-10 text-center">Nenhuma transação encontrada</div>
              ) : (
                <ul className="divide-y">
                  {items.map((t) => (
                    <li key={t.id} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(t.date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${t.type === "entrada" ? "text-success" : "text-destructive"}`}>
                          {t.type === "entrada" ? "+" : "-"}
                          {formatCurrency(t.amount)}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id, t.description)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}