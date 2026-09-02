"use client";

import { Alert } from "@heroui/react/alert";
import { Button } from "@heroui/react/button";
import { EMERGENCY_STOP } from "@/lib/copy";

type EmergencyStopScreenProps = {
  onDone: () => void;
};

export function EmergencyStopScreen({ onDone }: EmergencyStopScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {EMERGENCY_STOP.title}
      </h1>
      <Alert className="mt-8 max-w-xl" status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>{EMERGENCY_STOP.body}</Alert.Description>
        </Alert.Content>
      </Alert>
      <div className="screen-actions">
        <span />
        <Button className="cta-focus" size="lg" variant="danger" onPress={onDone}>
          {EMERGENCY_STOP.done}
        </Button>
      </div>
    </div>
  );
}
