"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeftIcon, RefreshCwIcon, Loader2Icon } from "lucide-react";

const COMMON_CURRENCIES = [
  { code: "JPY", label: "🇯🇵 JPY (円)" },
  { code: "USD", label: "🇺🇸 USD ($)" },
  { code: "EUR", label: "🇪🇺 EUR (€)" },
  { code: "GBP", label: "🇬🇧 GBP (£)" },
  { code: "KRW", label: "🇰🇷 KRW (₩)" },
  { code: "CNY", label: "🇨🇳 CNY (¥)" },
  { code: "TWD", label: "🇹🇼 TWD (NT$)" },
  { code: "THB", label: "🇹🇭 THB (฿)" },
  { code: "SGD", label: "🇸🇬 SGD (S$)" },
  { code: "AUD", label: "🇦🇺 AUD (A$)" },
  { code: "CAD", label: "🇨🇦 CAD (C$)" },
  { code: "NZD", label: "🇳🇿 NZD (NZ$)" },
  { code: "VND", label: "🇻🇳 VND (₫)" },
  { code: "IDR", label: "🇮🇩 IDR (Rp)" },
];

interface CurrencyConverterProps {
  defaultTargetCurrency?: string;
}

export function CurrencyConverter({
  defaultTargetCurrency = "USD",
}: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState("JPY");
  const [toCurrency, setToCurrency] = useState(defaultTargetCurrency);
  const [amount, setAmount] = useState("10000");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = useCallback(async (base: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/currency/rate?base=${base}`);
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates);
        setLastUpdated(data.lastUpdated);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(fromCurrency);
  }, [fromCurrency, fetchRates]);

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  const numAmount = parseFloat(amount) || 0;
  const rate = rates?.[toCurrency] ?? 0;
  const converted = numAmount * rate;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">通貨換算</CardTitle>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => fetchRates(fromCurrency)}
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <RefreshCwIcon className="size-3.5" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">変換元</Label>
            <Select
              value={fromCurrency}
              onValueChange={(v) => v && setFromCurrency(v)}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMON_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSwap}
            className="mb-0.5"
          >
            <ArrowRightLeftIcon className="size-4" />
          </Button>

          <div className="flex-1 space-y-1">
            <Label className="text-xs">変換先</Label>
            <Select
              value={toCurrency}
              onValueChange={(v) => v && setToCurrency(v)}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMMON_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">金額</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10000"
          />
        </div>

        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {numAmount.toLocaleString()} {fromCurrency} =
          </p>
          <p className="text-2xl font-bold">
            {converted.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {toCurrency}
          </p>
          {rate > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </p>
          )}
        </div>

        {lastUpdated && (
          <p className="text-center text-xs text-muted-foreground">
            最終更新: {lastUpdated}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
