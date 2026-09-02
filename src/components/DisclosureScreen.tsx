"use client";

import { Button } from "@heroui/react/button";
import { DISCLOSURE } from "@/lib/copy";

type DisclosureScreenProps = {
  onContinue: () => void;
};

export function DisclosureScreen({ onContinue }: DisclosureScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {DISCLOSURE.title}
      </h1>
      <p className="mt-6 max-w-xl text-lg font-bold text-foreground">
        {DISCLOSURE.aiInvolved}
      </p>
      <div className="mt-6 max-w-xl space-y-3 text-base leading-7 text-muted">
        <p>{DISCLOSURE.notDiagnosis}</p>
        <p>{DISCLOSURE.elezaMeans}</p>
        <p>{DISCLOSURE.stayOnPhone}</p>
        <p>{DISCLOSURE.keepNothing}</p>
        <p>{DISCLOSURE.shareHint}</p>
        <p>{DISCLOSURE.clinicRecord}</p>
      </div>
      <div className="screen-actions">
        <span />
        <Button className="cta-focus" size="lg" onPress={onContinue}>
          {DISCLOSURE.continue}
        </Button>
      </div>
    </div>
  );
}
