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
    <div
      className={`flex min-h-full flex-1 justify-center px-3 py-4 sm:px-6 sm:py-10 ${atmosphere}`}
    >
      <div
        className={`flex w-full flex-col ${
          isHero
            ? "max-w-2xl justify-center"
            : "max-w-lg min-h-[min(100dvh-2rem,46rem)] overflow-hidden rounded-3xl bg-background text-foreground shadow-xl"
        }`}
      >
        {isHero ? (
          <header className="px-1 pb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stage-foreground/70">
              {CHROME.subtitle}
            </p>
          </header>
        ) : (
          <header
            className="flex items-center justify-between gap-4 border-b border-separator px-5 py-3"
            style={{ viewTransitionName: "site-header" }}
          >
            <MotionTransition name="eleza-wordmark" share="morph" default="none">
              <Link
                href="/"
                className="font-semibold tracking-tight text-accent"
              >
                {CHROME.wordmark}
              </Link>
            </MotionTransition>
            <span className="text-xs text-muted">{CHROME.subtitle}</span>
          </header>
        )}

        {progress ? (
          <div className="px-5 pt-3">
            <ProgressBar
              aria-label={progress.label}
              className="w-full"
              maxValue={progress.maxValue}
              value={progress.value}
            >
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          </div>
        ) : null}

        <div
          className={`flex flex-1 flex-col ${
            isHero ? "text-stage-foreground" : "px-5 py-5"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
