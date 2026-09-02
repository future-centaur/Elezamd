import { useState } from "react";
import { EMERGENCY_CHECK } from "@/lib/copy";
import {
  NONE_WARNING_ID,
  WARNING_SIGNS,
} from "@/lib/emergency";

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
        <legend className="text-xl font-semibold tracking-tight text-stone-900">
          {EMERGENCY_CHECK.title}
        </legend>
        <ul className="mt-5 space-y-2">
          {WARNING_SIGNS.map((sign) => (
            <li key={sign.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-800">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={selected.includes(sign.id)}
                  onChange={() => toggle(sign.id)}
                />
                {sign.label}
              </label>
            </li>
          ))}
          <li>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-800">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={selected.includes(NONE_WARNING_ID)}
                onChange={() => toggle(NONE_WARNING_ID)}
              />
              {EMERGENCY_CHECK.none}
            </label>
          </li>
        </ul>
      </fieldset>
      <div className="mt-auto flex gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-stone-300 text-sm font-medium text-stone-800"
        >
          {EMERGENCY_CHECK.back}
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => onContinue(selected)}
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white enabled:hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {EMERGENCY_CHECK.continue}
        </button>
      </div>
    </div>
  );
}
