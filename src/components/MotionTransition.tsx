import React, { type ReactNode } from "react";

type ViewTransitionProps = {
  children?: ReactNode;
  name?: string;
  share?: string;
  default?: string;
  enter?: string;
  exit?: string;
};

const NativeViewTransition = (
  React as unknown as {
    ViewTransition?: React.ComponentType<ViewTransitionProps>;
  }
).ViewTransition;

export function MotionTransition(props: ViewTransitionProps) {
  if (NativeViewTransition) {
    return <NativeViewTransition {...props} />;
  }

  return props.children;
}
