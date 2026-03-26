"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMERGENCY_CONTACTS, getEmergencyContactByCountry } from "@/data/emergency-contacts";
import { EmergencyContactsTab } from "@/components/emergency/emergency-contacts-tab";

export function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const contact = selectedCountry
    ? getEmergencyContactByCountry(selectedCountry)
    : null;

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          目的地が自動検出できませんでした。国を選択してください。
        </p>
        <Select
          value={selectedCountry ?? undefined}
          onValueChange={(v) => v && setSelectedCountry(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="国を選択..." />
          </SelectTrigger>
          <SelectContent>
            {EMERGENCY_CONTACTS.map((c) => (
              <SelectItem key={c.countryCode} value={c.countryCode}>
                {c.countryNameJa} ({c.countryName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {contact && <EmergencyContactsTab contact={contact} />}
    </div>
  );
}
