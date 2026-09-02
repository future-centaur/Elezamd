import { DISCLOSURE } from "@/lib/copy";

type DisclosureScreenProps = {
  onContinue: () => void;
};

export function DisclosureScreen({ onContinue }: DisclosureScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        {DISCLOSURE.title}
      </h1>
      <p className="mt-4 text-base font-medium text-stone-900">
        {DISCLOSURE.aiInvolved}
      </p>
      <div className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
        <p>{DISCLOSURE.notDiagnosis}</p>
        <p>{DISCLOSURE.elezaMeans}</p>
        <p>{DISCLOSURE.stayOnPhone}</p>
        <p>{DISCLOSURE.keepNothing}</p>
        <p>{DISCLOSURE.clinicRecord}</p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="mt-auto flex h-12 w-full items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white hover:bg-teal-900"
      >
        {DISCLOSURE.continue}
      </button>
    </div>
  );
}
