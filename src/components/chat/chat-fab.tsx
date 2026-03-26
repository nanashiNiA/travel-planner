"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useChatStore } from "@/stores/chat-store";
import { MessageCircleIcon } from "lucide-react";

export function ChatFab() {
  const isOpen = useChatStore((s) => s.isOpen);
  const setOpen = useChatStore((s) => s.setOpen);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setOpen(true)}
          size="icon-lg"
          className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg"
        >
          <MessageCircleIcon className="size-6" />
          <span className="sr-only">チャットサポートを開く</span>
        </Button>
      )}

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex flex-col p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>Travel Assistant</SheetTitle>
            <SheetDescription>
              旅行のことなら何でもお手伝いします
            </SheetDescription>
          </SheetHeader>
          <ChatPanel />
        </SheetContent>
      </Sheet>
    </>
  );
}
