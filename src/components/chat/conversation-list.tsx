"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";
import { MessageSquareIcon, PlusIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface Conversation {
  id: string;
  title: string | null;
  tripId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}

interface ConversationListProps {
  onSelect: (conversationId: string | null) => void;
  onClose: () => void;
}

export function ConversationList({ onSelect, onClose }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const conversationId = useChatStore((s) => s.conversationId);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/ai/chat/history");
        if (res.ok) {
          setConversations(await res.json());
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchConversations();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={() => {
          onSelect(null);
          onClose();
        }}
      >
        <PlusIcon className="size-4" />
        新しい会話
      </Button>

      {isLoading ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          読み込み中...
        </p>
      ) : conversations.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          会話履歴はありません
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                onSelect(conv.id);
                onClose();
              }}
              className={`flex items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                conversationId === conv.id ? "bg-accent" : ""
              }`}
            >
              <MessageSquareIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {conv.title ?? "無題の会話"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conv.updatedAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                  {" ・ "}
                  {conv._count.messages}件
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
