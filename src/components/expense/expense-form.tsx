"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createExpenseSchema, type CreateExpenseInput } from "@/validators/expense";
import { toast } from "sonner";
import { PlusIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { value: "FOOD", label: "食事" },
  { value: "TRANSPORT", label: "交通" },
  { value: "ACCOMMODATION", label: "宿泊" },
  { value: "ATTRACTION", label: "観光" },
  { value: "SHOPPING", label: "買い物" },
  { value: "OTHER", label: "その他" },
];

interface ExpenseFormProps {
  tripId: string;
  onCreated: () => void;
}

export function ExpenseForm({ tripId, onCreated }: ExpenseFormProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: { tripId, category: "FOOD", amount: 0 },
  });

  async function onSubmit(data: CreateExpenseInput) {
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("支出を記録しました");
        reset({ tripId, category: "FOOD", amount: 0 });
        setOpen(false);
        onCreated();
      } else {
        toast.error("記録に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
        <PlusIcon className="size-4" />
        支出を追加
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>支出を記録</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="例: ランチ、電車賃、お土産"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">金額 (円)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>カテゴリ</Label>
              <Select
                defaultValue="FOOD"
                onValueChange={(v) =>
                  v && setValue("category", v as CreateExpenseInput["category"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalAmount">元の金額（外貨）</Label>
              <Input
                id="originalAmount"
                type="number"
                placeholder="任意"
                {...register("originalAmount", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalCurrency">通貨コード</Label>
              <Input
                id="originalCurrency"
                placeholder="USD, EUR等"
                {...register("originalCurrency")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidAt">支払日</Label>
            <Input id="paidAt" type="date" {...register("paidAt")} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            )}
            記録する
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
