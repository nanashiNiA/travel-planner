"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripSchema, type CreateTripInput } from "@/validators/trip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const travelStyles = [
  { value: "relaxed", label: "のんびり・リラックス" },
  { value: "active", label: "アクティブ・体験重視" },
  { value: "gourmet", label: "グルメ・食べ歩き" },
  { value: "cultural", label: "文化・歴史探訪" },
  { value: "adventure", label: "冒険・アウトドア" },
];

export default function NewTripPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTripInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      currency: "JPY",
    },
  });

  async function onSubmit(data: CreateTripInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "作成に失敗しました");
      }

      const trip = await res.json();
      toast.success("旅行プランを作成しました");
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "作成に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">新しい旅行プラン</CardTitle>
          <CardDescription>
            基本情報を入力して旅行プランを作成しましょう。AIが旅程を自動生成します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">旅行タイトル</Label>
              <Input
                id="title"
                placeholder="例: 京都2泊3日の旅"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">目的地</Label>
              <Input
                id="destination"
                placeholder="例: 京都"
                {...register("destination")}
              />
              {errors.destination && (
                <p className="text-sm text-destructive">
                  {errors.destination.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">開始日</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">終了日</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-sm text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBudget">予算（円）</Label>
              <Input
                id="totalBudget"
                type="number"
                placeholder="例: 100000"
                {...register("totalBudget", { valueAsNumber: true })}
              />
              {errors.totalBudget && (
                <p className="text-sm text-destructive">
                  {errors.totalBudget.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>旅行スタイル（任意）</Label>
              <Select
                onValueChange={(value) =>
                  setValue("travelStyle", value as CreateTripInput["travelStyle"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="スタイルを選択" />
                </SelectTrigger>
                <SelectContent>
                  {travelStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "作成中..." : "旅行プランを作成"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
