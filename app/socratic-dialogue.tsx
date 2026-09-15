"use client";

import { useRef, useState } from "react";
import type { BuiltLesson } from "./build-schema";

type Turn = { role: "tutor" | "learner"; text: string };
type Stage = "mechanism" | "recognition" | "action";

const STAGES: { id: Stage; label: string; blurb: string }[] = [
  { id: "mechanism", label: "Why it happens", blurb: "Build the causal explanation yourself." },
  { id: "recognition", label: "What you would see", blurb: "Predict the findings from the mechanism." },
  { id: "action", label: "What you would do", blurb: "Reason from the finding to the next step." },
];

/** Picks the authored follow-up when the live tutor is unavailable, so the
    dialogue stays specific to this lesson instead of falling back to generic
    prompts. */
function authoredFollowUp(lesson: BuiltLesson, answer: string, asked: number): string {
  const ladder = lesson.socratic;
  const words = answer.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
  const match = ladder.probes.find((probe) => {
    const probeWords = probe.ifLearnerSays.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    return probeWords.some((w) => words.includes(w));
  });
  if (match) return match.ask;
  const narrowing = ladder.narrowing ?? [];
  if (narrowing.length) return narrowing[Math.min(asked, narrowing.length - 1)];
  return ladder.probes[Math.min(asked, ladder.probes.length - 1)]?.ask ?? ladder.opening;
}

export function SocraticDialogue({
  topic,
  lesson,
  onComplete,
}: {
  topic: string;
  lesson: BuiltLesson;
  onComplete: () => void;
}) {
  const [turns, setTurns] = useState<Turn[]>(() => [
    { role: "tutor", text: lesson.socratic.opening },
  ]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("mechanism");
  const [busy, setBusy] = useState(false);
  const [understanding, setUnderstanding] = useState(0);
  const [note, setNote] = useState("");
  const [offline, setOffline] = useState(false);
  const askedRef = useRef(0);

  const stageIndex = STAGES.findIndex((s) => s.id === stage);
  const learnerTurns = turns.filter((t) => t.role === "learner").length;

  async function submit() {
    const answer = input.trim();
    if (!answer || busy) return;
    const next: Turn[] = [...turns, { role: "learner", text: answer }];
    setTurns(next);
    setInput("");
    setBusy(true);
    askedRef.current += 1;
    try {
      const response = await fetch("/api/socratic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          target: lesson.socratic.target,
          context: lesson.mechanismSummary,
          transcript: next,
          stage,
        }),
      });
      const data = (await response.json()) as {
        question?: string;
        understanding?: number;
        reached?: boolean;
        note?: string;
        mode?: string;
      };
      const isOffline = data.mode === "offline";
      setOffline(isOffline);
      const question = isOffline
        ? authoredFollowUp(lesson, answer, askedRef.current - 1)
        : data.question || authoredFollowUp(lesson, answer, askedRef.current - 1);
      setTurns([...next, { role: "tutor", text: question }]);
      setUnderstanding(data.understanding ?? Math.min(95, askedRef.current * 24));
      setNote(data.note ?? "");
      const advance = isOffline ? askedRef.current >= 3 : Boolean(data.reached);
      if (advance) {
        if (stageIndex < STAGES.length - 1) {
          setStage(STAGES[stageIndex + 1].id);
          askedRef.current = 0;
          setUnderstanding(0);
        }
      }
    } catch {
      setOffline(true);
      setTurns([
        ...next,
        { role: "tutor", text: authoredFollowUp(lesson, answer, askedRef.current - 1) },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="dialogue">
      <div className="dialogue-stages" role="list">
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            role="listitem"
            className={`dialogue-stage${i === stageIndex ? " active" : ""}${i < stageIndex ? " done" : ""}`}
          >
            <span className="dialogue-stage-no">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <b>{s.label}</b>
              <p>{s.blurb}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dialogue-body">
        <div className="dialogue-meter">
          <span>
            {STAGES[stageIndex].label} · {learnerTurns} exchange
            {learnerTurns === 1 ? "" : "s"}
          </span>
          <i>
            <b style={{ width: `${understanding}%` }} />
          </i>
        </div>

        <ol className="dialogue-turns">
          {turns.map((turn, i) => (
            <li key={`${i}-${turn.text.slice(0, 12)}`} className={`turn turn-${turn.role}`}>
              <span className="turn-who">{turn.role === "tutor" ? "Tutor" : "You"}</span>
              <p>{turn.text}</p>
            </li>
          ))}
          {busy && (
            <li className="turn turn-tutor turn-thinking">
              <span className="turn-who">Tutor</span>
              <p>
                <i />
                <i />
                <i />
              </p>
            </li>
          )}
        </ol>

        {note && <p className="dialogue-note">{note}</p>}

        <div className="dialogue-input">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) submit();
            }}
            placeholder="Answer in your own words — a rough answer moves this forward faster than a careful one."
            aria-label="Your answer"
          />
          <div className="dialogue-actions">
            <span className="dialogue-hint">
              {offline
                ? "Running the course's own question ladder."
                : "The tutor never gives the answer. Guessing is the point."}
            </span>
            <button className="btn btn-primary" disabled={!input.trim() || busy} onClick={submit}>
              {busy ? "Thinking…" : "Answer"}
            </button>
          </div>
        </div>

        {stageIndex === STAGES.length - 1 && learnerTurns >= 2 && (
          <button className="btn btn-ghost dialogue-done" onClick={onComplete}>
            I can explain this now — show me the mechanism
          </button>
        )}
      </div>
    </section>
  );
}
