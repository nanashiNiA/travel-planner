"use client";

import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { getLanguageByCode } from "@/data/languages";
import { useChatStore } from "@/stores/chat-store";
import { Volume2Icon, VolumeOffIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

interface TranslationMessageProps {
  content: string;
}

export function TranslationMessage({ content }: TranslationMessageProps) {
  const { isSupported, isSpeaking, speak, stop } = useSpeechSynthesis();
  const targetLanguage = useChatStore((s) => s.targetLanguage);
  const [copied, setCopied] = useState(false);

  // Parse: first line = translation, second line = romanization (optional)
  const lines = content.trim().split("\n");
  const translation = lines[0] ?? content;
  const romanization = lines.length > 1 ? lines[1] : null;

  const targetLang = getLanguageByCode(targetLanguage);

  function handleSpeak() {
    if (isSpeaking) {
      stop();
    } else {
      speak(translation, targetLang?.speechCode);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex gap-3">
      <div className="max-w-[85%] space-y-1">
        <div className="rounded-2xl bg-muted px-4 py-2.5">
          <p className="text-sm font-medium leading-relaxed">{translation}</p>
          {romanization && (
            <p className="mt-1 text-xs text-muted-foreground">
              {romanization}
            </p>
          )}
        </div>
        <div className="flex gap-1 px-1">
          {isSupported && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleSpeak}
              title={isSpeaking ? "停止" : "読み上げ"}
            >
              {isSpeaking ? (
                <VolumeOffIcon className="size-3.5" />
              ) : (
                <Volume2Icon className="size-3.5" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            title="コピー"
          >
            {copied ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
