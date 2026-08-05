"use client";

import { useMemo, useState } from "react";

const modules = [
  { number: "01", title: "Prepare & Explore", label: "IN PROGRESS", progress: 36 },
  { number: "02", title: "Describe & Compare", label: "LOCKED", progress: 0 },
  { number: "03", title: "Reason with Evidence", label: "LOCKED", progress: 0 },
  { number: "04", title: "Communicate Clearly", label: "LOCKED", progress: 0 },
];

const moduleOneLessons = [
  { id: "1.1", title: "Start with the shape of the data", type: "Learn", detail: "A short visual introduction", state: "complete" },
  { id: "1.2", title: "Identify the data type", type: "Socratic lesson", detail: "Labels, rank, and measurement", state: "current" },
  { id: "1.3", title: "Read a distribution", type: "Socratic lesson", detail: "Center, spread, and skew", state: "next" },
  { id: "1.4", title: "Inspect missingness", type: "Practice", detail: "What absence may be telling you", state: "locked" },
];

const diagnostic = [
  "A length-of-stay dataset has a mean of 4 days and a median of 2 days. What does that suggest about the distribution?",
  "A patient record has a creatinine value of 14.0. Before changing it, what would you want to know?",
  "Which of these is categorical: heart-failure stage, serum sodium, or length of stay? Why?",
];

const diagnosticHints = [
  ["Think about what a few unusually long stays would do to an average.", "Compare what the mean is sensitive to with what the median describes.", "When the mean sits above the median, a smaller number of high values often pulls the average upward."],
  ["Ask whether the number is possible before asking whether it is unusual.", "Separate a data-entry error from an extreme but clinically plausible observation.", "Use clinical context: 14.0 can signal severe renal failure, so it should be investigated rather than automatically removed."],
  ["Focus on what the recorded values represent, not whether they contain numbers.", "Ask: are the values labels, measurements, or positions on an ordered scale?", "Heart-failure stage is ordinal; serum sodium is continuous; length of stay is continuous."],
];

export default function Home() {
  const [view, setView] = useState<"overview" | "diagnostic" | "lesson" | "library" | "notes">("overview");
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [response, setResponse] = useState("");
  const [hint, setHint] = useState(0);
  const [streak, setStreak] = useState(4);
  const [lessonResponse, setLessonResponse] = useState("");
  const [lessonHint, setLessonHint] = useState(false);
  const [lessonFeedback, setLessonFeedback] = useState(false);
  const [diagnosticFeedback, setDiagnosticFeedback] = useState("");
  const [tutorBusy, setTutorBusy] = useState(false);
  const question = diagnostic[diagnosticStep];
  const progress = useMemo(() => Math.round(((diagnosticStep + (response ? 0.5 : 0)) / diagnostic.length) * 100), [diagnosticStep, response]);

  async function continueDiagnostic() {
    if (!response.trim()) return;
    if (!diagnosticFeedback) {
      setTutorBusy(true);
      try {
        const result = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, learnerAnswer: response, hintLevel: 0 }) });
        const data = (await result.json()) as { reply?: string };
        setDiagnosticFeedback(data.reply || "Let’s take one more look at the evidence in your answer.");
      } catch { setDiagnosticFeedback("Your response is a useful start. What evidence in the data would strengthen it?"); }
      finally { setTutorBusy(false); }
      return;
    }
    if (diagnosticStep < diagnostic.length - 1) {
      setDiagnosticStep((step) => step + 1);
      setResponse("");
      setHint(0);
      setDiagnosticFeedback("");
      setStreak((value) => value + 1);
    } else {
      setView("lesson");
    }
  }

  return (
    <main className="shell">
      <nav className="topbar" aria-label="Primary navigation">
        <button className="brand" onClick={() => setView("overview")} aria-label="Socratic Studio home">
          <span className="brand-mark">S</span><span>SOCRATIC <i>STUDIO</i></span>
        </button>
        <div className="nav-links"><button className={view === "overview" || view === "diagnostic" || view === "lesson" ? "selected" : ""} onClick={() => setView("overview")}>Course</button><button className={view === "library" ? "selected" : ""} onClick={() => setView("library")}>Library</button><button className={view === "notes" ? "selected" : ""} onClick={() => setView("notes")}>Notes</button></div>
        <div className="profile"><span className="streak">✦ {streak} day streak</span><span className="avatar">AK</span></div>
      </nav>

      {(view === "diagnostic" || view === "lesson") && <aside className="learning-rail" aria-label="Module 1 lessons"><div className="rail-course"><span className="rail-icon">◫</span><div><b>Data Literacy</b><small>MODULE 1 · 4 LESSONS</small></div></div><div className="rail-label">PREPARE & EXPLORE</div><button className={view === "diagnostic" ? "rail-item active" : "rail-item"} onClick={() => setView("diagnostic")}><span>01</span><p>Quick diagnostic<small>Find your starting point</small></p></button><button className={view === "lesson" ? "rail-item active" : "rail-item"} onClick={() => setView("lesson")}><span>02</span><p>Identify data types<small>Socratic lesson</small></p></button><button className="rail-item" onClick={() => setView("lesson")}><span>03</span><p>Read distributions<small>Up next</small></p></button><button className="rail-item locked"><span>04</span><p>Inspect missingness<small>Complete previous lesson</small></p></button><div className="rail-master"><span>MODULE MASTERY</span><b>36%</b><div><i></i></div></div></aside>}
      {view === "overview" && <>
        <section className="hero">
          <div className="eyebrow"><span></span> BASIC DATA LITERACY FOR CLINICIANS</div>
          <div className="hero-grid">
            <div><p className="kicker">MODULE ONE</p><h1>See the data<br/><em>before</em> you trust it.</h1><p className="lede">Build the habit of looking closely. Learn to notice what is missing, impossible, unusual, or quietly misleading — before it shapes a decision.</p><div className="hero-actions"><button className="primary" onClick={() => setView("diagnostic")}>Start your diagnostic <b>→</b></button><button className="text-button" onClick={() => setView("library")}>View syllabus <span>↗</span></button></div></div>
            <aside className="hero-card"><div className="card-top"><span>YOUR PATH</span><span>MODULE 01 / 04</span></div><div className="radar"><div className="radar-ring ring-1"></div><div className="radar-ring ring-2"></div><div className="radar-ring ring-3"></div><div className="radar-dot"></div><div className="radar-label">DATA<br/>LITERACY</div></div><p>We’ll adapt the questions<br/>to your current understanding.</p></aside>
          </div>
        </section>
        <section className="course-section learning-path"><div className="section-head"><div><p className="kicker">YOUR LEARNING PATH</p><h2>Module 1: Prepare & Explore</h2></div><p>Work through each lesson in order. Your mastery grows when you explain your thinking, not when you click through.</p></div>
          <div className="path-layout"><div className="unit-card"><div className="unit-heading"><div><span className="unit-label">UNIT 01</span><h3>Prepare & Explore</h3><p>Learn to see what a dataset is saying before you ask it a question.</p></div><span className="unit-score">36%<small>mastery</small></span></div><div className="lesson-stack">{moduleOneLessons.map((lesson) => <button key={lesson.id} className={`lesson-row ${lesson.state}`} onClick={() => lesson.state !== "locked" && setView(lesson.state === "current" ? "lesson" : "diagnostic")}><span className="lesson-state">{lesson.state === "complete" ? "✓" : lesson.state === "current" ? "→" : "•"}</span><span className="lesson-copy"><b>{lesson.id} · {lesson.title}</b><small>{lesson.type} · {lesson.detail}</small></span><span className="lesson-action">{lesson.state === "current" ? "Continue" : lesson.state === "complete" ? "Review" : lesson.state === "locked" ? "Locked" : "Start"}</span></button>)}</div></div><aside className="path-sidebar"><p className="kicker">UP NEXT</p><h3>Diagnostic<br/><em>check-in</em></h3><p>Three questions that place you at the right starting point.</p><button className="primary" onClick={() => setView("diagnostic")}>Resume <b>→</b></button><div className="course-progress"><span>COURSE PROGRESS</span><b>1 / 4 modules</b><div><i style={{width:"25%"}}></i></div></div></aside></div>
          <div className="more-modules"><span>COMING UP</span>{modules.slice(1).map((module) => <div key={module.number}><b>{module.number}</b><p>{module.title}<small>Unlock after Module 01</small></p><em>Locked</em></div>)}</div>
        </section>
        <section className="principles"><p className="kicker">HOW YOU’LL LEARN</p><div className="principle-grid"><article><b>01</b><h3>Commit</h3><p>Make a judgment before seeing an explanation.</p></article><article><b>02</b><h3>Defend</h3><p>Use evidence and clinical context to support it.</p></article><article><b>03</b><h3>Transfer</h3><p>Apply the idea in a new, unfamiliar case.</p></article></div></section>
      </>}

      {view === "diagnostic" && <section className="workspace"><header className="lesson-top"><button className="back" onClick={() => setView("overview")}>← Course home</button><div className="lesson-progress"><span>DIAGNOSTIC · {diagnosticStep + 1} OF 3</span><div><i style={{width: `${progress}%`}}></i></div></div><button className="exit" onClick={() => setView("overview")}>Save & exit</button></header><div className="lesson-grid"><div className="question-panel"><p className="eyebrow"><span></span> QUICK DIAGNOSTIC</p><h2>Start where you are.</h2><p className="prompt">{question}</p><textarea value={response} onChange={(event) => { setResponse(event.target.value); setDiagnosticFeedback(""); }} placeholder="Write what you notice. There’s no need to be certain." aria-label="Your response"/><div className="answer-actions"><button className="hint" onClick={() => setHint(Math.min(3, hint + 1))}>Need a hint? <span>+</span></button><button className="primary" onClick={continueDiagnostic} disabled={!response.trim() || tutorBusy}>{tutorBusy ? "Thinking…" : diagnosticFeedback ? (diagnosticStep === 2 ? "Begin Module 1" : "Next question") : "Ask the tutor"} <b>→</b></button></div>{hint > 0 && <div className="hint-card"><span>HINT {hint} / 3</span><p>{diagnosticHints[diagnosticStep][hint - 1]}</p></div>}{diagnosticFeedback && <div className="feedback-card"><span>TUTOR RESPONSE</span><p>{diagnosticFeedback}</p></div>}</div><aside className="tutor-panel"><div className="tutor-orb"><span></span></div><p className="kicker">YOUR SOCRATIC TUTOR</p><h3>I’ll ask. You’ll reason.</h3><p>I’ll look for your reasoning, not just a keyword. You can revise your answer at any point, or ask for increasingly specific help.</p><div className="rule"><b>ONE QUESTION</b><span>at a time</span></div><div className="rule"><b>THREE HINTS</b><span>from nudge to insight</span></div></aside></div></section>}

      {view === "lesson" && <section className="workspace"><header className="lesson-top"><button className="back" onClick={() => setView("overview")}>← Course home</button><div className="lesson-progress"><span>MODULE 01 · SECTION 1.2</span><div><i style={{width: "36%"}}></i></div></div><button className="exit" onClick={() => setView("overview")}>Save & exit</button></header><div className="lesson-grid"><div className="question-panel"><p className="eyebrow"><span></span> DATA TYPES</p><h2>What kind of thing is this?</h2><p className="prompt">A discharge disposition is recorded as “home,” “skilled nursing facility,” or “hospice.” Is this variable categorical, ordinal, or continuous? Defend your choice.</p><div className="case-strip"><span>CASE 01</span><p>The values are labels, but their labels may still carry meaningful clinical order.</p></div><textarea value={lessonResponse} onChange={(event) => setLessonResponse(event.target.value)} placeholder="Make your call, then tell me what evidence supports it." aria-label="Lesson response"/><div className="answer-actions"><button className="hint" onClick={() => setLessonHint(true)}>Ask for a nudge <span>+</span></button><button className="primary" disabled={!lessonResponse.trim()} onClick={() => setLessonFeedback(true)}>Submit reasoning <b>→</b></button></div>{lessonHint && <div className="hint-card"><span>NUDGE</span><p>First separate the kind of label from the meaning you might attach to it. Does the list have a natural numeric scale?</p></div>}{lessonFeedback && <div className="feedback-card"><span>GOOD REASONING</span><p>You noticed that these are labels, not measurements. Now test your choice: would every clinician agree on one fixed order from “home” to “hospice”?</p><button onClick={() => { setLessonFeedback(false); setLessonResponse(""); setStreak((value) => value + 1); }}>Try a transfer case →</button></div>}</div><aside className="tutor-panel"><div className="tutor-orb"><span></span></div><p className="kicker">YOUR SOCRATIC TUTOR</p><h3>Stay with the evidence.</h3><p>A defensible answer identifies what the values represent and whether their order has a consistent meaning.</p><div className="mastery"><span>MASTERY</span><b>36%</b><div><i></i></div></div></aside></div></section>}
      {view === "library" && <section className="resource-page"><p className="eyebrow"><span></span> MODULE 01 / SYLLABUS</p><h2>Prepare & Explore</h2><p className="resource-intro">Four short sections designed to make careful inspection a clinical reflex.</p><div className="resource-grid"><article><span>01.1</span><h3>Look before analysis</h3><p>Why every row and column deserves a first pass.</p></article><article><span>01.2</span><h3>Name the data type</h3><p>Distinguish labels, rank, and measurement.</p></article><article><span>01.3</span><h3>Inspect distributions</h3><p>Read center, spread, skew, and unusual values.</p></article><article><span>01.4</span><h3>Question missingness</h3><p>Ask what absence may be telling you.</p></article></div><button className="primary" onClick={() => setView("diagnostic")}>Begin the diagnostic <b>→</b></button></section>}
      {view === "notes" && <section className="resource-page notes-page"><p className="eyebrow"><span></span> YOUR LEARNING NOTES</p><h2>Make the ideas yours.</h2><p className="resource-intro">Notes stay on this device while you work through the course.</p><textarea aria-label="Learning notes" placeholder="Capture a question, a clinical example, or a pattern you want to remember…"/><p className="note-caption">Tip: Try writing one thing you noticed before one thing you learned.</p></section>}
      <footer><span>SOCRATIC STUDIO</span><span>Designed for careful minds.</span><span>© 2026</span></footer>
    </main>
  );
}
