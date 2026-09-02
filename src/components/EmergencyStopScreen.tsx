import { EMERGENCY_STOP } from "@/lib/copy";

type EmergencyStopScreenProps = {
  onDone: () => void;
};

export function EmergencyStopScreen({ onDone }: EmergencyStopScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
        {EMERGENCY_STOP.title}
      </h1>
      <p className="mt-4 text-sm leading-6 text-stone-700">
        {EMERGENCY_STOP.body}
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-auto flex h-12 w-full items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white hover:bg-teal-900"
      >
        {EMERGENCY_STOP.done}
      </button>
    </div>
  );
}
