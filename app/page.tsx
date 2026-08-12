"use client";
import { useRef, useState } from "react";
type Question = {
  prompt: string;
  options: string[];
  correct: number;
  feedback: string;
  hint: string;
  challenge?: string;
};
type Lesson = {
  id: string;
  unit: string;
  title: string;
  description: string;
  concept: string;
  teaching: string;
  example: string;
  why: string;
  takeaways: string[];
  questions: Question[];
};
const lessons: Lesson[] = [
  {
    id: "01",
    unit: "READ DISTRIBUTIONS",
    title: "Read the shape before the average",
    description: "Use summaries to notice what the data may hide.",
    concept:
      "A distribution is the shape made by all observations. The mean moves with extreme values; the median is more resistant.",
    teaching:
      "Compare the mean and median before you call an average typical. A gap between them is an invitation to inspect the full distribution.",
    example:
      "Most patients stay 1–3 days, but a small group stays for weeks. The mean is 5 days; the median is 2.",
    why: "The long stays pull the mean upward. Reporting both values keeps the unusual stays from defining every patient.",
    takeaways: [
      "Mean above median often suggests right skew.",
      "Median is often closer to a typical patient when extremes are high.",
      "A summary should start a question, not end analysis.",
    ],
    questions: [
      {
        prompt:
          "Mean length of stay is 4 days and median is 2 days. What is the strongest interpretation?",
        options: [
          "The distribution is perfectly symmetric.",
          "A few long stays may be pulling the mean upward.",
          "Every stay was exactly 2 days.",
          "The median is an error.",
        ],
        correct: 1,
        feedback:
          "A smaller number of high values can pull the mean upward while leaving the median closer to a typical stay.",
        hint: "Which summary moves most when unusually large values appear?",
        challenge:
          "A clinic has mean wait time 31 minutes and median 18. What is the strongest interpretation?",
      },
      {
        prompt:
          "Which measure is least affected by one extremely long hospital stay?",
        options: ["Mean", "Median", "Range", "Maximum"],
        correct: 1,
        feedback:
          "The median depends on the middle position, so one high value affects it much less.",
        hint: "Think about the middle value after sorting.",
      },
      {
        prompt: "Why report both mean and median length of stay?",
        options: [
          "To hide variation",
          "To see whether extremes change the average",
          "Because the values must match",
          "Because median is categorical",
        ],
        correct: 1,
        feedback:
          "The comparison reveals whether a small group may be distorting the average.",
        hint: "What does the gap help you notice?",
      },
      {
        prompt: "Mean and median both equal 8. What is justified?",
        options: [
          "The data are definitely symmetric",
          "There are no outliers",
          "The summaries agree, but inspect the full shape",
          "Every value is 8",
        ],
        correct: 2,
        feedback:
          "Matching summaries are useful clues, not proof that a dataset has no unusual features.",
        hint: "Can two numbers describe every detail?",
      },
    ],
  },
  {
    id: "02",
    unit: "DATA TYPES",
    title: "Name the variable",
    description: "Recognize labels, order, counts, and measurements.",
    concept:
      "Data type determines which summaries and comparisons make sense. Categorical values name groups; ordinal values have order but unequal steps.",
    teaching:
      "Say what each field represents before calculating anything. A graph can look polished and still be misleading when it treats a label as a number.",
    example:
      "Discharge disposition is recorded as home, skilled nursing facility, hospice, or transferred.",
    why: "Those values identify groups. They do not form one universal clinical ladder, so the field is categorical.",
    takeaways: [
      "Categorical values are labels, not measurements.",
      "Ordinal values are ordered but step sizes are not known.",
      "Variable type constrains the claims you can defend.",
    ],
    questions: [
      {
        prompt:
          "Discharge disposition is home, skilled nursing facility, or hospice. What kind of variable is it?",
        options: ["Continuous", "Ordinal", "Categorical", "Binary"],
        correct: 2,
        feedback:
          "Disposition names groups; it is not a universal numeric scale.",
        hint: "Does each value measure an amount or name a group?",
        challenge:
          "Triage is red, yellow, or green. Which kind of field is this?",
      },
      {
        prompt:
          "Pain rated 0 through 10 is commonly treated as which kind of variable?",
        options: ["Nominal", "Ordinal", "Continuous", "Identifier"],
        correct: 1,
        feedback:
          "The ratings are ordered, but the clinical distance between steps is not guaranteed to be equal.",
        hint: "The values are ordered, but are their steps equal?",
      },
      {
        prompt: "Which field is a count?",
        options: [
          "Number of emergency visits",
          "Blood type",
          "Discharge disposition",
          "Patient race",
        ],
        correct: 0,
        feedback:
          "Counts record whole-number events, such as visits, falls, or medication administrations.",
        hint: "Which answer means 'how many?'",
      },
      {
        prompt: "Why does variable type matter before making a graph?",
        options: [
          "It determines meaningful comparisons",
          "It changes diagnosis",
          "It removes missing values",
          "It makes every field continuous",
        ],
        correct: 0,
        feedback:
          "Variable meaning determines whether averages, ordering, or group comparisons make sense.",
        hint: "A histogram and a bar chart do not make the same claim.",
      },
    ],
  },
  {
    id: "03",
    unit: "OUTLIERS",
    title: "Investigate before removing",
    description: "Separate unusual observations from impossible values.",
    concept:
      "An outlier may be a data error, a measurement issue, or an important clinical event. Context decides which one.",
    teaching:
      "Check the source, units, timing, and related fields before correcting or excluding a surprising record.",
    example:
      "A record contains creatinine of 14.0, much higher than most values in the file.",
    why: "It may indicate severe kidney injury. Compare units, repeat labs, diagnosis, and chart context before deciding it is an error.",
    takeaways: [
      "Unusual does not automatically mean incorrect.",
      "Use clinical context and data provenance first.",
      "Document any cleaning decision.",
    ],
    questions: [
      {
        prompt:
          "A patient record has creatinine 14.0. What should you do first?",
        options: [
          "Delete it",
          "Replace it with the mean",
          "Check context and related fields",
          "Round it down",
        ],
        correct: 2,
        feedback:
          "A creatinine of 14.0 can be clinically plausible and important. Investigate before changing it.",
        hint: "Separate an unusual value from an impossible one.",
      },
      {
        prompt: "What best helps verify a suspicious laboratory value?",
        options: [
          "Spreadsheet color",
          "Units, timestamp, and related results",
          "Its effect on the mean",
          "Number of rows",
        ],
        correct: 1,
        feedback:
          "Units, timing, and related evidence help distinguish a real event from a processing error.",
        hint: "What follows the value from lab to chart?",
      },
      {
        prompt: "Why can deleting every outlier be harmful?",
        options: [
          "It enlarges the dataset",
          "It can remove meaningful rare patients",
          "It blocks charts",
          "It changes labels to numbers",
        ],
        correct: 1,
        feedback:
          "Values far from the center can be exactly the cases that matter for safety and outcomes.",
        hint: "What might an extreme value represent besides a mistake?",
      },
      {
        prompt:
          "After correcting a confirmed entry error, what should be recorded?",
        options: [
          "Nothing",
          "Original value, evidence, and decision",
          "Only the new mean",
          "A new patient ID",
        ],
        correct: 1,
        feedback:
          "An audit trail makes the cleaning decision transparent and reviewable.",
        hint: "Could another analyst need to understand the change?",
      },
    ],
  },
  {
    id: "04",
    unit: "MISSINGNESS",
    title: "Ask why data are absent",
    description: "Look for the process behind a blank field.",
    concept:
      "Missing data are information about a process. The reason a value is absent can change who is represented in the analysis.",
    teaching:
      "Ask who is missing, when values become missing, and whether the care process connects that gap to the outcome.",
    example:
      "Blood-pressure values are missing mostly for patients who left the clinic early.",
    why: "The gaps are tied to workflow and perhaps behavior. Deleting those rows may systematically exclude a meaningful group.",
    takeaways: [
      "Missingness can create bias.",
      "Deleting incomplete rows is not automatically safe.",
      "The mechanism guides the next analytic step.",
    ],
    questions: [
      {
        prompt:
          "Blood pressure is missing mostly for patients who left early. Which statement is most accurate?",
        options: [
          "Missing completely at random",
          "Missingness may be tied to workflow and bias results",
          "Missingness never affects large samples",
          "Always delete those rows",
        ],
        correct: 1,
        feedback:
          "Missingness tied to leaving early is unlikely to be random and may change who is represented.",
        hint: "Could the reason be connected to care process?",
      },
      {
        prompt: "What is the best first question when many values are blank?",
        options: [
          "Which color should represent blanks?",
          "Why are values missing, and for whom?",
          "Can I delete rows today?",
          "What is the overall mean?",
        ],
        correct: 1,
        feedback:
          "Understand the missingness mechanism before deletion or imputation.",
        hint: "A blank is evidence about a process.",
      },
      {
        prompt: "Why might deleting every incomplete row create bias?",
        options: [
          "It removes a non-random group",
          "It guarantees better predictions",
          "It changes categories",
          "It removes outliers",
        ],
        correct: 0,
        feedback:
          "Patterned missingness changes the population represented in the result.",
        hint: "Are removed patients likely to be a random sample?",
      },
      {
        prompt: "Which action supports transparent handling of missing data?",
        options: [
          "Hide it",
          "Describe the amount, pattern, and method",
          "Replace all blanks with zero",
          "Assume every blank is negative",
        ],
        correct: 1,
        feedback:
          "Readers need to know how much is missing, why it may be missing, and how it was handled.",
        hint: "What would a careful reviewer need to know?",
      },
    ],
  },
];
const learningExtras = [
  {
    steps: [
      "Sketch or view a histogram before reporting a single average.",
      "Compare mean and median; then ask which patients form the tail.",
      "Report the summary that matches the decision you are trying to support.",
    ],
    sources: [
      {
        label: "NIST: measures of location",
        href: "https://itl.nist.gov/div898/handbook/eda/section3/eda351.htm",
      },
      {
        label: "NIST: distribution, location, spread, and shape",
        href: "https://www.itl.nist.gov/div898/handbook/ppc/section1/ppc131.htm",
      },
    ],
  },
  {
    steps: [
      "Write a plain-language definition of every field before analysis.",
      "Ask whether a number represents amount, order, count, or an identifier.",
      "Choose summaries and charts that respect the variable's meaning.",
    ],
    sources: [
      {
        label: "NCBI Bookshelf: types of variables",
        href: "https://www.ncbi.nlm.nih.gov/books/NBK557882/",
      },
      {
        label: "NIST: exploratory data analysis",
        href: "https://itl.nist.gov/div898/handbook/eda/section1/eda11.htm",
      },
    ],
  },
  {
    steps: [
      "Flag a potential outlier; do not delete it immediately.",
      "Check units, timestamp, source system, and related clinical evidence.",
      "Document any correction, exclusion, or retained value.",
    ],
    sources: [
      {
        label: "NIST: what are outliers?",
        href: "https://www.itl.nist.gov/div898/handbook/prc/section1/prc16.htm",
      },
      {
        label: "NIST: detection of outliers",
        href: "https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm",
      },
    ],
  },
  {
    steps: [
      "Measure how much is missing and which patients are affected.",
      "Look for workflow events that may explain the gaps.",
      "State the missing-data assumption before drawing conclusions.",
    ],
    sources: [
      {
        label: "NCBI: missing data in clinical trials",
        href: "https://www.ncbi.nlm.nih.gov/books/NBK209902/",
      },
      {
        label: "CDC NHSN data quality manual",
        href: "https://www.cdc.gov/nhsn/pdfs/pscmanual/instructions_dq.pdf",
      },
    ],
  },
];
const lessonVisuals = [
  {
    src: "/distribution-mean-median.png",
    alt: "A right-skewed distribution with one center marker near the main cluster and another marker pulled toward the long right tail.",
    caption:
      "Read the shape first: in this right-skewed distribution, longer stays pull the mean rightward while the median stays nearer the typical patient.",
  },
  {
    src: "/data-types.png",
    alt: "Clinical data cards and tokens organized into groups, ordered levels, counts, and a measured scale.",
    caption:
      "Before calculating, identify what the values stand for: labels, ordered ratings, counts, or measurements invite different summaries.",
  },
  {
    src: "/outlier-investigation.png",
    alt: "One highlighted data point connected to a specimen tube, clock, and patient record as evidence to investigate.",
    caption:
      "An unusual value is a prompt to investigate its units, timing, and source—not a signal to delete it automatically.",
  },
  {
    src: "/missingness-workflow.png",
    alt: "A clinical data grid with intentional blank cells and a pathway through care workflow.",
    caption:
      "Blank values can reflect the care process. Ask who is missing and why before removing incomplete records.",
  },
];
const briefingVisuals = [
  {
    src: "/honest-chart.png",
    alt: "Two bar charts compare a visually exaggerated truncated-axis chart with an honest full-baseline chart.",
    caption:
      "A chart can look dramatic because of its axis, not because the clinical difference is large. Check the baseline before interpreting the gap.",
  },
  {
    src: "/data-types.png",
    alt: "Clinical data cards and tokens organized into groups, ordered levels, counts, and a measured scale.",
    caption:
      "The visual grouping mirrors the analytical decision: label, ranking, count, or measurement. Do not let a numeric code disguise a category.",
  },
  {
    src: "/outlier-investigation.png",
    alt: "One highlighted data point connected to a specimen tube, clock, and patient record as evidence to investigate.",
    caption:
      "Follow the highlighted value back to its source, units, time, and patient context before labeling it an error.",
  },
  {
    src: "/missingness-process.png",
    alt: "A clinical dataset with a missing column connected to check-in, scheduling, and patient workflow.",
    caption:
      "The missing cells cluster around a process. That pattern can be evidence about who was measured and who may be absent from the analysis.",
  },
];
const lessonDeepDives = [
  [
    {
      title: "Read both centers",
      copy: "The mean uses every observation, so a handful of unusually long stays can pull it upward. The median is the middle position after sorting and is more resistant to that pull.",
      example:
        "If most stays are 1–3 days and a small group lasts weeks, the median may stay near 2 days while the mean rises to 5.",
    },
    {
      title: "Inspect the pattern behind them",
      copy: "A histogram or ordered plot helps you see whether the difference is a long tail, two clinical subgroups, or a possible data problem.",
      example:
        "Before saying a service has a five-day typical stay, check whether a small ICU group is creating the tail.",
    },
    {
      title: "Make a measured claim",
      copy: "Report the summary that matches the clinical decision, and state what it does not show.",
      example:
        "For a typical patient experience, report the median and describe the long-stay tail rather than treating the mean as everyone’s experience.",
    },
  ],
  [
    {
      title: "Meaning comes before math",
      copy: "A number or code can still be a label. The value’s meaning—not the way it is stored—determines whether arithmetic is legitimate.",
      example:
        "Coding home as 1 and hospice as 3 does not make an average code of 2 a meaningful clinical outcome.",
    },
    {
      title: "Separate order from distance",
      copy: "Ordinal data have a meaningful order, but the distance between neighboring values is not guaranteed to be equal.",
      example:
        "Pain rated 8 is higher than 4, but it is not necessarily twice as much pain.",
    },
    {
      title: "Choose the matching display",
      copy: "Bar charts compare named groups; histograms show the distribution of measured quantities.",
      example:
        "Use a bar chart for discharge disposition and a histogram for length of stay.",
    },
  ],
  [
    {
      title: "Trace the value to its source",
      copy: "Start with the source system, units, timestamp, and any transfer or transcription steps before editing a surprising value.",
      example:
        "A shifted decimal or unit mismatch can look extreme, but so can a real episode of severe kidney injury.",
    },
    {
      title: "Check clinical consistency",
      copy: "Related lab values, repeated measures, diagnoses, and notes help distinguish a data error from an important event.",
      example:
        "A high creatinine paired with dialysis documentation tells a different story than one that conflicts with the entire chart.",
    },
    {
      title: "Leave an audit trail",
      copy: "A cleaning decision should be reviewable: record the original value, supporting evidence, and the action taken.",
      example:
        "Another analyst should be able to explain why a record was retained, corrected, or excluded.",
    },
  ],
  [
    {
      title: "Describe the pattern of blanks",
      copy: "Begin by measuring how much is missing, which fields are affected, and which patients have missing values.",
      example:
        "Twelve percent missing BMI has different implications when it clusters in one walk-in clinic.",
    },
    {
      title: "Connect gaps to the care process",
      copy: "Scheduling, documentation, device access, and an early departure can determine whether an observation was ever collected.",
      example:
        "Patients who leave before triage can lack blood pressure because the measurement opportunity never occurred.",
    },
    {
      title: "State the analytic assumption",
      copy: "The likely missingness mechanism should guide deletion, imputation, and how widely the result can be generalized.",
      example:
        "Removing all incomplete rows could underrepresent patients with short visits if their values are systematically absent.",
    },
  ],
];
const tutorScenarios = [
  {
    case: "Most patients in a length-of-stay file are discharged in 1–3 days. A small group stays for weeks; the mean is 5 days and the median is 2 days.",
    prompt:
      "Before checking any answer, what would you report to a care team as the more typical stay—and what evidence supports that choice?",
    probe:
      "Now name one visual or summary you would inspect next before making a claim about the whole distribution.",
  },
  {
    case: "A discharge field contains home, skilled nursing facility, hospice, and transferred. A colleague proposes computing its average code.",
    prompt:
      "Commit to a position: what is problematic about that plan, if anything? Explain using what the values represent.",
    probe:
      "Choose one appropriate way to summarize or display this field and explain why it respects the data type.",
  },
  {
    case: "One creatinine value is far above the rest of a clinical dataset. The analyst has not yet checked the source system, units, or chart context.",
    prompt:
      "What should the analyst do before changing this record? Commit to a first step and explain why.",
    probe:
      "Name two pieces of evidence that would help distinguish a data error from a clinically important extreme value.",
  },
  {
    case: "Blood-pressure values are blank most often for patients who leave a clinic appointment early.",
    prompt:
      "What does this pattern make you wonder about? Commit to one concern before deciding how to handle the blanks.",
    probe:
      "How could deleting every incomplete row change the patients represented in the analysis?",
  },
];
const diagnostic: Question[] = [
  {
    prompt: "Which value is least affected by one extremely long stay?",
    options: ["Mean", "Median", "Range", "Maximum"],
    correct: 1,
    feedback: "Median is resistant to a single extreme value.",
    hint: "Think about the middle value.",
  },
  {
    prompt: "Is a patient ID a measurement?",
    options: [
      "Yes",
      "No, it is an identifier",
      "Only if it has digits",
      "Only if it is unique",
    ],
    correct: 1,
    feedback: "An identifier labels a record; it is not a quantity.",
    hint: "Does it represent an amount?",
  },
  {
    prompt: "What happens first when a value looks impossible?",
    options: [
      "Delete it",
      "Check source, units, and context",
      "Replace with zero",
      "Ignore it",
    ],
    correct: 1,
    feedback: "Investigate provenance before changing a record.",
    hint: "Could units or context explain it?",
  },
  {
    prompt: "Why inspect missing values?",
    options: [
      "They may reflect process and bias results",
      "They are always zero",
      "They never affect results",
      "They mean healthy patients",
    ],
    correct: 0,
    feedback: "Missingness can be a meaningful pattern.",
    hint: "A blank tells you something about process.",
  },
  {
    prompt: "Mean and median differ. What should you do next?",
    options: [
      "Assume an error",
      "Inspect distribution and extremes",
      "Delete the median",
      "Report only the mean",
    ],
    correct: 1,
    feedback: "The difference is a reason to inspect shape and extremes.",
    hint: "What could pull one summary away from the other?",
  },
];
export default function Home() {
  const [screen, setScreen] = useState<
    "home" | "course" | "lesson" | "diagnostic" | "result" | "notes"
  >("home");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [stage, setStage] = useState<
    "learn" | "media" | "tutor" | "practice" | "complete"
  >("learn");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [hint, setHint] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [unlocked, setUnlocked] = useState(0);
  const [tutorReply, setTutorReply] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorTurns, setTutorTurns] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const narrationAudio = useRef<HTMLAudioElement | null>(null);
  const [mediaPlayed, setMediaPlayed] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagChoice, setDiagChoice] = useState<number | null>(null);
  const [diagScore, setDiagScore] = useState(0);
  const [level, setLevel] = useState<"Foundation" | "Standard" | "Accelerated">(
    "Foundation",
  );
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [quickNote, setQuickNote] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const lesson = lessons[lessonIndex];
  const questions = lesson.questions.map((q) =>
    level === "Accelerated" && q.challenge ? { ...q, prompt: q.challenge } : q,
  );
  const question = questions[questionIndex];
  const extra = learningExtras[lessonIndex];
  const visual = lessonVisuals[lessonIndex];
  const briefingVisual = briefingVisuals[lessonIndex];
  const deepDive = lessonDeepDives[lessonIndex];
  const tutorScenario = tutorScenarios[lessonIndex];
  const mastery = Math.round((completed.length / lessons.length) * 100);
  function openLesson(index: number) {
    if (index > unlocked) return;
    setLessonIndex(index);
    setStage("learn");
    setQuestionIndex(0);
    setChoice(null);
    setFeedback("idle");
    setHint(false);
    setTutorReply("");
    setTutorInput("");
    setTutorTurns([]);
    setScreen("lesson");
  }
  function startPractice() {
    setStage("practice");
    setQuestionIndex(0);
    setChoice(null);
    setFeedback("idle");
    setHint(false);
  }
  function checkAnswer() {
    if (choice !== null)
      setFeedback(choice === question.correct ? "correct" : "incorrect");
  }
  function nextQuestion() {
    if (feedback !== "correct") return;
    if (questionIndex < 3) {
      setQuestionIndex(questionIndex + 1);
      setChoice(null);
      setFeedback("idle");
      setHint(false);
      return;
    }
    if (!completed.includes(lessonIndex))
      setCompleted([...completed, lessonIndex]);
    if (lessonIndex < 3) setUnlocked(lessonIndex + 1);
    setStage("complete");
  }
  function retry() {
    setChoice(null);
    setFeedback("idle");
    setHint(false);
  }
  function startMedia() {
    setStage("media");
    setMediaPlayed(false);
  }
  function startTutor() {
    setStage("tutor");
    setTutorReply("");
    setTutorInput("");
    setTutorTurns([]);
  }
  function stopNarration() {
    if (narrationAudio.current) {
      narrationAudio.current.pause();
      narrationAudio.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsReading(false);
  }
  function playBrowserFallback(text: string) {
    if (!("speechSynthesis" in window)) {
      setIsReading(false);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      /marin|jenny|aria|samantha|google us english|ava|zira/i.test(voice.name),
    );
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = preferredVoice ?? null;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  }
  async function toggleLessonAudio() {
    if (isReading) {
      stopNarration();
      return;
    }
    const narration = [
      lesson.title,
      lesson.concept,
      lesson.teaching,
      "Clinical example. " + lesson.example,
      "Why it matters. " + lesson.why,
    ].join(". ");
    setIsReading(true);
    try {
      const response = await fetch("/api/narration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narration }),
      });
      if (!response.ok) throw new Error("Natural narration unavailable.");
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      narrationAudio.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        narrationAudio.current = null;
        setIsReading(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        narrationAudio.current = null;
        playBrowserFallback(narration);
      };
      await audio.play();
    } catch {
      playBrowserFallback(narration);
    }
  }
  function saveQuickNote() {
    const note = quickNote.trim();
    if (!note) return;
    setSavedNotes([note, ...savedNotes]);
    setQuickNote("");
    setNotebookOpen(false);
  }
  function beginDiagnostic() {
    setDiagIndex(0);
    setDiagChoice(null);
    setDiagScore(0);
    setScreen("diagnostic");
  }
  function submitDiagnostic() {
    if (diagChoice === null) return;
    const score =
      diagScore + (diagChoice === diagnostic[diagIndex].correct ? 1 : 0);
    if (diagIndex < 4) {
      setDiagScore(score);
      setDiagIndex(diagIndex + 1);
      setDiagChoice(null);
    } else {
      setDiagScore(score);
      setLevel(
        score >= 4 ? "Accelerated" : score >= 2 ? "Standard" : "Foundation",
      );
      setScreen("result");
    }
  }
  async function submitTutorTurn() {
    if (!tutorInput.trim()) return;
    const answer = tutorInput.trim();
    setTutorLoading(true);
    try {
      const currentPrompt =
        tutorTurns.length === 0 ? tutorScenario.prompt : tutorScenario.probe;
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${tutorScenario.case}\n\n${currentPrompt}`,
          learnerAnswer: answer,
          hintLevel: Math.min(tutorTurns.length, 2),
        }),
      });
      const data = (await r.json()) as {
        reply?: string;
      };
      setTutorReply(
        data.reply ||
          "Name the evidence that supports your position before you move on.",
      );
      setTutorTurns([...tutorTurns, answer]);
      setTutorInput("");
    } catch {
      setTutorReply(
        "The tutor is unavailable right now. Revisit the case, name your evidence, and continue when you are ready.",
      );
      setTutorTurns([...tutorTurns, answer]);
      setTutorInput("");
    } finally {
      setTutorLoading(false);
    }
  }
  function detailedExplanation() {
    const letter = String.fromCharCode(65 + question.correct);
    return (
      "Choice " +
      letter +
      " is correct. " +
      question.feedback +
      " The key idea is: " +
      lesson.concept +
      " This answer is supported by the information in the question; the other choices either assume more than the evidence shows or confuse the type, process, or summary being considered."
    );
  }
  return (
    <main className="course-app">
      <header className="app-header">
        <button className="app-brand" onClick={() => setScreen("home")}>
          <span className="brand-orbit">
            <i />
          </span>
          <span>
            Socratic<span>AI</span>
          </span>
        </button>
        <nav>
          <button
            className={screen === "course" ? "active" : ""}
            onClick={() => setScreen("course")}
          >
            Course
          </button>
          <button
            className={screen === "diagnostic" ? "active" : ""}
            onClick={beginDiagnostic}
          >
            Diagnostic
          </button>
          <button onClick={() => setScreen("notes")}>Notebook</button>
        </nav>
        <div className="header-progress">
          <span>
            <b>{completed.length}</b> / 4 skills
          </span>
          <i>
            <b style={{ width: `${mastery}%` }} />
          </i>
          <button className="profile-dot">AK</button>
        </div>
      </header>

      {screen === "home" && (
        <section className="home-screen">
          <div className="home-copy">
            <p className="eyebrow">
              <i /> BASIC DATA LITERACY FOR CLINICIANS
            </p>
            <h1>
              See the signal.
              <br />
              <em>Keep your judgment.</em>
            </h1>
            <p className="home-intro">
              A clinical data literacy studio that brings together written
              explanation, visual and audio briefings, Socratic reasoning, and
              independent retrieval practice.
            </p>
            <div className="home-sequence">
              <span>
                <b>01</b> Brief
              </span>
              <i>→</i>
              <span>
                <b>02</b> Reason
              </span>
              <i>→</i>
              <span>
                <b>03</b> Retrieve
              </span>
            </div>
            <div className="home-actions">
              <button
                className="primary-button"
                onClick={() => setScreen("course")}
              >
                Enter Module 01 <span>&rarr;</span>
              </button>
              <button className="text-button" onClick={beginDiagnostic}>
                Take the diagnostic <span>&rarr;</span>
              </button>
            </div>
          </div>
          <div className="home-orbit">
            <p>
              MODULE
              <br />
              01 / 04
            </p>
            <div className="orbit-outer">
              <div className="orbit-middle">
                <div className="orbit-inner">
                  <strong>
                    DATA
                    <br />
                    LITERACY
                  </strong>
                </div>
              </div>
            </div>
            <span className="orbit-pulse" />
          </div>
          <div className="home-footer">
            <span>01 — PREPARE & EXPLORE</span>
            <p>
              Learn the concept, work through a clinical example, then earn
              mastery through four questions.
            </p>
            <button onClick={() => setScreen("course")}>
              Explore curriculum <span>↓</span>
            </button>
          </div>
        </section>
      )}

      {screen === "diagnostic" && (
        <section className="diagnostic-screen">
          <div className="diagnostic-aside">
            <p className="eyebrow">
              <i /> SEPARATE PLACEMENT DIAGNOSTIC
            </p>
            <h1>
              Find your
              <br />
              <em>starting point.</em>
            </h1>
            <p>
              This five-question check only selects a starting level. It never
              unlocks or completes a course skill.
            </p>
            <div className="diagnostic-meter">
              <span>QUESTION {diagIndex + 1} OF 5</span>
              <i>
                <b style={{ width: `${(diagIndex + 1) * 20}%` }} />
              </i>
            </div>
          </div>
          <article className="diagnostic-card">
            <p className="question-type">PLACEMENT CHECK</p>
            <h2>{diagnostic[diagIndex].prompt}</h2>
            <div className="answer-list diagnostic-options">
              {diagnostic[diagIndex].options.map((x, i) => (
                <button
                  key={x}
                  className={diagChoice === i ? "selected" : ""}
                  onClick={() => setDiagChoice(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  <p>{x}</p>
                </button>
              ))}
            </div>
            <button
              className="check-button"
              disabled={diagChoice === null}
              onClick={submitDiagnostic}
            >
              Continue <span>&rarr;</span>
            </button>
          </article>
        </section>
      )}

      {screen === "result" && (
        <section className="result-screen">
          <p className="eyebrow">
            <i /> DIAGNOSTIC COMPLETE
          </p>
          <h1>
            Your starting level:
            <br />
            <em>{level}.</em>
          </h1>
          <p>
            {level === "Accelerated"
              ? "You demonstrated strong foundations. Where available, the course will use more demanding question wording."
              : level === "Standard"
                ? "You have useful foundations. The lessons will build fluency with clear explanations and applied checks."
                : "You have a clear place to begin. Module 1 will teach each core idea before asking you to use it."}
          </p>
          <div>
            <span>{diagScore} / 5 correct</span>
            <button
              className="primary-button"
              onClick={() => setScreen("course")}
            >
              Start Module 01 <span>&rarr;</span>
            </button>
          </div>
        </section>
      )}

      {screen === "course" && (
        <section className="course-screen">
          <aside className="course-sidebar">
            <div className="course-kicker">
              YOUR PATH <span>01 / 04</span>
            </div>
            <h2>
              Prepare
              <br />
              <em>& explore.</em>
            </h2>
            <p>
              Read the structure of clinical data before you use it to draw a
              conclusion.
            </p>
            <div className="mastery-block">
              <div>
                <span>MODULE MASTERY</span>
                <b>{mastery}%</b>
              </div>
              <i>
                <em style={{ width: `${mastery}%` }} />
              </i>
            </div>
            <div className="path-legend">
              <span>
                <i /> Learned
              </span>
              <span>
                <i /> Locked until prior mastery
              </span>
            </div>
            <footer>
              <span>●</span> Diagnostic level: {level}
            </footer>
          </aside>
          <section className="course-main">
            <p className="eyebrow">
              <i /> MODULE 01 — FOUNDATIONS
            </p>
            <h1>
              Learn first.
              <br />
              <em>Then prove it.</em>
            </h1>
            <p className="course-intro">
              Each skill moves from a detailed teaching lesson and clinical
              examples, through a visual + spoken briefing and required Socratic
              case, then into an independent four-question mastery check.
            </p>
            <div className="module-meta">
              <span>4 teaching lessons</span>
              <span>16 mastery questions</span>
              <span>Adaptive level: {level}</span>
            </div>
            <div className="skill-list">
              {lessons.map((item, index) => {
                const locked = index > unlocked;
                return (
                  <button
                    key={item.id}
                    disabled={locked}
                    className={locked ? "locked" : ""}
                    onClick={() => openLesson(index)}
                  >
                    <span
                      className={`skill-number ${completed.includes(index) ? "complete" : ""}`}
                    >
                      {completed.includes(index) ? "✓" : locked ? "•" : item.id}
                    </span>
                    <div>
                      <small>{item.unit}</small>
                      <b>{item.title}</b>
                      <p>
                        {completed.includes(index)
                          ? "Mastered — review lesson and questions"
                          : locked
                            ? "Complete the previous skill to unlock"
                            : "Detailed lesson + briefing + tutor + quiz"}
                      </p>
                    </div>
                    <em>
                      {completed.includes(index)
                        ? "Review"
                        : locked
                          ? "Locked"
                          : "Begin"}{" "}
                      <span>&rarr;</span>
                    </em>
                  </button>
                );
              })}
            </div>
          </section>
        </section>
      )}

      {screen === "lesson" && (
        <section
          className={
            "lesson-screen " + (railOpen ? "rail-open" : "rail-closed")
          }
        >
          <aside className="lesson-rail">
            <button className="rail-back" onClick={() => setScreen("course")}>
              ← <span>Back to module</span>
            </button>
            <div className="rail-mark">
              <span className="brand-orbit">
                <i />
              </span>
              <p>
                SOCRATIC
                <br />
                TUTOR
              </p>
            </div>
            <div className="rail-title">
              <span>MODULE 01</span>
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
            </div>
            <div className="rail-progress">
              <span>SKILL STATUS</span>
              <b>
                {stage === "learn"
                  ? "Learn"
                  : stage === "media"
                    ? "Media"
                    : stage === "tutor"
                      ? "Tutor"
                      : stage === "practice"
                        ? `${questionIndex + 1}/4`
                        : "Done"}
              </b>
              <i>
                <strong
                  style={{
                    width: `${stage === "learn" ? 18 : stage === "media" ? 34 : stage === "tutor" ? 52 : stage === "practice" ? 62 + questionIndex * 9 : 100}%`,
                  }}
                />
              </i>
            </div>
            <div className="rail-list">
              {lessons.map((item, index) => (
                <button
                  key={item.id}
                  disabled={index > unlocked}
                  className={lessonIndex === index ? "active" : ""}
                  onClick={() => openLesson(index)}
                >
                  <span>{completed.includes(index) ? "✓" : item.id}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </aside>
          <button
            className="rail-toggle"
            aria-label={
              railOpen
                ? "Minimize lesson navigation"
                : "Expand lesson navigation"
            }
            onClick={() => setRailOpen(!railOpen)}
          >
            {railOpen ? "‹" : "☰"}
            <span>{railOpen ? "Minimize path" : "Course path"}</span>
          </button>
          <section className="lesson-workspace">
            <div className="lesson-layout">
              <div className="lesson-content">
                <div className="lesson-heading">
                  <p className="eyebrow">
                    <i /> {lesson.unit}
                  </p>
                  <span>
                    {stage === "learn"
                      ? "TEACHING LESSON"
                      : stage === "media"
                        ? "AUDIO + VISUAL BRIEFING"
                        : stage === "tutor"
                          ? "REQUIRED TUTOR SESSION"
                          : stage === "practice"
                            ? `MASTERY QUESTION ${questionIndex + 1} OF 4`
                            : "SKILL COMPLETE"}
                  </span>
                </div>
                {stage === "learn" && (
                  <article className="teaching-card">
                    <p className="question-type">THE CORE IDEA</p>
                    <h1>{lesson.title}</h1>
                    <p className="lesson-lead">{lesson.concept}</p>
                    <p className="lesson-body">{lesson.teaching}</p>
                    <figure className="lesson-visual">
                      <img src={visual.src} alt={visual.alt} />
                      <figcaption>{visual.caption}</figcaption>
                    </figure>
                    <button
                      className="lesson-audio"
                      onClick={toggleLessonAudio}
                    >
                      <span>{isReading ? "■" : "▶"}</span>
                      {isReading
                        ? "Stop audio overview"
                        : "Listen to this lesson"}
                    </button>
                    <section className="example-card">
                      <span>CLINICAL EXAMPLE</span>
                      <p>{lesson.example}</p>
                      <strong>Why it matters</strong>
                      <p>{lesson.why}</p>
                    </section>
                    <section className="deep-dive">
                      <p className="question-type">BUILD THE IDEA</p>
                      {deepDive.map((item, index) => (
                        <article key={item.title}>
                          <span>0{index + 1}</span>
                          <div>
                            <h2>{item.title}</h2>
                            <p>{item.copy}</p>
                            <aside>
                              <b>Clinical example</b>
                              {item.example}
                            </aside>
                          </div>
                        </article>
                      ))}
                    </section>
                    <section className="takeaways">
                      <span>KEEP THESE IN MIND</span>
                      {lesson.takeaways.map((x) => (
                        <p key={x}>
                          <i>+</i>
                          {x}
                        </p>
                      ))}
                    </section>
                    <button className="primary-button" onClick={startMedia}>
                      Start audio + visual briefing <span>&rarr;</span>
                    </button>
                  </article>
                )}
                {stage === "media" && (
                  <article className="media-briefing">
                    <div className="tutor-session-top">
                      <p className="question-type">
                        REQUIRED AUDIO + VISUAL BRIEFING
                      </p>
                      <span>UNGRADED · BEFORE TUTOR</span>
                    </div>
                    <h1>
                      See the pattern.
                      <br />
                      <em>Hear the reasoning.</em>
                    </h1>
                    <p className="lesson-lead">
                      Use this short briefing to connect the written idea, the
                      image, and the clinical example before you enter the
                      Socratic case.
                    </p>
                    <figure className="media-visual">
                      <img src={briefingVisual.src} alt={briefingVisual.alt} />
                      <figcaption>{briefingVisual.caption}</figcaption>
                    </figure>
                    <button
                      className="media-play"
                      onClick={() => {
                        toggleLessonAudio();
                        setMediaPlayed(true);
                      }}
                    >
                      <span>{isReading ? "■" : "▶"}</span>
                      {isReading
                        ? "Stop spoken briefing"
                        : "Play spoken briefing"}
                    </button>
                    <p className="media-note">
                      A warm, measured narrator connects the core idea, clinical
                      example, and why it matters. Use the image as you listen,
                      then move into the required dialogue.
                    </p>
                    {lessonIndex === 0 && (
                      <a
                        className="media-reference"
                        href="https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/more-mean-median/v/impact-on-median-and-mean-when-increasing-highest-value"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch the optional companion video <span>↗</span>
                      </a>
                    )}
                    <button
                      className="primary-button"
                      disabled={!mediaPlayed}
                      onClick={startTutor}
                    >
                      Continue to required tutor session <span>&rarr;</span>
                    </button>
                  </article>
                )}
                {stage === "tutor" && (
                  <article className="guided-tutor">
                    <div className="tutor-session-top">
                      <p className="question-type">
                        REQUIRED PRE-QUIZ DIALOGUE
                      </p>
                      <span>
                        STEP {Math.min(tutorTurns.length + 1, 2)} OF 2
                      </span>
                    </div>
                    <h1>
                      Commit, then
                      <br />
                      <em>test your thinking.</em>
                    </h1>
                    <p className="lesson-lead">
                      This is formative and ungraded. Make a defensible claim
                      before the quiz asks you to retrieve it independently.
                    </p>
                    <section className="tutor-case">
                      <span>CLINICAL CASE</span>
                      <p>{tutorScenario.case}</p>
                    </section>
                    {tutorTurns.length < 2 && (
                      <>
                        <p className="tutor-prompt">
                          {tutorTurns.length === 0
                            ? tutorScenario.prompt
                            : tutorScenario.probe}
                        </p>
                        <textarea
                          aria-label="Your tutor response"
                          value={tutorInput}
                          onChange={(event) =>
                            setTutorInput(event.target.value)
                          }
                          placeholder="State your position and the evidence behind it..."
                        />
                        <button
                          className="primary-button"
                          disabled={!tutorInput.trim() || tutorLoading}
                          onClick={submitTutorTurn}
                        >
                          {tutorLoading
                            ? "Tutor is considering your reasoning..."
                            : tutorTurns.length === 0
                              ? "Submit my position"
                              : "Respond to the probe"}{" "}
                          <span>&rarr;</span>
                        </button>
                      </>
                    )}
                    {tutorReply && (
                      <section className="tutor-response">
                        <span>SOCRATIC TUTOR</span>
                        <p>{tutorReply}</p>
                      </section>
                    )}
                    {tutorTurns.length >= 2 && (
                      <section className="tutor-complete">
                        <b>Pre-quiz reasoning complete</b>
                        <p>
                          You have made a claim, defended it with evidence, and
                          considered a second probe. Now use retrieval practice
                          to show what you can do independently.
                        </p>
                        <button
                          className="primary-button"
                          onClick={startPractice}
                        >
                          Begin four-question mastery check <span>&rarr;</span>
                        </button>
                      </section>
                    )}
                  </article>
                )}
                {stage === "practice" && (
                  <article className="question-card">
                    <p className="question-type">APPLY THE IDEA</p>
                    <h1>Check your reasoning.</h1>
                    <p className="lesson-prompt">{question.prompt}</p>
                    <div className="answer-list">
                      {question.options.map((x, i) => (
                        <button
                          key={x}
                          disabled={feedback === "correct"}
                          className={`${choice === i ? "selected" : ""} ${feedback === "correct" && i === question.correct ? "correct" : ""} ${feedback === "incorrect" && choice === i ? "incorrect" : ""}`}
                          onClick={() => feedback === "idle" && setChoice(i)}
                        >
                          <span>{String.fromCharCode(65 + i)}</span>
                          <p>{x}</p>
                        </button>
                      ))}
                    </div>
                    {hint && feedback !== "correct" && (
                      <div className="hint-box">
                        <b>A nudge, not the answer</b>
                        <p>{question.hint}</p>
                      </div>
                    )}
                    {feedback !== "idle" && (
                      <div className={`answer-feedback ${feedback}`}>
                        <b>
                          {feedback === "correct"
                            ? "Correct answer: " +
                              String.fromCharCode(65 + question.correct)
                            : "Try again."}
                        </b>
                        <p>
                          {feedback === "correct"
                            ? detailedExplanation()
                            : "Use the hint, revisit the teaching card if needed, and make another choice. Mastery requires the correct answer."}
                        </p>
                      </div>
                    )}
                    <div className="question-actions">
                      <button
                        className="hint-link"
                        onClick={() => setHint(true)}
                      >
                        Need a nudge? <span>+</span>
                      </button>
                      {feedback === "incorrect" && (
                        <button className="retry-button" onClick={retry}>
                          Try another answer
                        </button>
                      )}
                      <button
                        className="check-button"
                        disabled={choice === null}
                        onClick={
                          feedback === "correct" ? nextQuestion : checkAnswer
                        }
                      >
                        {feedback === "correct"
                          ? questionIndex === 3
                            ? "Complete skill"
                            : "Next question"
                          : "Check answer"}{" "}
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </article>
                )}
                {stage === "complete" && (
                  <article className="complete-card">
                    <p className="question-type">MASTERY EARNED</p>
                    <h1>
                      You made the
                      <br />
                      <em>reasoning yours.</em>
                    </h1>
                    <p>
                      You answered all four questions correctly. The next skill
                      is now unlocked.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() =>
                        lessonIndex < 3
                          ? openLesson(lessonIndex + 1)
                          : setScreen("course")
                      }
                    >
                      {lessonIndex < 3
                        ? "Open next skill"
                        : "Return to Module 01"}{" "}
                      <span>&rarr;</span>
                    </button>
                  </article>
                )}
              </div>
              <aside className="tutor-card">
                <div className="tutor-badge">
                  <span>✦</span>
                  <p>SOCRATIC TUTOR</p>
                </div>
                <h2>
                  {stage === "tutor" ? (
                    <>
                      Reason it
                      <br />
                      <em>out.</em>
                    </>
                  ) : (
                    <>
                      Tutor first.
                      <br />
                      <em>Quiz second.</em>
                    </>
                  )}
                </h2>
                <p>
                  {stage === "learn"
                    ? "First take the short audio and visual briefing. Then use the required Socratic dialogue to consolidate the idea before the objective quiz."
                    : stage === "media"
                      ? "Use the visual and spoken overview to prepare your reasoning. This comes before the tutor, not instead of it."
                      : stage === "tutor"
                        ? "Commit to a position. I will probe the evidence without handing you the answer."
                        : stage === "practice"
                          ? "Media briefing and tutor dialogue complete. Now retrieve and apply the idea on your own."
                          : "You completed the full learning sequence."}
                </p>
                {stage === "learn" && (
                  <button className="tutor-ask" onClick={startMedia}>
                    Start media briefing <span>&rarr;</span>
                  </button>
                )}
                {stage === "media" && (
                  <p className="tutor-status">
                    Required media briefing · play narration to continue
                  </p>
                )}
                {stage === "tutor" && (
                  <p className="tutor-status">
                    Required dialogue in progress · {tutorTurns.length}/2
                    responses
                  </p>
                )}
                <div className="tutor-loop">
                  <span>LEARNING LOOP</span>
                  <p>
                    Learn <b>→</b> Practice <b>→</b> Master <b>→</b> Apply
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </section>
      )}

      {screen === "notes" && (
        <section className="notes-screen">
          <p className="eyebrow">
            <i /> YOUR WORKING NOTEBOOK
          </p>
          <h1>
            Make the ideas
            <br />
            <em>your own.</em>
          </h1>
          <p>
            Capture questions, clinical examples, and patterns you want to
            remember.
          </p>
          <textarea placeholder="Write the thought you want to keep..." />
          <span className="notes-tip">
            TIP — Write one thing you noticed before one thing you learned.
          </span>
        </section>
      )}
      {screen === "lesson" && stage === "learn" && (
        <section className="learning-depth-dock">
          <div>
            <span>USE THIS IN PRACTICE</span>
            {extra.steps.map((step, index) => (
              <p key={step}>
                <b>0{index + 1}</b>
                {step}
              </p>
            ))}
          </div>
          <div>
            <span>GO DEEPER</span>
            {extra.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.label}
                <b>↗</b>
              </a>
            ))}
          </div>
        </section>
      )}
      {screen === "notes" && savedNotes.length > 0 && (
        <section className="saved-notes">
          <span>CAPTURED FROM YOUR LESSONS</span>
          {savedNotes.map((note, index) => (
            <p key={`${note}-${index}`}>{note}</p>
          ))}
        </section>
      )}
      {screen !== "notes" && (
        <aside className={`notebook-capture ${notebookOpen ? "open" : ""}`}>
          {notebookOpen && (
            <div className="notebook-popover">
              <div>
                <p>QUICK CAPTURE</p>
                <button
                  aria-label="Close notebook capture"
                  onClick={() => setNotebookOpen(false)}
                >
                  ×
                </button>
              </div>
              <h2>Keep the thought.</h2>
              <p>
                Save a question, observation, or clinical connection for your
                notebook.
              </p>
              <textarea
                value={quickNote}
                onChange={(event) => setQuickNote(event.target.value)}
                placeholder="What do you want to remember?"
              />
              <button
                className="capture-save"
                disabled={!quickNote.trim()}
                onClick={saveQuickNote}
              >
                Save to notebook <span>&rarr;</span>
              </button>
            </div>
          )}
          <button
            className="notebook-fab"
            aria-expanded={notebookOpen}
            onClick={() => setNotebookOpen(!notebookOpen)}
          >
            <span>✦</span>
            {notebookOpen ? "Close" : "Quick note"}
          </button>
        </aside>
      )}
    </main>
  );
}
