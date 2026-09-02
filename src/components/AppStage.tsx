"use client";

import Link from "next/link";
import { ProgressBar } from "@heroui/react/progress-bar";
import { MotionTransition } from "@/components/MotionTransition";
import { CHROME } from "@/lib/copy";

type AppStageProps = {
  children: React.ReactNode;
  progress?: { value: number; maxValue: number; label: string } | null;
  variant?: "hero" | "flow" | "danger";
};

export function AppStage({
  children,
  progress = null,
  variant = "flow",
}: AppStageProps) {
  const isHero = variant === "hero";
  const atmosphere =
    variant === "danger"
      ? "stage-atmosphere stage-atmosphere--danger"
      : "stage-atmosphere";

  return (
    <div className={`relative isolate flex min-h-dvh flex-1 flex-col ${atmosphere}`}>
      <p
        aria-hidden="true"
        className={isHero ? "eleza-watermark eleza-watermark--hero" : "eleza-watermark"}
      >
        eleza
      </p>

      {progress ? (
        <div className="relative z-10 px-5 pt-4 sm:px-10">
          <ProgressBar
            aria-label={progress.label}
            className="progress-corridor w-full"
            maxValue={progress.maxValue}
            value={progress.value}
          >
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
        </div>
      ) : null}

      {isHero ? null : (
        <header className="relative z-10 flex items-baseline justify-between gap-4 px-5 pt-5 sm:px-10 sm:pt-8">
          <MotionTransition name="eleza-wordmark" share="morph" default="none">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight text-foreground"
            >
              {CHROME.wordmark}
            </Link>
          </MotionTransition>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {CHROME.subtitle}
          </span>
        </header>
      )}

      <div
        className={`relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 sm:px-10 ${
          isHero ? "justify-center py-16" : "pb-10 pt-8"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
