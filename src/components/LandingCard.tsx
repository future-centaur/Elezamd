import Link from "next/link";
import { PhoneShell } from "@/components/PhoneShell";
import { LANDING, PRODUCT_NAME, SUBTITLE, TAGLINE } from "@/lib/copy";

export function LandingCard() {
  return (
    <PhoneShell>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
        {LANDING.waitingRoomLabel}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
        {PRODUCT_NAME}
      </h1>
      <p className="mt-1 text-stone-600">{SUBTITLE} / eleza — explain</p>
      <p className="mt-4 text-sm leading-6 text-stone-600">{TAGLINE}</p>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="text-xs text-stone-500">{LANDING.demoNumberHint}</p>
        <div className="mt-3 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white"
            aria-hidden
          >
            E
          </span>
          <div>
            <p className="font-medium text-stone-900">{LANDING.threadPreview}</p>
            <p className="font-mono text-sm text-stone-700">
              {LANDING.demoNumber}
            </p>
          </div>
        </div>
        <Link
          href="/waiting-room"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white hover:bg-teal-900"
        >
          {LANDING.messageToStart}
        </Link>
      </div>
    </PhoneShell>
  );
}
