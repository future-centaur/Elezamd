"use client";

import Link from "next/link";
import { LANDING, PRODUCT_NAME, SUBTITLE, TAGLINE } from "@/lib/copy";
import { AppStage } from "@/components/AppStage";
import { MotionTransition } from "@/components/MotionTransition";

export function LandingCard() {
  return (
    <AppStage variant="hero">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
        {LANDING.waitingRoomLabel}
      </p>
      <MotionTransition name="eleza-wordmark" share="morph" default="none">
        <h1 className="font-display mt-5 text-6xl font-extrabold tracking-tight text-foreground sm:text-8xl">
          {PRODUCT_NAME}
        </h1>
      </MotionTransition>
      <p className="mt-4 text-lg text-muted">
        {SUBTITLE} / eleza — explain
      </p>
      <p className="mt-6 max-w-md text-2xl leading-9 text-foreground">
        {TAGLINE}
      </p>

      <div className="mt-14">
        <Link
          href="/waiting-room"
          className="cta-focus button button--primary button--lg"
        >
          {LANDING.messageToStart}
        </Link>
        <p className="mt-6 text-sm text-muted">{LANDING.demoNumberHint}</p>
        <p className="mt-1 font-mono text-sm tracking-wide">{LANDING.demoNumber}</p>
      </div>
    </AppStage>
  );
}
