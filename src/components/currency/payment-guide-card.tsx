import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BanknoteIcon,
  CreditCardIcon,
  SmartphoneIcon,
  HandCoinsIcon,
  InfoIcon,
} from "lucide-react";
import type { PaymentGuide } from "@/data/payment-guide";

interface PaymentGuideCardProps {
  guide: PaymentGuide;
}

function GuideItem({
  icon: Icon,
  label,
  content,
}: {
  icon: React.ElementType;
  label: string;
  content: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{content}</p>
      </div>
    </div>
  );
}

export function PaymentGuideCard({ guide }: PaymentGuideCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          現地の支払い方法
          <Badge variant="secondary">
            {guide.currency} ({guide.currencyCode})
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GuideItem
          icon={BanknoteIcon}
          label="現金"
          content={guide.cashUsage}
        />
        <GuideItem
          icon={CreditCardIcon}
          label="クレジットカード"
          content={guide.cardAcceptance}
        />
        <GuideItem
          icon={SmartphoneIcon}
          label="モバイル決済"
          content={guide.mobilePay}
        />
        <GuideItem
          icon={HandCoinsIcon}
          label="チップ"
          content={guide.tipping}
        />
        {guide.notes && (
          <div className="flex gap-2 rounded-md bg-muted p-3">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{guide.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
