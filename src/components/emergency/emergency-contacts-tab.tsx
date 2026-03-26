import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmergencyContact } from "@/data/emergency-contacts";
import {
  ShieldAlertIcon,
  AmbulanceIcon,
  FlameIcon,
  PhoneIcon,
  BuildingIcon,
  InfoIcon,
} from "lucide-react";

interface EmergencyContactsTabProps {
  contact: EmergencyContact;
}

function EmergencyNumberCard({
  icon: Icon,
  label,
  number,
  dialCode,
  color,
}: {
  icon: React.ElementType;
  label: string;
  number: string;
  dialCode: string;
  color: string;
}) {
  return (
    <a
      href={`tel:${dialCode}${number}`}
      className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-colors hover:bg-accent ${color}`}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-background">
        <Icon className="size-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{number}</p>
      </div>
      <PhoneIcon className="size-5 text-muted-foreground" />
    </a>
  );
}

export function EmergencyContactsTab({ contact }: EmergencyContactsTabProps) {
  return (
    <div className="space-y-4">
      {/* Country Header */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          {contact.countryNameJa} ({contact.countryName})
        </Badge>
      </div>

      {/* Emergency Numbers */}
      <div className="space-y-3">
        {contact.generalEmergency && (
          <EmergencyNumberCard
            icon={PhoneIcon}
            label="総合緊急番号"
            number={contact.generalEmergency}
            dialCode={contact.dialCode}
            color="border-red-500/50"
          />
        )}
        <EmergencyNumberCard
          icon={ShieldAlertIcon}
          label="警察"
          number={contact.police}
          dialCode={contact.dialCode}
          color="border-blue-500/50"
        />
        <EmergencyNumberCard
          icon={AmbulanceIcon}
          label="救急"
          number={contact.ambulance}
          dialCode={contact.dialCode}
          color="border-red-500/50"
        />
        {contact.fire !== contact.ambulance && (
          <EmergencyNumberCard
            icon={FlameIcon}
            label="消防"
            number={contact.fire}
            dialCode={contact.dialCode}
            color="border-orange-500/50"
          />
        )}
      </div>

      {/* Tourist Hotline */}
      {contact.touristHotline && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">観光案内ホットライン</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={`tel:${contact.dialCode}${contact.touristHotline}`}
              className="text-lg font-bold text-primary hover:underline"
            >
              {contact.touristHotline}
            </a>
          </CardContent>
        </Card>
      )}

      {/* Japanese Embassy */}
      {contact.japaneseEmbassy && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BuildingIcon className="size-4" />
              在外日本大使館
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href={`tel:${contact.japaneseEmbassy.phone}`}
              className="block text-lg font-bold text-primary hover:underline"
            >
              {contact.japaneseEmbassy.phone}
            </a>
            <p className="text-sm text-muted-foreground">
              {contact.japaneseEmbassy.address}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {contact.notes && (
        <Card>
          <CardContent className="flex gap-2 pt-4">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{contact.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
