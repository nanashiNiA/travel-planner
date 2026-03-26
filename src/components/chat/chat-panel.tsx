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
import { TranslationMessage } from "@/components/chat/translation-message";
import { TranslationToolbar } from "@/components/chat/translation-toolbar";
import { PhraseBookPanel } from "@/components/chat/phrase-book-panel";
import { ConversationList } from "@/components/chat/conversation-list";
import { useChatStore } from "@/stores/chat-store";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { getLanguageByCode } from "@/data/languages";
import {
  SendHorizontalIcon,
  HistoryIcon,
  TrainFrontIcon,
  UtensilsIcon,
  SirenIcon,
  LanguagesIcon,
  MicIcon,
  MicOffIcon,
} from "lucide-react";
import type { UIMessage } from "@ai-sdk/react";

const TRANSLATE_PREFIX = "[TRANSLATE]";

const QUICK_ACTIONS = [
  { icon: TrainFrontIcon, label: "交通", prompt: "How do I get around here by public transportation?" },
  { icon: UtensilsIcon, label: "食事", prompt: "Can you recommend good restaurants nearby?" },
  { icon: SirenIcon, label: "緊急", prompt: "What are the emergency numbers and nearest hospital here?" },
  { icon: LanguagesIcon, label: "翻訳", action: "translate" as const },
];

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function isTranslationUserMessage(text: string): boolean {
  return text.startsWith(TRANSLATE_PREFIX);
}

function getDisplayText(text: string): string {
  if (text.startsWith(TRANSLATE_PREFIX)) {
    // Extract original text after the translate instruction
    const idx = text.indexOf(":\n\n");
    return idx !== -1 ? text.slice(idx + 3) : text;
  }
  return text;
}

export function ChatPanel() {
  const activeTripId = useChatStore((s) => s.activeTripId);
  const conversationId = useChatStore((s) => s.conversationId);
  const setConversationId = useChatStore((s) => s.setConversationId);
  const translationMode = useChatStore((s) => s.translationMode);
  const setTranslationMode = useChatStore((s) => s.setTranslationMode);
  const sourceLanguage = useChatStore((s) => s.sourceLanguage);
  const targetLanguage = useChatStore((s) => s.targetLanguage);

  const [showHistory, setShowHistory] = useState(false);
  const [showPhraseBook, setShowPhraseBook] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isSupported: micSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

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
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Update input with speech transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

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

  function buildTranslationPrompt(text: string): string {
    const targetLang = getLanguageByCode(targetLanguage);
    const sourceLang = getLanguageByCode(sourceLanguage);
    const targetName = targetLang?.labelEn ?? targetLanguage;

    let prompt = `${TRANSLATE_PREFIX} Translate the following to ${targetName}. Provide ONLY the translation on the first line. If the target language uses non-Latin script, add romanization/pronunciation on the second line.`;

    if (sourceLanguage !== "auto" && sourceLang) {
      prompt += ` The source language is ${sourceLang.labelEn}.`;
    }

    prompt += `\n\n${text}`;
    return prompt;
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");

    if (translationMode) {
      await sendMessage({ text: buildTranslationPrompt(text) });
    } else {
      await sendMessage({ text });
    }
  }

  function handleQuickAction(action: (typeof QUICK_ACTIONS)[number]) {
    if ("action" in action && action.action === "translate") {
      setTranslationMode(true);
      return;
    }
    if ("prompt" in action) {
      setInputValue("");
      sendMessage({ text: action.prompt as string });
    }
  }

  function handlePhraseSelect(text: string) {
    setShowPhraseBook(false);
    sendMessage({ text: buildTranslationPrompt(text) });
  }

  function handleMicToggle() {
    if (isListening) {
      stopListening();
    } else {
      const lang =
        sourceLanguage !== "auto"
          ? getLanguageByCode(sourceLanguage)?.speechCode
          : undefined;
      startListening(lang);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-1.5"
          >
            <HistoryIcon className="size-4" />
            履歴
          </Button>
          {!translationMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTranslationMode(true)}
              className="gap-1.5"
            >
              <LanguagesIcon className="size-4" />
              翻訳
            </Button>
          )}
        </div>
        {activeTripId && (
          <Badge variant="secondary" className="text-xs">
            旅行と連携中
          </Badge>
        )}
      </div>

      {/* Translation Toolbar */}
      {translationMode && !showHistory && (
        <TranslationToolbar
          showPhraseBook={showPhraseBook}
          onTogglePhraseBook={() => setShowPhraseBook(!showPhraseBook)}
        />
      )}

      {showHistory ? (
        <div className="flex-1 overflow-y-auto px-4">
          <ConversationList
            onSelect={loadConversation}
            onClose={() => setShowHistory(false)}
          />
        </div>
      ) : showPhraseBook && translationMode ? (
        <PhraseBookPanel onSelectPhrase={handlePhraseSelect} />
      ) : (
        <>
          {/* Quick Actions */}
          {messages.length === 0 && !translationMode && (
            <div className="px-4 pb-3">
              <p className="mb-2 text-xs text-muted-foreground">
                何かお困りですか？
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-accent"
                  >
                    <action.icon className="size-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!translationMode && <Separator />}

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div ref={scrollRef} className="flex flex-col gap-4 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-12">
                  <p className="text-center text-sm text-muted-foreground">
                    {translationMode
                      ? "翻訳したいテキストを入力してください。\nフレーズ集も使えます。"
                      : "旅行のことなら何でも聞いてください。\nあなたの言語で対応します。"}
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const text = getMessageText(message);
                  const isTranslation =
                    message.role === "user" && isTranslationUserMessage(text);
                  const prevMessage =
                    message.role === "assistant"
                      ? messages[messages.indexOf(message) - 1]
                      : null;
                  const prevIsTranslation =
                    prevMessage &&
                    isTranslationUserMessage(getMessageText(prevMessage));

                  // Show translation-style assistant message
                  if (message.role === "assistant" && prevIsTranslation) {
                    return (
                      <TranslationMessage key={message.id} content={text} />
                    );
                  }

                  return (
                    <ChatMessage
                      key={message.id}
                      role={message.role as "user" | "assistant"}
                      content={isTranslation ? getDisplayText(text) : text}
                    />
                  );
                })
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
                placeholder={
                  translationMode
                    ? "翻訳するテキストを入力..."
                    : "メッセージを入力..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              {micSupported && (
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "secondary"}
                  size="icon"
                  onClick={handleMicToggle}
                  disabled={isLoading}
                  title={isListening ? "音声入力を停止" : "音声入力"}
                >
                  {isListening ? (
                    <MicOffIcon className="size-4" />
                  ) : (
                    <MicIcon className="size-4" />
                  )}
                </Button>
              )}
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
