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
      <h1 className="text-xl font-semibold tracking-tight text-stone-900">
        {SEARCH_GATE.title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-700">{SEARCH_GATE.hint}</p>
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <button
          type="button"
          onClick={onYes}
          className="flex h-12 w-full items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white hover:bg-teal-900"
        >
          {SEARCH_GATE.yes}
        </button>
        <button
          type="button"
          onClick={onNo}
          className="flex h-12 w-full items-center justify-center rounded-full border border-stone-300 text-sm font-medium text-stone-800"
        >
          {SEARCH_GATE.no}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 w-full items-center justify-center rounded-full border border-stone-300 text-sm font-medium text-stone-800"
        >
          {SEARCH_GATE.back}
        </button>
      </div>
    </div>
  );
}
