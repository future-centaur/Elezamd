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
      <h1 className="font-display max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {SEARCH_GATE.title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">{SEARCH_GATE.hint}</p>
      <div className="mt-auto flex flex-col items-start gap-3 pt-10">
        <Button className="cta-focus" size="lg" onPress={onYes}>
          {SEARCH_GATE.yes}
        </Button>
        <Button size="lg" variant="secondary" onPress={onNo}>
          {SEARCH_GATE.no}
        </Button>
        <Button size="lg" variant="ghost" onPress={onBack}>
          {SEARCH_GATE.back}
        </Button>
      </div>
    </div>
  );
}
