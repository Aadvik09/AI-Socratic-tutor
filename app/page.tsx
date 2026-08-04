"use client";

import { useMemo, useState } from "react";

const modules = [
  { number: "01", title: "Prepare & Explore", label: "IN PROGRESS", progress: 36 },
  { number: "02", title: "Describe & Compare", label: "LOCKED", progress: 0 },
  { number: "03", title: "Reason with Evidence", label: "LOCKED", progress: 0 },
  { number: "04", title: "Communicate Clearly", label: "LOCKED", progress: 0 },
];

const diagnostic = [
  "A length-of-stay dataset has a mean of 4 days and a median of 2 days. What does that suggest about the distribution?",
  "A patient record has a creatinine value of 14.0. Before changing it, what would you want to know?",
  "Which of these is categorical: heart-failure stage, serum sodium, or length of stay? Why?",
];

export default function Home() {
  const [view, setView] = useState<"overview" | "diagnostic" | "lesson">("overview");
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [response, setResponse] = useState("");
  const [hint, setHint] = useState(0);
  const [streak, setStreak] = useState(4);
  const question = diagnostic[diagnosticStep];
  const progress = useMemo(() => Math.round(((diagnosticStep + (response ? 0.5 : 0)) / diagnostic.length) * 100), [diagnosticStep, response]);

  function continueDiagnostic() {
    if (!response.trim()) return;
    if (diagnosticStep < diagnostic.length - 1) {
      setDiagnosticStep((step) => step + 1);
      setResponse("");
      setHint(0);
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
        <div className="nav-links"><button onClick={() => setView("overview")}>Course</button><button>Library</button><button>Notes</button></div>
        <div className="profile"><span className="streak">✦ {streak} day streak</span><span className="avatar">AK</span></div>
      </nav>

      {view === "overview" && <>
        <section className="hero">
          <div className="eyebrow"><span></span> BASIC DATA LITERACY FOR CLINICIANS</div>
          <div className="hero-grid">
            <div><p className="kicker">MODULE ONE</p><h1>See the data<br/><em>before</em> you trust it.</h1><p className="lede">Build the habit of looking closely. Learn to notice what is missing, impossible, unusual, or quietly misleading — before it shapes a decision.</p><div className="hero-actions"><button className="primary" onClick={() => setView("diagnostic")}>Start your diagnostic <b>→</b></button><button className="text-button">View syllabus <span>↗</span></button></div></div>
            <aside className="hero-card"><div className="card-top"><span>YOUR PATH</span><span>MODULE 01 / 04</span></div><div className="radar"><div className="radar-ring ring-1"></div><div className="radar-ring ring-2"></div><div className="radar-ring ring-3"></div><div className="radar-dot"></div><div className="radar-label">DATA<br/>LITERACY</div></div><p>We’ll adapt the questions<br/>to your current understanding.</p></aside>
          </div>
        </section>
        <section className="course-section"><div className="section-head"><div><p className="kicker">THE COURSE</p><h2>Four modules. One sharper way of thinking.</h2></div><p>Your tutor does not hand you answers. It helps you build defensible reasoning — one question at a time.</p></div>
          <div className="module-list">{modules.map((module, index) => <button className={`module ${index === 0 ? "active" : ""}`} key={module.number} onClick={() => index === 0 && setView("diagnostic")}><span className="module-no">{module.number}</span><span className="module-title">{module.title}<small>{index === 0 ? "Data types · distributions · missingness" : "Available after Module 01"}</small></span><span className="module-status">{module.label}{module.progress > 0 && <span className="mini-progress"><i style={{width: `${module.progress}%`}}></i></span>}</span><span className="arrow">{index === 0 ? "→" : "↗"}</span></button>)}</div>
        </section>
        <section className="principles"><p className="kicker">HOW YOU’LL LEARN</p><div className="principle-grid"><article><b>01</b><h3>Commit</h3><p>Make a judgment before seeing an explanation.</p></article><article><b>02</b><h3>Defend</h3><p>Use evidence and clinical context to support it.</p></article><article><b>03</b><h3>Transfer</h3><p>Apply the idea in a new, unfamiliar case.</p></article></div></section>
      </>}

      {view === "diagnostic" && <section className="workspace"><header className="lesson-top"><button className="back" onClick={() => setView("overview")}>← Course home</button><div className="lesson-progress"><span>DIAGNOSTIC · {diagnosticStep + 1} OF 3</span><div><i style={{width: `${progress}%`}}></i></div></div><button className="exit" onClick={() => setView("overview")}>Save & exit</button></header><div className="lesson-grid"><div className="question-panel"><p className="eyebrow"><span></span> QUICK DIAGNOSTIC</p><h2>Start where you are.</h2><p className="prompt">{question}</p><textarea value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Write what you notice. There’s no need to be certain." aria-label="Your response"/><div className="answer-actions"><button className="hint" onClick={() => setHint(Math.min(3, hint + 1))}>Need a hint? <span>+</span></button><button className="primary" onClick={continueDiagnostic} disabled={!response.trim()}>{diagnosticStep === 2 ? "Begin Module 1" : "Continue"} <b>→</b></button></div>{hint > 0 && <div className="hint-card"><span>HINT {hint} / 3</span><p>{hint === 1 ? "Think about what a few unusually long stays would do to an average." : hint === 2 ? "Compare what the mean is sensitive to with what the median describes." : "A mean above the median often signals a right-skewed distribution: a smaller number of large values pull the average upward."}</p></div>}</div><aside className="tutor-panel"><div className="tutor-orb"><span></span></div><p className="kicker">YOUR SOCRATIC TUTOR</p><h3>I’ll ask. You’ll reason.</h3><p>I won’t rush to an answer. If you get stuck, I’ll offer a small nudge — then a little more.</p><div className="rule"><b>ONE QUESTION</b><span>at a time</span></div><div className="rule"><b>NO SHORTCUTS</b><span>before your attempt</span></div></aside></div></section>}

      {view === "lesson" && <section className="workspace"><header className="lesson-top"><button className="back" onClick={() => setView("overview")}>← Course home</button><div className="lesson-progress"><span>MODULE 01 · SECTION 1.2</span><div><i style={{width: "36%"}}></i></div></div><button className="exit" onClick={() => setView("overview")}>Save & exit</button></header><div className="lesson-grid"><div className="question-panel"><p className="eyebrow"><span></span> DATA TYPES</p><h2>What kind of thing is this?</h2><p className="prompt">A discharge disposition is recorded as “home,” “skilled nursing facility,” or “hospice.” Is this variable categorical, ordinal, or continuous? Defend your choice.</p><div className="case-strip"><span>CASE 01</span><p>The values are labels, but their labels may still carry meaningful clinical order.</p></div><textarea placeholder="Make your call, then tell me what evidence supports it." aria-label="Your response"/><div className="answer-actions"><button className="hint">Ask for a nudge <span>+</span></button><button className="primary">Submit reasoning <b>→</b></button></div></div><aside className="tutor-panel"><div className="tutor-orb"><span></span></div><p className="kicker">YOUR SOCRATIC TUTOR</p><h3>Stay with the evidence.</h3><p>A defensible answer identifies what the values represent and whether their order has a consistent meaning.</p><div className="mastery"><span>MASTERY</span><b>36%</b><div><i></i></div></div></aside></div></section>}
      <footer><span>SOCRATIC STUDIO</span><span>Designed for careful minds.</span><span>© 2026</span></footer>
    </main>
  );
}
