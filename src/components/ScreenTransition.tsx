"use client";

import { MotionTransition } from "@/components/MotionTransition";

export type ScreenDirection = "forward" | "back";

export function ScreenTransition({
  screenKey,
  direction,
  children,
}: {
  screenKey: string;
  direction: ScreenDirection;
  children: React.ReactNode;
}) {
  const enter = direction === "back" ? "nav-back" : "nav-forward";
  const exit = direction === "back" ? "nav-forward" : "nav-back";

  return (
    <MotionTransition
      key={screenKey}
      default="none"
      enter={enter}
      exit={exit}
    >
      {children}
    </MotionTransition>
  );
}
