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
        <legend className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {EMERGENCY_CHECK.title}
        </legend>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted">
          {EMERGENCY_CHECK.hint}
        </p>
        <ul className="mt-8 max-w-xl space-y-1">
          {WARNING_SIGNS.map((sign) => {
            const isSelected = selected.includes(sign.id);
            return (
              <li key={sign.id}>
                <Checkbox
                  aria-label={sign.label}
                  className={`warning-card w-full border-l-2 py-3 pl-3 ${
                    isSelected
                      ? "warning-card--selected border-accent"
                      : "border-transparent"
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
              className={`warning-card w-full border-l-2 py-3 pl-3 ${
                selected.includes(NONE_WARNING_ID)
                  ? "warning-card--selected border-accent"
                  : "border-transparent"
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
      <div className="screen-actions">
        <Button size="lg" variant="ghost" onPress={onBack}>
          {EMERGENCY_CHECK.back}
        </Button>
        <Button
          className={canContinue ? "cta-focus" : undefined}
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
