"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insuranceInfoSchema } from "@/validators/insurance";
import { toast } from "sonner";
import { ShieldCheckIcon, SaveIcon, Loader2Icon } from "lucide-react";
import type { InsuranceInfo } from "@/types/trip";

interface InsuranceInfoTabProps {
  tripId: string;
}

export function InsuranceInfoTab({ tripId }: InsuranceInfoTabProps) {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InsuranceInfo>({
    resolver: zodResolver(insuranceInfoSchema),
  });

  useEffect(() => {
    async function loadInsurance() {
      try {
        const res = await fetch(`/api/trips/${tripId}/insurance`);
        if (res.ok) {
          const data = await res.json();
          if (data.insuranceInfo) {
            reset(data.insuranceInfo);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadInsurance();
  }, [tripId, reset]);

  async function onSubmit(data: InsuranceInfo) {
    try {
      const res = await fetch(`/api/trips/${tripId}/insurance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("保険情報を保存しました");
      } else {
        toast.error("保存に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheckIcon className="size-5" />
          海外旅行保険情報
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="providerName">保険会社名</Label>
            <Input
              id="providerName"
              placeholder="例: 東京海上日動"
              {...register("providerName")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyNumber">証券番号</Label>
            <Input
              id="policyNumber"
              placeholder="例: TN-12345678"
              {...register("policyNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">緊急連絡先電話番号</Label>
            <Input
              id="emergencyPhone"
              placeholder="例: +81-3-1234-5678"
              {...register("emergencyPhone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">メモ</Label>
            <Textarea
              id="notes"
              placeholder="補償内容や注意事項など"
              rows={3}
              {...register("notes")}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : (
              <SaveIcon className="mr-2 size-4" />
            )}
            保存
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
