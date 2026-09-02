"use client";

import { Button } from "@heroui/react/button";
import { DISCLOSURE } from "@/lib/copy";

type DisclosureScreenProps = {
  onContinue: () => void;
};

export function DisclosureScreen({ onContinue }: DisclosureScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {DISCLOSURE.title}
      </h1>
      <p className="mt-4 text-base font-medium text-foreground">
        {DISCLOSURE.aiInvolved}
      </p>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
        <p>{DISCLOSURE.notDiagnosis}</p>
        <p>{DISCLOSURE.elezaMeans}</p>
        <p>{DISCLOSURE.stayOnPhone}</p>
        <p>{DISCLOSURE.keepNothing}</p>
        <p>{DISCLOSURE.clinicRecord}</p>
      </div>
      <div className="mt-auto pt-6">
        <Button
          className="cta-focus"
          fullWidth
          size="lg"
          onPress={onContinue}
        >
          {DISCLOSURE.continue}
        </Button>
      </div>
    </div>
  );
}
