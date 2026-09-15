"use client";

import { useRef, useState } from "react";
import { LEARNING_MODES, type BuiltCourse, type LearningModeId } from "./build-schema";

type LogEntry = {
  phase: string;
  message: string;
  detail?: string;
  at: number;
};

const DEPTHS = [
  { id: "orientation" as const, label: "Orientation", blurb: "2 modules · fastest" },
  { id: "standard" as const, label: "Standard", blurb: "3 modules · recommended" },
  { id: "deep" as const, label: "Deep", blurb: "4 modules · slowest" },
];

const EXAMPLES = [
  "Anemia",
  "Why the heart fails",
  "Acid–base disturbance",
  "How antibiotics stop working",
  "Reading a chest X-ray",
];

const STORE_KEY = "socratic-built-courses";

export function loadBuiltCourses(): BuiltCourse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const list = raw ? (JSON.parse(raw) as BuiltCourse[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveBuiltCourse(course: BuiltCourse) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadBuiltCourses().filter((c) => c.id !== course.id);
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify([course, ...existing].slice(0, 12)),
    );
  } catch {
    // Storage can be unavailable; the course still works for this session.
  }
}

export function BuildScreen({
  onOpenCourse,
}: {
  onOpenCourse: (course: BuiltCourse) => void;
}) {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<LearningModeId>("mechanism");
  const [depth, setDepth] = useState<(typeof DEPTHS)[number]["id"]>("standard");
  const [audience, setAudience] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BuiltCourse | null>(null);
  const [saved, setSaved] = useState<BuiltCourse[]>(() => loadBuiltCourses());
  const logRef = useRef<HTMLOListElement | null>(null);

  async function build() {
    const subject = topic.trim();
    if (!subject || building) return;
    setBuilding(true);
    setError(null);
    setResult(null);
    setLog([]);

    try {
      const response = await fetch("/api/build-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: subject, mode, depth, audience: audience.trim() }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          (payload as { error?: string } | null)?.error ??
            `The builder is unavailable (${response.status}).`,
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as {
            phase: string;
            message: string;
            detail?: string;
            course?: BuiltCourse;
          };
          setLog((prev) => [
            ...prev,
            { phase: event.phase, message: event.message, detail: event.detail, at: Date.now() },
          ]);
          if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
          if (event.phase === "error") setError(event.detail ?? event.message);
          if (event.phase === "done" && event.course) {
            saveBuiltCourse(event.course);
            setResult(event.course);
            setSaved(loadBuiltCourses());
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The build failed.");
    } finally {
      setBuilding(false);
    }
  }

  return (
    <section className="screen build-screen">
      <div className="page">
        <header className="hero hero-compact">
          <p className="eyebrow">
            <i /> The course builder
          </p>
          <h1>
            Name a topic.
            <br />
            <em>The agent builds the course.</em>
          </h1>
          <p className="hero-lead">
            It decides what has to be understood and in what order, writes the
            causal explanation, draws the visual, and authors the question ladder
            it will use to interrogate you. Nothing is retrieved — this is what
            the model knows, made to defend itself.
          </p>
        </header>

        <div className="section-rule">
          <span>01 — What should it teach?</span>
          <span className="rule-meta">Zero-shot · no textbook, no sources</span>
        </div>

        <div className="build-form">
          <label className="build-topic">
            <span>Topic</span>
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") build();
              }}
              placeholder="Anemia"
              disabled={building}
            />
          </label>
          <div className="build-examples">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                disabled={building}
                onClick={() => setTopic(example)}
              >
                {example}
              </button>
            ))}
          </div>

          <fieldset className="build-modes">
            <legend>How do you want to be taught?</legend>
            <div>
              {LEARNING_MODES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={mode === option.id}
                  className={mode === option.id ? "selected" : ""}
                  disabled={building}
                  onClick={() => setMode(option.id)}
                >
                  <b>{option.name}</b>
                  <p>{option.blurb}</p>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="build-row">
            <fieldset className="build-depth">
              <legend>Depth</legend>
              <div>
                {DEPTHS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={depth === option.id}
                    className={depth === option.id ? "selected" : ""}
                    disabled={building}
                    onClick={() => setDepth(option.id)}
                  >
                    <b>{option.label}</b>
                    <span>{option.blurb}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="build-audience">
              <span>Who is learning? <em>(optional)</em></span>
              <input
                type="text"
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder="a second-year medical student"
                disabled={building}
              />
            </label>
          </div>

          <button
            className="btn btn-primary build-go"
            disabled={!topic.trim() || building}
            onClick={build}
          >
            {building ? "Building the course…" : "Build the course"}
          </button>
        </div>

        {log.length > 0 && (
          <>
            <div className="section-rule">
              <span>02 — The agent working</span>
              {building && <span className="rule-meta">running…</span>}
            </div>
            <ol className="build-log" ref={logRef}>
              {log.map((entry, i) => (
                <li key={`${entry.at}-${i}`} data-phase={entry.phase}>
                  <span className="build-log-phase">{entry.phase}</span>
                  <div>
                    <b>{entry.message}</b>
                    {entry.detail && <pre>{entry.detail}</pre>}
                  </div>
                </li>
              ))}
              {building && (
                <li data-phase="working">
                  <span className="build-log-phase">…</span>
                  <div>
                    <b>
                      <i className="build-dots">
                        <i />
                        <i />
                        <i />
                      </i>
                    </b>
                  </div>
                </li>
              )}
            </ol>
          </>
        )}

        {error && (
          <div className="form-error build-error">
            <b>{error}</b>
            {error.toLowerCase().includes("api key") && (
              <p>
                Set <code>OPENAI_API_KEY</code> in the deployment environment.
                The builder calls the model directly; nothing is generated
                without it.
              </p>
            )}
          </div>
        )}

        {result && (
          <>
            <div className="section-rule">
              <span>03 — What it produced</span>
              <span className="rule-meta">
                {result.modules.length} modules ·{" "}
                {result.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
              </span>
            </div>
            <div className="build-result">
              <div>
                <h2>{result.title}</h2>
                <p className="lead">{result.summary}</p>
                <ol className="build-outline">
                  {result.modules.map((m) => (
                    <li key={m.id}>
                      <b>{m.title}</b>
                      <span>{m.drivingQuestion}</span>
                      <p>{m.lessons.map((l) => l.title).join(" · ")}</p>
                    </li>
                  ))}
                </ol>
                <button className="btn btn-primary" onClick={() => onOpenCourse(result)}>
                  Start the course →
                </button>
              </div>
            </div>
          </>
        )}

        {saved.length > 0 && !building && (
          <>
            <div className="section-rule">
              <span>{result ? "04" : "02"} — Courses you have built</span>
            </div>
            <ul className="course-rail built-rail">
              {saved.map((course) => (
                <li key={course.id}>
                  <button onClick={() => onOpenCourse(course)}>
                    <span className="course-rail-copy">
                      <small>
                        {LEARNING_MODES.find((m) => m.id === course.mode)?.name} ·{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </small>
                      <b>{course.title}</b>
                    </span>
                    <span className="course-rail-meta">
                      {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
