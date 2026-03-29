import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  FOOD: { label: "食事", color: "bg-orange-500" },
  TRANSPORT: { label: "交通", color: "bg-green-500" },
  ACCOMMODATION: { label: "宿泊", color: "bg-purple-500" },
  ATTRACTION: { label: "観光", color: "bg-blue-500" },
  SHOPPING: { label: "買い物", color: "bg-pink-500" },
  OTHER: { label: "その他", color: "bg-gray-500" },
};

interface ExpenseSummaryProps {
  totalBudget: number;
  expenses: Array<{
    category: string;
    amount: number;
  }>;
}

export function ExpenseSummary({ totalBudget, expenses }: ExpenseSummaryProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Group by category
  const categoryTotals = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">支出サマリー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm text-muted-foreground">支出合計</p>
              <p className="text-2xl font-bold">
                ¥{totalSpent.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              / ¥{totalBudget.toLocaleString()}
            </p>
          </div>
          <Progress
            value={Math.min(percentage, 100)}
            className="h-2"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            残り ¥{(totalBudget - totalSpent).toLocaleString()}
            {percentage > 100 && (
              <span className="ml-1 text-destructive">（予算超過）</span>
            )}
          </p>
        </div>

        {/* Category breakdown */}
        {sortedCategories.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">カテゴリ別</p>
            {sortedCategories.map(([category, amount]) => {
              const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.OTHER;
              const catPercent =
                totalSpent > 0 ? (amount / totalSpent) * 100 : 0;

              return (
                <div key={category} className="flex items-center gap-3">
                  <div
                    className={`size-3 shrink-0 rounded-full ${config.color}`}
                  />
                  <span className="flex-1 text-sm">{config.label}</span>
                  <span className="text-sm font-medium">
                    ¥{amount.toLocaleString()}
                  </span>
                  <span className="w-10 text-right text-xs text-muted-foreground">
                    {catPercent.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
