import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { useTransactions } from "@/lib/transactions";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

function Index() {
  const { items, hydrated, remove } = useTransactions();

  const income = items.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = items.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const handleDelete = (id: string, name: string) => {
    remove(id);
    toast.success(`"${name}" removida`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" />

      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none">FinTrack</h1>
              <p className="text-xs text-muted-foreground">Personal finance</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <div className="hidden sm:block">
              <AddTransactionDialog />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-32 pt-6 sm:px-6 sm:pb-12">
        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="sm:col-span-3 transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Saldo total</p>
              <p
                className={`mt-2 text-3xl font-semibold tracking-tight tabular-nums ${
                  balance < 0 ? "text-destructive" : "text-foreground"
                }`}
              >
                {hydrated ? formatCurrency(balance) : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md sm:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Entradas</p>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums text-success">
                {hydrated ? formatCurrency(income) : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md sm:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Saídas</p>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums text-destructive">
                {hydrated ? formatCurrency(expense) : "—"}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Transações</h2>
            <span className="text-xs text-muted-foreground">{items.length} itens</span>
          </div>

          <Card>
            <CardContent className="p-0">
              {!hydrated ? (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Carregando...
                </div>
              ) : items.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <p className="text-sm font-medium">Nenhuma transação ainda</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Adicione sua primeira entrada ou saída.
                  </p>
                  <div className="mt-4 inline-block">
                    <AddTransactionDialog />
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((t) => (
                    <li
                      key={t.id}
                      className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/50 animate-slide-in sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            t.type === "income"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {t.type === "income" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`tabular-nums text-sm font-semibold ${
                            t.type === "income" ? "text-success" : "text-destructive"
                          }`}
                        >
                          {t.type === "income" ? "+" : "−"}
                          {formatCurrency(t.amount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-60"
                          onClick={() => handleDelete(t.id, t.name)}
                          aria-label="Deletar transação"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Mobile floating add button */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <AddTransactionDialog
          trigger={
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
