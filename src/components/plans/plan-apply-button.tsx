"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckIcon, Loader2Icon } from "lucide-react";

interface PlanApplyButtonProps {
  tripId: string;
  planId: string;
  disabled?: boolean;
}

export function PlanApplyButton({
  tripId,
  planId,
  disabled,
}: PlanApplyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  async function handleApply() {
    setApplying(true);
    try {
      const res = await fetch(
        `/api/trips/${tripId}/plans/${planId}/select`,
        { method: "POST" }
      );

      if (res.ok) {
        toast.success("プランを旅程に反映しました");
        setOpen(false);
        router.push(`/trips/${tripId}`);
        router.refresh();
      } else {
        toast.error("反映に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setApplying(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full gap-1.5" disabled={disabled} />
        }
      >
        <CheckIcon className="size-4" />
        旅程に反映する
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プランを旅程に反映</DialogTitle>
          <DialogDescription>
            選択したプランを旅程に反映しますか？既存の旅程は上書きされます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            キャンセル
          </Button>
          <Button
            className="flex-1"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : (
              <CheckIcon className="mr-2 size-4" />
            )}
            反映する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
