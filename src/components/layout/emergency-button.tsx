import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SirenIcon } from "lucide-react";

interface EmergencyButtonProps {
  tripId: string;
}

export function EmergencyButton({ tripId }: EmergencyButtonProps) {
  return (
    <Link href={`/trips/${tripId}/emergency`}>
      <Button variant="destructive" size="sm" className="gap-1.5">
        <SirenIcon className="size-4" />
        緊急情報
      </Button>
    </Link>
  );
}
