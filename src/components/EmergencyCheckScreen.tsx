"use client";

import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Checkbox } from "@heroui/react/checkbox";
import { EMERGENCY_CHECK } from "@/lib/copy";
import { NONE_WARNING_ID, WARNING_SIGNS } from "@/lib/emergency";

type EmergencyCheckScreenProps = {
  onBack: () => void;
  onContinue: (selectedIds: string[]) => void;
};

export function EmergencyCheckScreen({
  onBack,
  onContinue,
}: EmergencyCheckScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((current) => {
      if (id === NONE_WARNING_ID) {
        return current.includes(NONE_WARNING_ID) ? [] : [NONE_WARNING_ID];
      }

      const withoutNone = current.filter((item) => item !== NONE_WARNING_ID);
      return withoutNone.includes(id)
        ? withoutNone.filter((item) => item !== id)
        : [...withoutNone, id];
    });
  }

  const canContinue = selected.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <fieldset>
        <legend className="text-xl font-semibold tracking-tight text-foreground">
          {EMERGENCY_CHECK.title}
        </legend>
        <p className="mt-2 text-sm leading-6 text-muted">
          {EMERGENCY_CHECK.hint}
        </p>
        <ul className="mt-5 space-y-2">
          {WARNING_SIGNS.map((sign) => {
            const isSelected = selected.includes(sign.id);
            return (
              <li key={sign.id}>
                <Checkbox
                  aria-label={sign.label}
                  className={`warning-card w-full rounded-xl border px-3 py-3 ${
                    isSelected
                      ? "warning-card--selected border-accent bg-accent-soft"
                      : "border-border bg-surface"
                  }`}
                  isSelected={isSelected}
                  onChange={() => toggle(sign.id)}
                >
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    {sign.label}
                  </Checkbox.Content>
                </Checkbox>
              </li>
            );
          })}
          <li>
            <Checkbox
              aria-label={EMERGENCY_CHECK.none}
              className={`warning-card w-full rounded-xl border px-3 py-3 ${
                selected.includes(NONE_WARNING_ID)
                  ? "warning-card--selected border-accent bg-accent-soft"
                  : "border-border bg-surface"
              }`}
              isSelected={selected.includes(NONE_WARNING_ID)}
              onChange={() => toggle(NONE_WARNING_ID)}
            >
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                {EMERGENCY_CHECK.none}
              </Checkbox.Content>
            </Checkbox>
          </li>
        </ul>
      </fieldset>
      <div className="mt-auto flex gap-3 pt-6">
        <Button fullWidth size="lg" variant="secondary" onPress={onBack}>
          {EMERGENCY_CHECK.back}
        </Button>
        <Button
          className={canContinue ? "cta-focus" : undefined}
          fullWidth
          isDisabled={!canContinue}
          size="lg"
          onPress={() => onContinue(selected)}
        >
          {EMERGENCY_CHECK.continue}
        </Button>
      </div>
    </div>
  );
}
