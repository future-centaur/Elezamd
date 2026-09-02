"use client";

import { useReducer, useState } from "react";
import { DisclosureScreen } from "@/components/DisclosureScreen";
import { EmergencyCheckScreen } from "@/components/EmergencyCheckScreen";
import { EmergencyStopScreen } from "@/components/EmergencyStopScreen";
import { NoteScreen } from "@/components/NoteScreen";
import { PhoneShell } from "@/components/PhoneShell";
import { QuestionScreen } from "@/components/QuestionScreen";
import { SearchGateScreen } from "@/components/SearchGateScreen";
import { FEATURES } from "@/lib/features";
import { createEmptySession } from "@/lib/session";
import { waitingRoomReducer } from "@/lib/waiting-room-reducer";

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

export function WaitingRoomClient() {
  const [session, dispatch] = useReducer(
    waitingRoomReducer,
    undefined,
    createEmptySession,
  );
  const [tidying, setTidying] = useState(false);
  const currentQuestion = session.currentQuestion;

  function finish() {
    dispatch({ type: "DONE" });
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

    dispatch({ type: "NEXT_QUESTION" });
  }

  return (
    <PhoneShell>
      {session.status === "disclosure" ? (
        <DisclosureScreen
          onContinue={() => dispatch({ type: "CONTINUE_DISCLOSURE" })}
        />
      ) : null}

      {session.status === "emergency_check" ? (
        <EmergencyCheckScreen
          onBack={() => dispatch({ type: "BACK_TO_DISCLOSURE" })}
          onContinue={(selectedIds) =>
            dispatch({ type: "SELECT_WARNING_SIGNS", selectedIds })
          }
        />
      ) : null}

      {session.status === "emergency_stop" ? (
        <EmergencyStopScreen onDone={finish} />
      ) : null}

      {session.status === "asking" && currentQuestion ? (
        <QuestionScreen
          questionId={currentQuestion}
          didSearch={session.didSearch}
          value={session.answers[currentQuestion]}
          tidying={tidying}
          onChange={(text) =>
            dispatch({
              type: "SET_ANSWER",
              questionId: currentQuestion,
              text,
            })
          }
          onBack={() => dispatch({ type: "PREV_QUESTION" })}
          onContinue={continueQuestion}
        />
      ) : null}

      {session.status === "search_gate" ? (
        <SearchGateScreen
          onBack={() => dispatch({ type: "BACK_FROM_SEARCH_GATE" })}
          onYes={() => dispatch({ type: "SET_DID_SEARCH", didSearch: true })}
          onNo={() => dispatch({ type: "SET_DID_SEARCH", didSearch: false })}
        />
      ) : null}

      {session.status === "note" ? (
        <NoteScreen
          answers={session.answers}
          didSearch={session.didSearch === true}
          onDone={finish}
        />
      ) : null}
    </PhoneShell>
  );
}
