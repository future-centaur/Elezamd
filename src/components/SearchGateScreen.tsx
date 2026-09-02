"use client";

import { Button } from "@heroui/react/button";
import { SEARCH_GATE } from "@/lib/copy";

type SearchGateScreenProps = {
  onBack: () => void;
  onYes: () => void;
  onNo: () => void;
};

export function SearchGateScreen({
  onBack,
  onYes,
  onNo,
}: SearchGateScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {SEARCH_GATE.title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">{SEARCH_GATE.hint}</p>
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Button className="cta-focus" fullWidth size="lg" onPress={onYes}>
          {SEARCH_GATE.yes}
        </Button>
        <Button fullWidth size="lg" variant="secondary" onPress={onNo}>
          {SEARCH_GATE.no}
        </Button>
        <Button fullWidth size="lg" variant="tertiary" onPress={onBack}>
          {SEARCH_GATE.back}
        </Button>
      </div>
    </div>
  );
}
