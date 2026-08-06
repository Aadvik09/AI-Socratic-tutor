"use client";

import { useState } from "react";

type Lesson = { id: string; unit: string; title: string; kind: string; prompt: string; choices: string[]; correct: number; explanation: string; hint: string };

const lessons: Lesson[] = [
  { id: "01", unit: "READ DISTRIBUTIONS", title: "Spot the shape", kind: "Quick check", prompt: "A length-of-stay dataset has a mean of 4 days and a median of 2 days. What is the best interpretation?", choices: ["The distribution is perfectly symmetric.", "A few longer stays may be pulling the mean upward.", "Every patient stayed exactly 2 days.", "The median is necessarily a data-entry error."], correct: 1, explanation: "When the mean is above the median, a smaller number of high values often pulls the average upward. This is a common sign of right skew.", hint: "Which summary measure moves the most when unusually large values appear?" },
  { id: "02", unit: "DATA TYPES", title: "Name the variable", kind: "Socratic lesson", prompt: "A discharge disposition is recorded as “home,” “skilled nursing facility,” or “hospice.” What kind of variable is this?", choices: ["Continuous, because the options describe a range of outcomes.", "Ordinal, because each location has a fixed clinical ranking.", "Categorical, because the values are labels rather than measurements.", "Binary, because there are two kinds of patients."], correct: 2, explanation: "Discharge disposition is categorical. The values name groups; there is no universal numerical scale from home to hospice.", hint: "Does each value measure an amount, or does it name a group?" },
  { id: "03", unit: "OUTLIERS", title: "Investigate before removing", kind: "Clinical scenario", prompt: "A patient record has a creatinine value of 14.0. What should you do first?", choices: ["Delete it automatically because it is an outlier.", "Replace it with the mean creatinine value.", "Check clinical context and related fields before deciding whether it is an error.", "Round it down because it is unusually high."], correct: 2, explanation: "Unusual does not mean wrong. A creatinine of 14.0 can be clinically plausible and vital to the analysis; inspect the record before applying any rule.", hint: "Separate an unusual observation from an impossible one." },
  { id: "04", unit: "MISSINGNESS", title: "Ask why data are absent", kind: "Practice", prompt: "Blood-pressure values are missing mostly for patients who left the clinic early. Which statement is most accurate?", choices: ["The data are missing completely at random.", "The missingness may be related to patient behavior or clinical workflow and could bias results.", "Missing values never affect validity if the sample is large.", "The correct action is always to delete those rows."], correct: 1, explanation: "Missingness tied to leaving early is unlikely to be random. It can distort who is represented in the analysis and should be examined before imputation or deletion.", hint: "Could the reason a value is missing be connected to the patient or the care process?" },
];

export default function Home() {
  const [screen, setScreen] = useState<"home" | "course" | "lesson" | "notes">("home");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [tutorReply, setTutorReply] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const lesson = lessons[lessonIndex];
  const isCorrect = choice === lesson.correct;
  const mastery = Math.round((completed.length / lessons.length) * 100);

  function openLesson(index: number) { setLessonIndex(index); setChoice(null); setChecked(false); setShowHint(false); setTutorReply(""); setScreen("lesson"); }
  function checkAnswer() { if (choice !== null) setChecked(true); }
  function nextLesson() { if (isCorrect && !completed.includes(lessonIndex)) setCompleted([...completed, lessonIndex]); if (lessonIndex < lessons.length - 1) openLesson(lessonIndex + 1); else setScreen("course"); }
  async function askTutor() {
    setTutorLoading(true);
    try {
      const response = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: lesson.prompt, learnerAnswer: choice === null ? "No option selected yet." : lesson.choices[choice], hintLevel: showHint ? 1 : 0 }) });
      const payload = (await response.json()) as { reply?: string };
      setTutorReply(payload.reply || "Choose an answer first, then ask me to help you test your reasoning.");
    } catch { setTutorReply("The tutor is unavailable right now. You can still use the structured hint and answer explanation."); }
    finally { setTutorLoading(false); }
  }

  return <main className="course-app">
    <header className="app-header">
      <button className="app-brand" onClick={() => setScreen("home")} aria-label="SocraticAI home"><span className="brand-orbit"><i /></span><span>Socratic<span>AI</span></span></button>
      <nav><button className={screen === "course" ? "active" : ""} onClick={() => setScreen("course")}>Course</button><button onClick={() => setScreen("notes")}>Notebook</button></nav>
      <div className="header-progress"><span><b>{completed.length}</b> / 4 skills</span><i><b style={{ width: `${mastery}%` }} /></i><button className="profile-dot" aria-label="Profile">AK</button></div>
    </header>

    {screen === "home" && <section className="home-screen">
      <div className="home-copy"><p className="eyebrow"><i /> BASIC DATA LITERACY FOR CLINICIANS</p><h1>See the signal.<br/><em>Keep your judgment.</em></h1><p className="home-intro">A Socratic learning studio for people who need to think clearly about data—not simply receive the answer.</p><div className="home-actions"><button className="primary-button" onClick={() => setScreen("course")}>Enter Module 01 <span>→</span></button><button className="text-button" onClick={() => openLesson(0)}>Start a quick diagnostic <span>↗</span></button></div></div>
      <div className="home-orbit" aria-hidden="true"><p>MODULE<br/>01 / 04</p><div className="orbit-outer"><div className="orbit-middle"><div className="orbit-inner"><strong>DATA<br/>LITERACY</strong></div></div></div><span className="orbit-pulse" /></div>
      <div className="home-footer"><span>01 — PREPARE & EXPLORE</span><p>Learn to read distributions, distinguish variables, investigate outliers, and reason about what is missing.</p><button onClick={() => setScreen("course")}>Explore the curriculum <span>↓</span></button></div>
    </section>}

    {screen === "course" && <section className="course-screen"><aside className="course-sidebar"><div className="course-kicker">YOUR PATH <span>01 / 04</span></div><h2>Prepare<br/><em>& explore.</em></h2><p>Build the habit of inspecting information before you analyze it.</p><div className="mastery-block"><div><span>MODULE MASTERY</span><b>{mastery}%</b></div><i><em style={{ width: `${mastery}%` }} /></i></div><footer><span>●</span> Learning is local to this device.</footer></aside><section className="course-main"><p className="eyebrow"><i /> MODULE 01 — FOUNDATIONS</p><h1>Begin with the data<br/><em>in front of you.</em></h1><p className="course-intro">Four practical skills for reading clinical data with care, clarity, and better questions.</p><div className="module-meta"><span>4 learning experiences</span><span>~12 minutes</span><span>Adaptive tutor enabled</span></div><div className="skill-list">{lessons.map((item, index) => <button key={item.id} onClick={() => openLesson(index)}><span className={`skill-number ${completed.includes(index) ? "complete" : ""}`}>{completed.includes(index) ? "✓" : item.id}</span><div><small>{item.unit}</small><b>{item.title}</b><p>{item.kind}</p></div><em>{completed.includes(index) ? "Review" : index === 0 ? "Begin" : "Explore"} <span>→</span></em></button>)}</div></section></section>}

    {screen === "lesson" && <section className="lesson-screen"><aside className="lesson-rail"><button className="rail-back" onClick={() => setScreen("course")}>← <span>Back to module</span></button><div className="rail-mark"><span className="brand-orbit"><i /></span><p>SOCRATIC<br/>TUTOR</p></div><div className="rail-title"><span>MODULE 01</span><h2>Prepare<br/><em>& explore.</em></h2><p>A defensible answer begins with a careful question.</p></div><div className="rail-progress"><span>YOUR PROGRESS</span><b>{lessonIndex + 1}<em> / 4</em></b><i><strong style={{ width: `${((lessonIndex + 1) / lessons.length) * 100}%` }} /></i></div><div className="rail-list">{lessons.map((item, index) => <button key={item.id} className={lessonIndex === index ? "active" : ""} onClick={() => openLesson(index)}><span>{item.id}</span>{item.title}</button>)}</div></aside><section className="lesson-workspace"><div className="lesson-heading"><p className="eyebrow"><i /> {lesson.unit}</p><span>QUESTION {lessonIndex + 1} OF 4</span></div><article className="lesson-card"><p className="question-type">{lesson.kind}</p><h1>{lesson.title}</h1><p className="lesson-prompt">{lesson.prompt}</p><div className="answer-list">{lesson.choices.map((item, index) => <button key={item} disabled={checked} onClick={() => setChoice(index)} className={`${choice === index ? "selected" : ""} ${checked && index === lesson.correct ? "correct" : ""} ${checked && choice === index && index !== lesson.correct ? "incorrect" : ""}`}><span>{String.fromCharCode(65 + index)}</span><p>{item}</p></button>)}</div>{showHint && !checked && <div className="hint-box"><b>A nudge, not the answer</b><p>{lesson.hint}</p></div>}{checked && <div className={`answer-feedback ${isCorrect ? "correct" : "incorrect"}`}><b>{isCorrect ? "That’s it." : "Not quite yet."}</b><p>{isCorrect ? lesson.explanation : `The best answer is ${String.fromCharCode(65 + lesson.correct)}. ${lesson.explanation}`}</p></div>}</article><aside className="tutor-card"><div className="tutor-badge"><span>✦</span><p>SOCRATIC TUTOR</p></div><h2>Don’t rush<br/>the <em>why.</em></h2><p>I’ll challenge the reasoning, not just grade the result.</p><button className="tutor-ask" onClick={askTutor} disabled={tutorLoading}>{tutorLoading ? "Thinking…" : "Talk it through"} <span>↗</span></button>{tutorReply && <p className="tutor-reply">{tutorReply}</p>}<div className="tutor-loop"><span>LEARNING LOOP</span><p>Choose <b>→</b> Reason <b>→</b> Check <b>→</b> Apply</p></div></aside><footer className="lesson-actions"><button className="hint-link" onClick={() => setShowHint(true)}>Need a nudge? <span>+</span></button><p>{checked ? (isCorrect ? "Ready for what’s next" : "Read the explanation before continuing") : "Choose the best answer"}</p><button className="check-button" disabled={choice === null} onClick={checked ? nextLesson : checkAnswer}>{checked ? (lessonIndex === lessons.length - 1 ? "Finish module" : "Continue") : "Check answer"} <span>→</span></button></footer></section></section>}

    {screen === "notes" && <section className="notes-screen"><p className="eyebrow"><i /> YOUR WORKING NOTEBOOK</p><h1>Make the ideas<br/><em>your own.</em></h1><p>Capture questions, clinical examples, and patterns you want to remember.</p><textarea placeholder="Write the thought you want to keep…" /><span className="notes-tip">TIP — Write one thing you noticed before one thing you learned.</span></section>}
  </main>;
}
