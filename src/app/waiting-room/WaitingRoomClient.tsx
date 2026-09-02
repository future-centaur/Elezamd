"use client";

import { useReducer, useRef, useState, useTransition } from "react";
import { AppStage } from "@/components/AppStage";
import { DisclosureScreen } from "@/components/DisclosureScreen";
import { EmergencyCheckScreen } from "@/components/EmergencyCheckScreen";
import { EmergencyStopScreen } from "@/components/EmergencyStopScreen";
import { NoteScreen } from "@/components/NoteScreen";
import {
  ScreenTransition,
  type ScreenDirection,
} from "@/components/ScreenTransition";
import { QuestionScreen } from "@/components/QuestionScreen";
import { SearchGateScreen } from "@/components/SearchGateScreen";
import { FEATURES } from "@/lib/features";
import { NOTE, QUESTION_UI } from "@/lib/copy";
import {
  createEmptySession,
  questionProgress,
  type WaitingRoomSession,
} from "@/lib/session";
import {
  waitingRoomReducer,
  type WaitingRoomAction,
} from "@/lib/waiting-room-reducer";

async function tidyCurrentAnswer(questionId: string, text: string): Promise<string> {
  try {
    const response = await fetch("/api/waiting-room/tidy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, text }),
    });
    if (!response.ok) {
      return text;
    }
    const data: unknown = await response.json();
    if (
      data &&
      typeof data === "object" &&
      "text" in data &&
      typeof data.text === "string" &&
      data.text.trim()
    ) {
      return data.text;
    }
  } catch {
    return text;
  }

  return text;
}

function flowProgress(session: WaitingRoomSession) {
  if (session.status === "emergency_stop" || session.status === "ended") {
    return null;
  }

  if (session.status === "disclosure") {
    return { value: 1, maxValue: 6, label: "Step 1 of 6" };
  }

  if (session.status === "emergency_check") {
    return { value: 2, maxValue: 6, label: "Step 2 of 6" };
  }

  if (session.status === "search_gate") {
    return { value: 4, maxValue: 6, label: "Step 4 of 6" };
  }

  if (session.status === "note") {
    return { value: 6, maxValue: 6, label: NOTE.forTheNurse };
  }

  if (session.status === "asking" && session.currentQuestion) {
    const progress = questionProgress(
      session.currentQuestion,
      session.didSearch,
    );
    return {
      value: progress.current,
      maxValue: progress.total,
      label: QUESTION_UI.progress(progress.current, progress.total),
    };
  }

  return null;
}

export function WaitingRoomClient() {
  const [session, dispatch] = useReducer(
    waitingRoomReducer,
    undefined,
    createEmptySession,
  );
  const [tidying, setTidying] = useState(false);
  const [, startNav] = useTransition();
  const directionRef = useRef<ScreenDirection>("forward");
  const currentQuestion = session.currentQuestion;

  function navigate(action: WaitingRoomAction, direction: ScreenDirection) {
    directionRef.current = direction;
    startNav(() => {
      dispatch(action);
    });
  }

  function finish() {
    navigate({ type: "DONE" }, "back");
  }

  async function continueQuestion() {
    if (!currentQuestion || tidying) {
      return;
    }

    const raw = session.answers[currentQuestion];
    if (FEATURES.TIDY) {
      setTidying(true);
      const tidied = await tidyCurrentAnswer(currentQuestion, raw);
      dispatch({
        type: "SET_ANSWER",
        questionId: currentQuestion,
        text: tidied,
      });
      setTidying(false);
    }

    navigate({ type: "NEXT_QUESTION" }, "forward");
  }

  const screenKey = `${session.status}:${currentQuestion ?? ""}`;

  return (
    <AppStage
      progress={flowProgress(session)}
      variant={session.status === "emergency_stop" ? "danger" : "flow"}
    >
      <ScreenTransition
        direction={directionRef.current}
        screenKey={screenKey}
      >
        {session.status === "disclosure" ? (
          <DisclosureScreen
            onContinue={() =>
              navigate({ type: "CONTINUE_DISCLOSURE" }, "forward")
            }
          />
        ) : null}

        {session.status === "emergency_check" ? (
          <EmergencyCheckScreen
            onBack={() => navigate({ type: "BACK_TO_DISCLOSURE" }, "back")}
            onContinue={(selectedIds) =>
              navigate({ type: "SELECT_WARNING_SIGNS", selectedIds }, "forward")
            }
          />
        ) : null}

        {session.status === "emergency_stop" ? (
          <EmergencyStopScreen onDone={finish} />
        ) : null}

        {session.status === "asking" && currentQuestion ? (
          <QuestionScreen
            didSearch={session.didSearch}
            questionId={currentQuestion}
            tidying={tidying}
            value={session.answers[currentQuestion]}
            onBack={() => navigate({ type: "PREV_QUESTION" }, "back")}
            onChange={(text) =>
              dispatch({
                type: "SET_ANSWER",
                questionId: currentQuestion,
                text,
              })
            }
            onContinue={continueQuestion}
          />
        ) : null}

        {session.status === "search_gate" ? (
          <SearchGateScreen
            onBack={() => navigate({ type: "BACK_FROM_SEARCH_GATE" }, "back")}
            onNo={() =>
              navigate({ type: "SET_DID_SEARCH", didSearch: false }, "forward")
            }
            onYes={() =>
              navigate({ type: "SET_DID_SEARCH", didSearch: true }, "forward")
            }
          />
        ) : null}

        {session.status === "note" ? (
          <NoteScreen
            answers={session.answers}
            didSearch={session.didSearch === true}
            onDone={finish}
          />
        ) : null}
      </ScreenTransition>
    </AppStage>
  );
}
