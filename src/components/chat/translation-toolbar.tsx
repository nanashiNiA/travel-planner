"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";
import { LANGUAGES } from "@/data/languages";
import { ArrowRightLeftIcon, BookOpenIcon, XIcon } from "lucide-react";

interface TranslationToolbarProps {
  onTogglePhraseBook: () => void;
  showPhraseBook: boolean;
}

export function TranslationToolbar({
  onTogglePhraseBook,
  showPhraseBook,
}: TranslationToolbarProps) {
  const sourceLanguage = useChatStore((s) => s.sourceLanguage);
  const targetLanguage = useChatStore((s) => s.targetLanguage);
  const setSourceLanguage = useChatStore((s) => s.setSourceLanguage);
  const setTargetLanguage = useChatStore((s) => s.setTargetLanguage);
  const swapLanguages = useChatStore((s) => s.swapLanguages);
  const setTranslationMode = useChatStore((s) => s.setTranslationMode);

  const sourceLangs = LANGUAGES;
  const targetLangs = LANGUAGES.filter((l) => l.code !== "auto");

  return (
    <div className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          翻訳モード
        </span>
        <div className="flex gap-1">
          <Button
            variant={showPhraseBook ? "secondary" : "ghost"}
            size="icon-xs"
            onClick={onTogglePhraseBook}
            title="フレーズ集"
          >
            <BookOpenIcon className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setTranslationMode(false)}
            title="翻訳モードを終了"
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Select
          value={sourceLanguage}
          onValueChange={(v) => v && setSourceLanguage(v)}
        >
          <SelectTrigger size="sm" className="flex-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sourceLangs.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={swapLanguages}
          disabled={sourceLanguage === "auto"}
          title="言語を入れ替え"
        >
          <ArrowRightLeftIcon className="size-3.5" />
        </Button>

        <Select
          value={targetLanguage}
          onValueChange={(v) => v && setTargetLanguage(v)}
        >
          <SelectTrigger size="sm" className="flex-1 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {targetLangs.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
