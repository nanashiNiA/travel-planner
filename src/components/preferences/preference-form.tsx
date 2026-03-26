"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userPreferenceSchema } from "@/validators/preferences";
import { toast } from "sonner";
import { SaveIcon, Loader2Icon, UserIcon } from "lucide-react";
import type { UserPreferenceInput } from "@/types/plan";

const INTERESTS = [
  "寺社仏閣", "温泉", "自然", "食べ歩き", "ショッピング",
  "ナイトライフ", "美術館・博物館", "テーマパーク", "ビーチ",
  "登山・ハイキング", "写真撮影", "地元の文化体験",
];

export function PreferenceForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<UserPreferenceInput>({
    resolver: zodResolver(userPreferenceSchema),
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            reset(data);
            setSelectedInterests(data.interests ?? []);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [reset]);

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) => {
      const next = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      setValue("interests", next);
      return next;
    });
  }

  async function onSubmit(data: UserPreferenceInput) {
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, interests: selectedInterests }),
      });

      if (res.ok) {
        toast.success("設定を保存しました");
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
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserIcon className="size-5" />
          旅行の好み設定
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>宿泊タイプ</Label>
            <Select
              defaultValue=""
              onValueChange={(v) => v && setValue("accommodationType", v)}
              {...register("accommodationType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">ホテル</SelectItem>
                <SelectItem value="ryokan">旅館</SelectItem>
                <SelectItem value="hostel">ホステル・ゲストハウス</SelectItem>
                <SelectItem value="airbnb">民泊・Airbnb</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>予算レベル</Label>
            <Select
              defaultValue=""
              onValueChange={(v) => v && setValue("budgetLevel", v)}
              {...register("budgetLevel")}
            >
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">節約重視</SelectItem>
                <SelectItem value="standard">バランス重視</SelectItem>
                <SelectItem value="premium">快適さ重視</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>興味・関心</Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                >
                  <Badge
                    variant={
                      selectedInterests.includes(interest)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                  >
                    {interest}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryRestrictions">食事制限</Label>
            <Input
              id="dietaryRestrictions"
              placeholder="例: ベジタリアン、ハラル、アレルギー等"
              {...register("dietaryRestrictions")}
            />
          </div>

          <div className="space-y-2">
            <Label>移動手段の好み</Label>
            <Select
              defaultValue=""
              onValueChange={(v) => v && setValue("preferredTransport", v)}
              {...register("preferredTransport")}
            >
              <SelectTrigger>
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">公共交通機関</SelectItem>
                <SelectItem value="rental">レンタカー</SelectItem>
                <SelectItem value="walking">徒歩中心</SelectItem>
                <SelectItem value="taxi">タクシー</SelectItem>
              </SelectContent>
            </Select>
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
