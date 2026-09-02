"use client";

import Link from "next/link";
import { CHROME } from "@/lib/copy";

export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 justify-center bg-stone-200 px-3 py-4 sm:px-4 sm:py-8">
      <div className="flex min-h-[min(100dvh-2rem,44rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-stone-300 bg-[var(--paper)] shadow-xl">
        <header className="flex items-baseline justify-between border-b border-stone-200 px-5 py-3">
          <Link href="/" className="font-semibold tracking-tight text-teal-900">
            {CHROME.wordmark}
          </Link>
          <span className="text-xs text-stone-500">{CHROME.subtitle}</span>
        </header>
        <div className="flex flex-1 flex-col px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
