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
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{EMERGENCY_STOP.title}</Alert.Title>
          <Alert.Description>{EMERGENCY_STOP.body}</Alert.Description>
        </Alert.Content>
      </Alert>
      <div className="mt-auto pt-6">
        <Button
          className="cta-focus"
          fullWidth
          size="lg"
          variant="danger"
          onPress={onDone}
        >
          {EMERGENCY_STOP.done}
        </Button>
      </div>
    </div>
  );
}
