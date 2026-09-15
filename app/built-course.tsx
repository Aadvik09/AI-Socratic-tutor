"use client";

import { useState } from "react";
import type { BuiltCourse } from "./build-schema";
import { LEARNING_MODES } from "./build-schema";
import { CourseVisual } from "./visuals";
import { SocraticDialogue } from "./socratic-dialogue";

type Step = "question" | "dialogue" | "mechanism" | "apply" | "check";

const STEPS: { id: Step; label: string }[] = [
  { id: "question", label: "The question" },
  { id: "dialogue", label: "Work it out" },
  { id: "mechanism", label: "The mechanism" },
  { id: "apply", label: "See it and act" },
  { id: "check", label: "Check" },
];

export function BuiltCourseView({
  course,
  onExit,
}: {
  course: BuiltCourse;
  onExit: () => void;
}) {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [step, setStep] = useState<Step>("question");
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  const activeModule = course.modules[moduleIndex] ?? course.modules[0];
  const lesson = activeModule.lessons[lessonIndex] ?? activeModule.lessons[0];
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const mode = LEARNING_MODES.find((m) => m.id === course.mode);
  // In pure-Socratic mode the explanation is withheld until the learner has
  // tried to build it themselves.
  const showSummaryUpFront = course.mode !== "socratic";

  function go(mi: number, li: number) {
    setModuleIndex(mi);
    setLessonIndex(li);
    setStep("question");
    setChoice(null);
    setChecked(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function advance() {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1].id);
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
      return;
    }
    const key = `${moduleIndex}-${lessonIndex}`;
    if (!done.includes(key)) setDone([...done, key]);
    if (lessonIndex < activeModule.lessons.length - 1) {
      go(moduleIndex, lessonIndex + 1);
    } else if (moduleIndex < course.modules.length - 1) {
      go(moduleIndex + 1, 0);
    }
  }

  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <section className="lesson-screen rail-open built-screen">
      <aside className="lesson-rail">
        <button className="rail-back" onClick={onExit}>
          ← Leave course
        </button>
        <div className="rail-course">
          <div>
            <small>{course.provenance === "zero-shot" ? "Agent-built · zero-shot" : course.provenance}</small>
            <b>{course.title}</b>
          </div>
        </div>
        <p className="built-mode">{mode?.name}</p>

        <nav className="rail-steps" aria-label="Course contents">
          {course.modules.map((m, mi) => (
            <div key={m.id}>
              <p className="rail-group">{m.title}</p>
              {m.lessons.map((l, li) => {
                const active = mi === moduleIndex && li === lessonIndex;
                const complete = done.includes(`${mi}-${li}`);
                return (
                  <button
                    key={l.id}
                    className={active ? "active" : complete ? "done" : ""}
                    onClick={() => go(mi, li)}
                  >
                    <span className="rail-step-icon">{complete ? "✓" : li + 1}</span>
                    <span className="rail-step-label">{l.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="rail-meter">
          <div>
            <span>Lessons done</span>
            <b>
              {done.length}/{totalLessons}
            </b>
          </div>
          <i>
            <b style={{ width: `${(done.length / totalLessons) * 100}%` }} />
          </i>
        </div>
      </aside>

      <div className="lesson-main">
        <article className="lesson-card built-card" key={`${lesson.id}-${step}`}>
          <div className="lesson-card-head">
            <span className="pill">
              {activeModule.title} · {STEPS[stepIndex].label}
            </span>
            <span className="lesson-card-unit">
              Lesson {lessonIndex + 1} of {activeModule.lessons.length}
            </span>
          </div>

          {step === "question" && (
            <>
              <h1>{lesson.drivingQuestion}</h1>
              {showSummaryUpFront ? (
                <p className="lead">{lesson.mechanismSummary}</p>
              ) : (
                <p className="lead">
                  Work this out before you read anything. The tutor will not tell
                  you the answer — it will only ask.
                </p>
              )}
              <CourseVisual spec={lesson.visual} />
              <footer className="lesson-nav">
                <span className="nav-note">{lesson.title}</span>
                <button className="btn btn-primary" onClick={advance}>
                  Start the dialogue →
                </button>
              </footer>
            </>
          )}

          {step === "dialogue" && (
            <>
              <h1>Work it out</h1>
              <p className="lead">
                You will be asked, not told. Answer roughly — the next question
                is built from what you say.
              </p>
              <SocraticDialogue topic={course.topic} lesson={lesson} onComplete={advance} />
              <footer className="lesson-nav">
                <button className="btn-link" onClick={advance}>
                  Skip ahead to the mechanism →
                </button>
              </footer>
            </>
          )}

          {step === "mechanism" && (
            <>
              <h1>The mechanism</h1>
              <p className="lead">{lesson.mechanismSummary}</p>
              <ol className="mech-steps">
                {lesson.mechanismSteps.map((s, i) => (
                  <li key={`${s.cause}-${i}`} style={{ animationDelay: `${i * 70}ms` }}>
                    <span className="mech-no">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <b>{s.cause}</b>
                      <span className="mech-arrow">leads to</span>
                      <b>{s.effect}</b>
                      <p>{s.because}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {lesson.misconceptions.length > 0 && (
                <section className="pitfall">
                  <span className="callout-label">Where this usually goes wrong</span>
                  {lesson.misconceptions.map((m) => (
                    <div key={m.claim} className="misconception">
                      <b>“{m.claim}”</b>
                      <p>{m.whyWrong}</p>
                    </div>
                  ))}
                </section>
              )}
              <footer className="lesson-nav">
                <button className="btn btn-primary" onClick={advance}>
                  Now what would you see? →
                </button>
              </footer>
            </>
          )}

          {step === "apply" && (
            <>
              <h1>See it, then act</h1>
              <div className="split-panels">
                <div className="panel">
                  <span className="panel-label">If you see this</span>
                  <ul className="sign-list">
                    {lesson.signs.map((s) => (
                      <li key={s.finding}>
                        <b>{s.finding}</b>
                        <p>{s.because}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="panel">
                  <span className="panel-label">Then what you do</span>
                  <ul className="sign-list">
                    {lesson.actions.map((a) => (
                      <li key={a.situation}>
                        <b>{a.situation}</b>
                        <p>
                          {a.nextStep} — {a.rationale}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <footer className="lesson-nav">
                <button className="btn btn-primary" onClick={advance}>
                  Check yourself →
                </button>
              </footer>
            </>
          )}

          {step === "check" && (
            <>
              <h1>Check</h1>
              <h2 className="question-prompt">{lesson.check.prompt}</h2>
              <div className="choice-list">
                {lesson.check.options.map((option, i) => (
                  <button
                    key={option}
                    disabled={checked}
                    className={`${choice === i ? "selected" : ""} ${
                      checked && i === lesson.check.correct ? "correct" : ""
                    } ${checked && choice === i && i !== lesson.check.correct ? "incorrect" : ""}`}
                    onClick={() => !checked && setChoice(i)}
                  >
                    <span>{String.fromCharCode(65 + i)}</span>
                    <p>{option}</p>
                  </button>
                ))}
              </div>
              {checked && (
                <div className={`verdict ${choice === lesson.check.correct ? "correct" : "incorrect"}`}>
                  <b>
                    {choice === lesson.check.correct
                      ? `Correct — ${String.fromCharCode(65 + lesson.check.correct)}`
                      : "Not quite."}
                  </b>
                  <p>{lesson.check.feedback}</p>
                </div>
              )}
              <footer className="lesson-nav">
                {!checked ? (
                  <button
                    className="btn btn-primary"
                    disabled={choice === null}
                    onClick={() => setChecked(true)}
                  >
                    Check answer
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={advance}>
                    Next lesson →
                  </button>
                )}
              </footer>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
