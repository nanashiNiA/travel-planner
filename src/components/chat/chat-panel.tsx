"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/components/chat/chat-message";
import { ConversationList } from "@/components/chat/conversation-list";
import { useChatStore } from "@/stores/chat-store";
import {
  SendHorizontalIcon,
  HistoryIcon,
  TrainFrontIcon,
  UtensilsIcon,
  SirenIcon,
  LanguagesIcon,
} from "lucide-react";
import type { UIMessage } from "@ai-sdk/react";

const QUICK_ACTIONS = [
  { icon: TrainFrontIcon, label: "交通", prompt: "How do I get around here by public transportation?" },
  { icon: UtensilsIcon, label: "食事", prompt: "Can you recommend good restaurants nearby?" },
  { icon: SirenIcon, label: "緊急", prompt: "What are the emergency numbers and nearest hospital here?" },
  { icon: LanguagesIcon, label: "翻訳", prompt: "Can you help me translate something?" },
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function ChatPanel() {
  const activeTripId = useChatStore((s) => s.activeTripId);
  const conversationId = useChatStore((s) => s.conversationId);
  const setConversationId = useChatStore((s) => s.setConversationId);

  const [showHistory, setShowHistory] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: () => ({ conversationId, tripId: activeTripId }),
      }),
    [conversationId, activeTripId]
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onFinish: ({ messages }) => {
      // Check response headers for new conversation ID is not directly available here.
      // Instead, we handle it via the API response approach.
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversation messages when switching conversations
  const loadConversation = useCallback(
    async (convId: string | null) => {
      setConversationId(convId);
      if (!convId) {
        setMessages([]);
        return;
      }

      try {
        const res = await fetch(
          `/api/ai/chat/history?conversationId=${convId}`
        );
        if (res.ok) {
          const data = await res.json();
          const msgs: UIMessage[] = data.messages.map(
            (m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role as UIMessage["role"],
              parts: [{ type: "text" as const, text: m.content }],
            })
          );
          setMessages(msgs);
        }
      } catch {
        // Silently fail — user can retry
      }
    },
    [setConversationId, setMessages]
  );

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    await sendMessage({ text });
  }

  function handleQuickAction(prompt: string) {
    setInputValue("");
    sendMessage({ text: prompt });
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-4 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="gap-1.5"
        >
          <HistoryIcon className="size-4" />
          履歴
        </Button>
        {activeTripId && (
          <Badge variant="secondary" className="text-xs">
            旅行と連携中
          </Badge>
        )}
      </div>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto px-4">
          <ConversationList
            onSelect={loadConversation}
            onClose={() => setShowHistory(false)}
          />
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="px-4 pb-3">
              <p className="mb-2 text-xs text-muted-foreground">
                何かお困りですか？
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-accent"
                  >
                    <action.icon className="size-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div ref={scrollRef} className="flex flex-col gap-4 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-12">
                  <p className="text-center text-sm text-muted-foreground">
                    旅行のことなら何でも聞いてください。
                    <br />
                    あなたの言語で対応します。
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role as "user" | "assistant"}
                    content={getMessageText(message)}
                  />
                ))
              )}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                    <span className="animate-pulse text-xs">...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="メッセージを入力..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
              >
                <SendHorizontalIcon className="size-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
