"use client";

import Link from "next/link";
import { LANDING, PRODUCT_NAME, SUBTITLE, TAGLINE } from "@/lib/copy";
import { AppStage } from "@/components/AppStage";
import { MotionTransition } from "@/components/MotionTransition";

export function LandingCard() {
  return (
    <AppStage variant="hero">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-stage-foreground/60">
        {LANDING.waitingRoomLabel}
      </p>
      <MotionTransition name="eleza-wordmark" share="morph" default="none">
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-stage-foreground sm:text-6xl">
          {PRODUCT_NAME}
        </h1>
      </MotionTransition>
      <p className="mt-3 text-lg text-stage-foreground/75">
        {SUBTITLE} / eleza — explain
      </p>
      <p className="mt-4 max-w-md text-base leading-7 text-stage-foreground/80">
        {TAGLINE}
      </p>

      <div className="mt-10">
        <Link
          href="/waiting-room"
          className="cta-focus button button--primary button--lg button--full-width"
        >
          {LANDING.messageToStart}
        </Link>
        <p className="mt-4 text-sm text-stage-foreground/55">
          {LANDING.demoNumberHint}
        </p>
        <p className="mt-1 font-mono text-sm text-stage-foreground/80">
          {LANDING.demoNumber}
        </p>
      </div>
    </AppStage>
  );
}
