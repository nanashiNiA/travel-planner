"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseForm } from "@/components/expense/expense-form";
import { ExpenseSummary } from "@/components/expense/expense-summary";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "食事",
  TRANSPORT: "交通",
  ACCOMMODATION: "宿泊",
  ATTRACTION: "観光",
  SHOPPING: "買い物",
  OTHER: "その他",
};

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "bg-orange-100 text-orange-800",
  TRANSPORT: "bg-green-100 text-green-800",
  ACCOMMODATION: "bg-purple-100 text-purple-800",
  ATTRACTION: "bg-blue-100 text-blue-800",
  SHOPPING: "bg-pink-100 text-pink-800",
  OTHER: "bg-gray-100 text-gray-800",
};

interface Expense {
  id: string;
  category: string;
  title: string;
  amount: number;
  originalAmount?: number | null;
  originalCurrency?: string | null;
  paidAt?: string | null;
  createdAt: string;
  itineraryItem?: { title: string } | null;
}

interface ExpenseListProps {
  tripId: string;
  totalBudget: number;
}

export function ExpenseList({ tripId, totalBudget }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`);
      if (res.ok) {
        setExpenses(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function handleDelete(expenseId: string) {
    try {
      const res = await fetch(
        `/api/trips/${tripId}/expenses/${expenseId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
        toast.success("削除しました");
      }
    } catch {
      toast.error("削除に失敗しました");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">支出記録</h2>
        <ExpenseForm tripId={tripId} onCreated={fetchExpenses} />
      </div>

      <ExpenseSummary totalBudget={totalBudget} expenses={expenses} />

      {expenses.length === 0 ? (
        <Card className="py-8 text-center">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              まだ支出が記録されていません
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{expense.title}</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${CATEGORY_COLORS[expense.category] ?? ""}`}
                    >
                      {CATEGORY_LABELS[expense.category] ?? expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {expense.paidAt && (
                      <span>
                        {format(new Date(expense.paidAt), "M/d", {
                          locale: ja,
                        })}
                      </span>
                    )}
                    {expense.itineraryItem && (
                      <span>@ {expense.itineraryItem.title}</span>
                    )}
                    {expense.originalAmount && expense.originalCurrency && (
                      <span>
                        ({expense.originalAmount.toLocaleString()}{" "}
                        {expense.originalCurrency})
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-bold">
                  ¥{expense.amount.toLocaleString()}
                </p>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDelete(expense.id)}
                >
                  <TrashIcon className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
