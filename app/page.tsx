"use client";
import { useRef, useState } from "react";
import { LessonDiagram } from "./diagrams";
import { fallbackDiagram, lessonDiagrams } from "./lesson-diagrams";
import { lessonDepth } from "./lesson-depth";
import { Narrator, splitSentences } from "./narration";

type ThemeId = "light" | "dark";
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
  checkpoint?: string;
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
const briefingScripts = [
  [
    "Start with the shape of the length-of-stay distribution, not a single average.",
    "Long stays pull the mean upward, while the median remains closer to the middle patient experience.",
    "Report both summaries, then inspect the long right tail before describing a stay as typical.",
  ],
  [
    "Before calculating, decide what each field represents in the real world.",
    "Discharge disposition names groups, so averaging its numeric codes would not create a meaningful clinical result.",
    "Use category counts and a bar chart to compare disposition groups clearly.",
  ],
  [
    "An unusual laboratory value is a signal to investigate, not an automatic reason to delete it.",
    "Trace the value through its units, timestamp, source system, and related clinical information.",
    "Keep a reviewable record of the evidence and the decision you make.",
  ],
  [
    "A blank value can reveal something about the care process that produced the dataset.",
    "Find out who is missing values and whether the pattern connects to workflow, access, or an outcome.",
    "Describe the pattern before deleting rows or filling in missing values, because either choice can change the population represented.",
  ],
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
    transfer:
      "A clinic has a mean wait time of 31 minutes and a median of 18 minutes. What would you investigate before reporting a typical wait?",
    quizFocus:
      "You will independently decide what a gap between mean and median can—and cannot—tell you.",
  },
  {
    case: "A discharge field contains home, skilled nursing facility, hospice, and transferred. A colleague proposes computing its average code.",
    prompt:
      "Commit to a position: what is problematic about that plan, if anything? Explain using what the values represent.",
    probe:
      "Choose one appropriate way to summarize or display this field and explain why it respects the data type.",
    transfer:
      "A triage field is stored as red, yellow, and green. What would you check before treating those codes as a numeric measurement?",
    quizFocus:
      "You will independently match data meaning to an appropriate summary or display.",
  },
  {
    case: "One creatinine value is far above the rest of a clinical dataset. The analyst has not yet checked the source system, units, or chart context.",
    prompt:
      "What should the analyst do before changing this record? Commit to a first step and explain why.",
    probe:
      "Name two pieces of evidence that would help distinguish a data error from a clinically important extreme value.",
    transfer:
      "A potassium result is dramatically lower than every other result that day. What information would you verify before changing it?",
    quizFocus:
      "You will independently choose the safest first action when a clinical value looks extreme.",
  },
  {
    case: "Blood-pressure values are blank most often for patients who leave a clinic appointment early.",
    prompt:
      "What does this pattern make you wonder about? Commit to one concern before deciding how to handle the blanks.",
    probe:
      "How could deleting every incomplete row change the patients represented in the analysis?",
    transfer:
      "BMI is missing for many urgent walk-in visits but rarely for scheduled visits. What concern does that raise about a complete-case analysis?",
    quizFocus:
      "You will independently identify when missingness may change who is represented in a result.",
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
type UIIconName =
  | "read"
  | "play"
  | "chat"
  | "target"
  | "check"
  | "lock"
  | "arrow-right"
  | "arrow-left"
  | "chevron-left"
  | "chevron-right"
  | "sun"
  | "moon"
  | "note"
  | "spark"
  | "external"
  | "menu"
  | "close"
  | "trophy"
  | "compass";

function UIIcon({ name, className }: { name: UIIconName; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: className ? `ui-icon ${className}` : "ui-icon",
    "aria-hidden": true,
  };
  switch (name) {
    case "read":
      return (
        <svg {...common}>
          <path d="M4 5.5h6a2.5 2.5 0 0 1 2 2.5v11a2 2 0 0 0-1.6-1.6L4 16.5z" />
          <path d="M20 5.5h-6a2.5 2.5 0 0 0-2 2.5v11a2 2 0 0 1 1.6-1.6L20 16.5z" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.6" />
          <path d="M10.2 8.9 15.4 12l-5.2 3.1z" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M20 13.4a2.6 2.6 0 0 1-2.6 2.6H9.7L5 19.4V6.6A2.6 2.6 0 0 1 7.6 4h9.8A2.6 2.6 0 0 1 20 6.6z" />
          <path d="M9.2 10h6.2M9.2 13h3.6" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.4" />
          <circle cx="12" cy="12" r="4.4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5.2 12.6 9.6 17 18.8 7.4" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10.4" width="14" height="9.4" rx="2" />
          <path d="M8.4 10.4V8a3.6 3.6 0 0 1 7.2 0v2.4" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M4.5 12h15M13.4 6l6 6-6 6" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19.5 12h-15M10.6 6l-6 6 6 6" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg {...common}>
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path d="M9.5 5.5 16 12l-6.5 6.5" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
        </svg>
      );
    case "note":
      return (
        <svg {...common}>
          <path d="M6 3.8h8.4L19 8.4V20a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 20V5a1.2 1.2 0 0 1 1.2-1.2Z" />
          <path d="M14 3.8v5h5M8.4 13h7M8.4 16.5h4.6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3.4l1.9 5.3 5.3 1.9-5.3 1.9L12 17.8l-1.9-5.3-5.3-1.9 5.3-1.9z" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4.8h5.2V10" />
          <path d="M19.2 4.8 10.6 13.4" />
          <path d="M17 14v4.4a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.4V8.6A1.6 1.6 0 0 1 5.6 7H10" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M8 4.6h8v4.6a4 4 0 0 1-8 0z" />
          <path d="M8 6H5.4v1.4A3 3 0 0 0 8 10.3M16 6h2.6v1.4a3 3 0 0 1-2.6 2.9" />
          <path d="M10 13.4h4l.5 2.6h-5zM7.6 19.4h8.8" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.4" />
          <path d="M15.2 8.8 13.6 13.6 8.8 15.2l1.6-4.8z" />
        </svg>
      );
  }
}

function NarrationPlayer({
  label,
  lines,
  playing,
  activeIndex,
  rate,
  onToggle,
  onRate,
}: {
  label: string;
  lines: string[];
  playing: boolean;
  activeIndex: number;
  rate: number;
  onToggle: () => void;
  onRate: (rate: number) => void;
}) {
  return (
    <section className={`narration${playing ? " is-playing" : ""}`}>
      <div className="narration-bar">
        <button className="narration-play" onClick={onToggle}>
          <UIIcon name={playing ? "close" : "play"} />
          {playing ? "Stop" : "Listen"}
        </button>
        <div className="narration-meta">
          <span className="narration-label">{label}</span>
          <span className="narration-wave" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="narration-rate" role="group" aria-label="Playback speed">
          {[0.85, 1, 1.25].map((value) => (
            <button
              key={value}
              className={rate === value ? "selected" : ""}
              aria-pressed={rate === value}
              onClick={() => onRate(value)}
            >
              {value}&times;
            </button>
          ))}
        </div>
      </div>
      <ol className="narration-script">
        {lines.map((line, index) => (
          <li
            key={`${index}-${line}`}
            className={index === activeIndex ? "active" : ""}
            ref={
              index === activeIndex
                ? (el) => {
                    el?.scrollIntoView({ block: "nearest" });
                  }
                : undefined
            }
          >
            {line}
          </li>
        ))}
      </ol>
    </section>
  );
}

function CourseIcon({ id, className }: { id: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (id) {
    case "data-literacy":
      return (
        <svg {...common}>
          <path d="M4 20V10M11 20V4M18 20v-7" />
          <path d="M2.5 20h19" />
        </svg>
      );
    case "python-reasoning":
      return (
        <svg {...common}>
          <path d="M9 8 4.5 12 9 16" />
          <path d="M15 8l4.5 4-4.5 4" />
          <path d="M13.5 6.5 10.5 17.5" />
        </svg>
      );
    case "cybersecurity":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.2c0 4.6-3 8.4-7 9.8-4-1.4-7-5.2-7-9.8V6l7-3z" />
          <path d="M9 12.2l2.2 2.2L15.5 10" />
        </svg>
      );
    case "algorithms":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.3" />
          <circle cx="18" cy="6" r="2.3" />
          <circle cx="12" cy="18" r="2.3" />
          <path d="M8 7.3 10.5 16M16 7.3 13.5 16M8.3 6h7.4" />
        </svg>
      );
    case "sql-modeling":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
          <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
          <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
        </svg>
      );
    case "data-visualization":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path
            d="M12 3.5A8.5 8.5 0 0 1 20.5 12H12Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "statistical-inference":
      return (
        <svg {...common}>
          <path d="M3 18h18" />
          <path d="M4 18c2-.2 3-1 4-3.4C9 11.8 10 6 12 6s3 5.8 4 8.6c1 2.4 2 3.2 4 3.4" />
        </svg>
      );
    case "ml-foundations":
      return (
        <svg {...common} strokeWidth={1.1}>
          <circle cx="5" cy="7" r="1.6" />
          <circle cx="5" cy="17" r="1.6" />
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
          <circle cx="19" cy="9" r="1.6" />
          <circle cx="19" cy="15" r="1.6" />
          <path d="M6.3 7.6 10.7 5.6M6.3 7.3 10.7 11.5M6.3 16.3 10.7 12.6M6.3 16.7 10.7 18.6M13.3 5.6 17.7 8.7M13.3 11.7 17.7 9.3M13.3 12.4 17.7 14.6M13.3 18.6 17.7 15.3" />
        </svg>
      );
    case "systems-design":
      return (
        <svg {...common}>
          <path d="M12 3 21 7.5 12 12 3 7.5 12 3Z" />
          <path d="M3 12 12 16.5 21 12" />
          <path d="M3 16.5 12 21 21 16.5" />
        </svg>
      );
    case "critical-thinking":
      return (
        <svg {...common}>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.4 10.9c.6.45 1 .95 1.1 1.6h4.6c.1-.65.5-1.15 1.1-1.6A6 6 0 0 0 12 3Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
const courseLibrary = [
  {
    id: "data-literacy",
    subject: "DATA + HEALTH",
    title: "Basic Data Literacy for Clinicians",
    description:
      "Learn to inspect clinical data before using it to justify a conclusion.",
    level: "College + professional",
    format: "4 lessons · audio, visual, tutor, quiz",
    visual: "/distribution-mean-median.png",
    visualAlt: "A right-skewed distribution showing mean and median markers.",
    available: true,
    modules: [
      "Read distributions before reporting an average",
      "Classify variables before choosing a summary",
      "Investigate unusual records with clinical context",
      "Interrogate missingness before cleaning data",
    ],
    outcomes: ["Read claims critically", "Use defensible summaries"],
  },
  {
    id: "python-reasoning",
    subject: "COMPUTER SCIENCE",
    title: "Python for Computational Reasoning",
    description:
      "Use code to turn a vague problem into small, testable steps and reliable programs.",
    level: "College foundation",
    format: "6 modules · examples, tutor, labs",
    visual: "/python-reasoning.png",
    visualAlt: "A Python notebook and terminal in a warm editorial study composition.",
    available: true,
    modules: [
      "Trace values, variables, and control flow",
      "Break a task into functions and tests",
      "Reason about lists, dictionaries, and data files",
      "Debug claims with evidence rather than guesswork",
    ],
    outcomes: ["Write clear programs", "Debug systematically"],
  },
  {
    id: "cybersecurity",
    subject: "CYBERSECURITY",
    title: "Cybersecurity: Think Like a Defender",
    description:
      "Learn to recognize attack surfaces, evaluate evidence, and make proportionate security decisions.",
    level: "College + professional",
    format: "5 modules · cases, tutor, applied checks",
    visual: "/cybersecurity.png",
    visualAlt: "Security tokens and a response checklist arranged on a charcoal desk.",
    available: true,
    modules: [
      "Map assets, threats, and trust boundaries",
      "Analyze a phishing message without relying on hunches",
      "Reason about passwords, authentication, and access",
      "Investigate an incident using an evidence trail",
    ],
    outcomes: ["Assess risk", "Explain a defense"],
  },
  {
    id: "algorithms",
    subject: "COMPUTER SCIENCE",
    title: "Algorithms & Complexity",
    description:
      "Build an intuition for how algorithms scale—and how to choose a method that fits the problem.",
    level: "College intermediate",
    format: "6 modules · visual models, tutor, quiz",
    visual: "/algorithms.png",
    visualAlt: "A tabletop study of branching paths, sorting tiles, and a maze grid.",
    available: true,
    modules: [
      "Compare algorithms by the work they perform",
      "Recognize growth rates from simple traces",
      "Use recursion and divide-and-conquer thoughtfully",
      "Defend a tradeoff between speed, memory, and clarity",
    ],
    outcomes: ["Analyze scale", "Choose tradeoffs"],
  },
  {
    id: "sql-modeling",
    subject: "DATA SYSTEMS",
    title: "SQL & Relational Data Modeling",
    description:
      "Ask sound questions of data by designing tables, relationships, and queries that preserve meaning.",
    level: "College foundation",
    format: "5 modules · diagrams, tutor, practice",
    visual: "/sql-modeling.png",
    visualAlt: "Linked relational data cards, a database token, and key-shaped markers.",
    available: true,
    modules: [
      "Model entities, attributes, and relationships",
      "Write queries that match the question being asked",
      "Use joins without accidentally changing the population",
      "Audit results for duplicates and missing records",
    ],
    outcomes: ["Design a schema", "Query responsibly"],
  },
  {
    id: "data-visualization",
    subject: "DATA + DESIGN",
    title: "Data Visualization & Evidence",
    description:
      "Learn to see the claim inside a chart, spot visual distortion, and design honest comparisons.",
    level: "College + professional",
    format: "4 modules · critique, visual studio, quiz",
    visual: "/data-visualization.png",
    visualAlt: "Clear and misleading chart cards arranged with a ruler and annotation pencil.",
    available: true,
    modules: [
      "Match a visual form to the question",
      "Critique scales, baselines, and comparisons",
      "Design for uncertainty and context",
      "Defend a chart choice to a skeptical audience",
    ],
    outcomes: ["Read charts critically", "Design honestly"],
  },
  {
    id: "statistical-inference",
    subject: "DATA + STATISTICS",
    title: "Statistical Inference & Uncertainty",
    description:
      "Learn to read p-values, intervals, and samples the way a careful analyst does—skeptically.",
    level: "College + professional",
    format: "4 modules · cases, tutor, applied checks",
    visual: "/course-library-hero.png",
    visualAlt: "An editorial composition representing statistical reasoning.",
    available: true,
    modules: [
      "Read a p-value for what it actually says",
      "Judge a confidence interval, not just a point estimate",
      "Question a sample before trusting its conclusion",
      "Tell a real effect from noise",
    ],
    outcomes: ["Judge evidence honestly", "Avoid common inference errors"],
  },
  {
    id: "ml-foundations",
    subject: "DATA + ML",
    title: "Machine Learning Foundations",
    description:
      "Build the judgment to question a model's score before you trust its prediction.",
    level: "College intermediate",
    format: "4 modules · cases, tutor, applied checks",
    visual: "/course-library-hero.png",
    visualAlt: "An editorial composition representing machine learning reasoning.",
    available: true,
    modules: [
      "Judge a model on data it hasn't seen",
      "Trust the data before you trust the model",
      "Choose a metric that matches the real cost of errors",
      "Watch a model after it ships, not just before",
    ],
    outcomes: ["Evaluate models skeptically", "Spot common ML pitfalls"],
  },
  {
    id: "systems-design",
    subject: "COMPUTER SCIENCE",
    title: "Systems Design Thinking",
    description:
      "Reason about scale, caching, and failure before you reach for a bigger server.",
    level: "College intermediate",
    format: "4 modules · diagrams, tutor, applied checks",
    visual: "/course-library-hero.png",
    visualAlt: "An editorial composition representing systems design reasoning.",
    available: true,
    modules: [
      "Name the bottleneck before scaling anything",
      "Cache what's expensive and stable, not everything",
      "Design for the failure, not just the happy path",
      "Defend a design tradeoff with the actual constraints",
    ],
    outcomes: ["Reason about tradeoffs at scale", "Design for failure"],
  },
  {
    id: "critical-thinking",
    subject: "REASONING",
    title: "Critical Thinking & Argument Evaluation",
    description:
      "Separate a claim from its evidence, and learn to change your mind on purpose.",
    level: "College foundation",
    format: "4 modules · cases, tutor, applied checks",
    visual: "/course-library-hero.png",
    visualAlt: "An editorial composition representing critical thinking.",
    available: true,
    modules: [
      "Separate the claim from the evidence for it",
      "Name the reasoning error before dismissing an argument",
      "Weigh a source's evidence, not just its confidence",
      "Decide in advance what would change your mind",
    ],
    outcomes: ["Evaluate arguments rigorously", "Recognize common reasoning errors"],
  },
];

type CourseProgram = {
  lessons: Lesson[];
  learningExtras: typeof learningExtras;
  lessonVisuals: typeof lessonVisuals;
  briefingVisuals: typeof briefingVisuals;
  briefingScripts: string[][];
  lessonDeepDives: typeof lessonDeepDives;
  tutorScenarios: typeof tutorScenarios;
};

function makeProgram(
  lessons: Lesson[],
  visual: string,
  visualAlt: string,
  source: { label: string; href: string },
): CourseProgram {
  return {
    lessons,
    learningExtras: lessons.map((lesson) => ({
      steps: [lesson.teaching, lesson.example, lesson.why],
      sources: [source],
    })),
    lessonVisuals: lessons.map((lesson) => ({
      src: visual,
      alt: visualAlt,
      caption: `${lesson.title}: use this visual as a concrete cue for the concept before attempting the practice questions.`,
    })),
    briefingVisuals: lessons.map((lesson) => ({
      src: visual,
      alt: visualAlt,
      caption: `${lesson.title}: the briefing connects the key idea to a realistic decision.`,
    })),
    briefingScripts: lessons.map((lesson) => [
      lesson.concept,
      lesson.teaching,
      lesson.why,
    ]),
    lessonDeepDives: lessons.map((lesson) => [
      { title: "Core idea", copy: lesson.concept, example: lesson.example },
      { title: "How to use it", copy: lesson.teaching, example: lesson.why },
      {
        title: "A defensible move",
        copy:
          lesson.checkpoint ??
          "Name the assumption you are making, then identify the evidence that would change your mind.",
        example: "This is the bridge between a correct-looking answer and a reasoned one.",
      },
    ]),
    tutorScenarios: lessons.map((lesson) => ({
      case: lesson.example,
      prompt: `Commit to a position: how would you approach this example using ${lesson.title.toLowerCase()}? Explain your first move.`,
      probe: `What evidence would let you confirm or rule out that ${lesson.concept.split(";")[0].replace(/\.$/, "").toLowerCase()}?`,
      transfer: `Now apply ${lesson.title.toLowerCase()} to a new but similar case. What would stay the same, and what would you re-check?`,
      quizFocus: `The quiz asks you to independently apply the reasoning from ${lesson.title.toLowerCase()}.`,
    })),
  };
}

const coursePrograms: Record<string, CourseProgram> = {
  "data-literacy": {
    lessons,
    learningExtras,
    lessonVisuals,
    briefingVisuals,
    briefingScripts,
    lessonDeepDives,
    tutorScenarios,
  },
  "python-reasoning": makeProgram(
    [
      {
        id: "01", unit: "PROGRAM STATE", title: "Trace values before trusting output", description: "Follow assignments and expressions one step at a time.", checkpoint: "Before trusting a printed value, redo the trace on paper and compare it line by line against the program's actual output.",
        concept: "A variable names a value at a particular moment; an assignment changes what that name refers to.",
        teaching: "Trace short programs with a table: write each line, update the value, and predict output before running code.",
        example: "A script sets total = 8, then total = total + 3, then prints total.",
        why: "The printed value is 11 because the second assignment uses the old value and stores a new one.",
        takeaways: ["Variables hold current values, not permanent equations.", "Predict before you run.", "Trace state line by line."],
        questions: [
          { prompt: "After x = 4; x = x + 2, what is x?", options: ["4", "6", "x + 2", "An error"], correct: 1, feedback: "The second line evaluates 4 + 2 and stores 6 back in x.", hint: "What value does x have just before the second line?" },
          { prompt: "total = 10; total = total - 3; total = total * 2. What is total at the end?", options: ["7", "14", "20", "17"], correct: 1, feedback: "Each line updates total using its current value: 10 - 3 is 7, then 7 * 2 is 14.", hint: "Apply each assignment in order, updating the value as you go." },
          { prompt: "Two lines run in this order: y = y + 1, then y = 3, starting from y = 0. What is the final value of y?", options: ["3, because the last assignment overwrites the incremented value", "1, because increments always apply last", "4, because both lines add together", "0, because reordering has no effect"], correct: 0, feedback: "The final assignment replaces whatever value came before, so the increment is discarded.", hint: "Read the two lines in the order they actually execute." },
          { prompt: "Before trusting a program's final printed value, what is the most reliable check?", options: ["Trace each assignment by hand and compare it to the printed result", "Assume the last line is correct because it ran last", "Rerun the program and hope for a different answer", "Skip tracing if the code looks simple"], correct: 0, feedback: "Manually tracing state catches assumptions that skimming the code would miss.", hint: "What actually verifies a predicted value?" },
        ],
      },
      {
        id: "02", unit: "CONTROL FLOW", title: "Choose a path with evidence", description: "Use conditions and loops to make a program's choices explicit.", checkpoint: "Test your branch or loop specifically at its boundary value, not just with a comfortable middle-of-the-range example.",
        concept: "A conditional evaluates a true-or-false expression; a loop repeats a clearly defined action over a changing state.",
        teaching: "Read the condition in plain language, then test it with a concrete value before predicting the branch or repetition.",
        example: "A program labels a temperature at least 38 as fever; otherwise it labels it not fever.",
        why: "The boundary belongs to the condition. For 38 exactly, the at-least branch runs.",
        takeaways: ["Conditions express decision rules.", "Boundary values deserve explicit tests.", "Loops need a changing state or finite collection."],
        questions: [
          { prompt: "If a condition is `score >= 70` and score is 70, which branch runs?", options: ["The true branch", "The false branch", "Both branches", "Neither branch"], correct: 0, feedback: "Greater-than-or-equal includes the boundary value 70.", hint: "Read >= as 'at least.'" },
          { prompt: "A loop uses `while i < 5` to process a 5-item list. If i starts at 0 and is never incremented inside the loop, what happens?", options: ["The loop runs exactly 5 times", "The loop never runs", "The loop runs forever, since i never reaches 5", "The loop raises a syntax error"], correct: 2, feedback: "Without incrementing i, the condition i < 5 stays true forever, producing an infinite loop.", hint: "What changes the loop's condition each pass?" },
          { prompt: "A shipping rule charges an express fee `if weight > 20`. A package weighs exactly 20. Does it get the fee?", options: ["No, because > 20 excludes exactly 20", "Yes, because 20 is close to the limit", "Yes, because all packages get a fee", "No, because conditions ignore boundaries"], correct: 0, feedback: "Strict greater-than excludes the boundary value itself; 20 is not greater than 20.", hint: "Compare > to >= at the exact boundary." },
          { prompt: "Before trusting a branch or loop's behavior, what is the most defensible check?", options: ["Test the exact boundary value the condition depends on", "Only test values far from any boundary", "Assume the condition matches your intent without testing", "Test only the first iteration"], correct: 0, feedback: "Boundary values are where off-by-one and inequality mistakes usually surface.", hint: "Where do inequality bugs most often hide?" },
        ],
      },
      {
        id: "03", unit: "FUNCTIONS + TESTS", title: "Make a claim small enough to test", description: "Break a problem into focused functions and examples.", checkpoint: "Write down the ordinary, boundary, and invalid cases a function must handle before you write its body.",
        concept: "A function gives a named task explicit inputs and an output; tests check its behavior on representative cases.",
        teaching: "Write one function for one job, specify the expected result, then test ordinary, boundary, and unusual cases.",
        example: "A `mean(values)` function should be tested on [2, 4, 6], a one-item list, and an empty list policy.",
        why: "A clear policy for an empty list prevents a hidden assumption from becoming a silent bug.",
        takeaways: ["Functions make reasoning local.", "Tests include boundaries, not only happy paths.", "Specify behavior before implementation."],
        questions: [
          { prompt: "Which is the strongest test set for a function that finds a maximum?", options: ["Only [4, 7, 2]", "A normal list, a one-item list, and an empty-list policy", "Only a list of positive numbers", "No tests if code runs once"], correct: 1, feedback: "Representative, boundary, and defined edge cases test the contract rather than a single example.", hint: "What cases might behave differently from the usual input?" },
          { prompt: "A `divide(a, b)` function is tested only with b = 2 and b = 5. What critical case is missing?", options: ["b = 0, to define behavior for division by zero", "A negative value for a", "A very large value for a", "Testing with floats"], correct: 0, feedback: "Division by zero is a boundary that must have a defined, tested behavior, not an assumed one.", hint: "What input makes division undefined?" },
          { prompt: "A `mean(values)` function returns 0 for an empty list without documenting this. Why is this risky?", options: ["Callers may mistake a real zero average for an empty-list result", "Zero is always the mathematically correct answer", "Empty lists never occur in practice", "Returning 0 makes the function faster"], correct: 0, feedback: "An undocumented default can silently hide a meaningfully different case (no data) behind a valid-looking result (an average of zero).", hint: "Can two different situations produce the same output?" },
          { prompt: "What is the best first step when specifying a new function?", options: ["Decide its expected behavior on ordinary, boundary, and invalid inputs before coding it", "Write the implementation, then guess what it should do", "Skip specification for short functions", "Copy a similar function without adjusting its contract"], correct: 0, feedback: "A clear specification, including edge cases, gives you something concrete to implement and test against.", hint: "What should exist before the first line of implementation?" },
        ],
      },
      {
        id: "04", unit: "DATA + DEBUGGING", title: "Debug the assumption, not just the line", description: "Use evidence to locate a mismatch between expectation and program state.", checkpoint: "State your hypothesis for the bug in one sentence, then find the smallest input that would prove or disprove it.",
        concept: "Debugging is an investigation: compare expected and actual values, isolate the smallest failing case, and test a hypothesis.",
        teaching: "Use a small input, inspect intermediate values, and change one plausible cause at a time.",
        example: "A program counts duplicate emails because it normalizes spaces after, rather than before, comparing strings.",
        why: "The bug is an assumption about equivalence; inspecting cleaned and raw values reveals it.",
        takeaways: ["Start with a reproducible small case.", "Inspect intermediate state.", "Change one hypothesis at a time."],
        questions: [
          { prompt: "What is the best first debugging move when output is surprising?", options: ["Rewrite everything", "Use a small reproducible input and inspect intermediate values", "Add random delays", "Assume the language is broken"], correct: 1, feedback: "A small case makes the program's state visible and lets you test a concrete hypothesis.", hint: "What would make the mismatch easiest to observe?" },
          { prompt: "A report undercounts unique visitors because 'Ana@x.com' and 'ana@x.com' are treated as different. What assumption failed?", options: ["That email comparison should be case-insensitive", "That every visitor has exactly one email", "That the report used the wrong database", "That case never matters in any comparison"], correct: 0, feedback: "The bug is a mismatched assumption about equivalence — the code assumed exact string equality was the right check for identity.", hint: "What made two equivalent emails count as different?" },
          { prompt: "You suspect a function mishandles negative numbers. What is the most efficient next step?", options: ["Call the function directly with a single negative input and inspect the result", "Rewrite the whole program from scratch", "Add print statements to every function in the codebase", "Wait and see if the bug happens again"], correct: 0, feedback: "Testing the specific, isolated hypothesis is far faster than broad changes or waiting.", hint: "How do you test one hypothesis without changing everything else?" },
          { prompt: "After fixing a bug caused by a bad assumption, what should you do next?", options: ["Add a test that would have caught it, so the same assumption can't fail silently again", "Delete the bug report so it isn't seen again", "Move on without recording what happened", "Assume the same mistake can't happen elsewhere"], correct: 0, feedback: "A regression test turns a one-time fix into a lasting guarantee about that assumption.", hint: "How do you make a fix permanent rather than temporary?" },
        ],
      },
    ],
    "/python-reasoning.png", "A Python notebook and terminal in a warm editorial study composition.",
    { label: "Python documentation: tutorial", href: "https://docs.python.org/3/tutorial/" },
  ),
  cybersecurity: makeProgram(
    [
      {
        id: "01", unit: "RISK MODELING", title: "Map what needs protection", description: "Connect assets, threats, and likely harm before selecting a control.", checkpoint: "Name the asset, the threat, and the vulnerability separately before proposing any control.",
        concept: "Risk reasoning begins with an asset, a threat, a vulnerability, and the impact if that path succeeds.",
        teaching: "Name the asset and the harm first; then ask who could affect it, through which weakness, and how a control changes the risk.",
        example: "A clinic portal holds appointment data; reused passwords create an account-takeover path.",
        why: "Multi-factor authentication changes the attacker path, but it does not remove the need to protect recovery processes.",
        takeaways: ["Risk is contextual.", "Controls reduce specific paths.", "Start with assets and harm."],
        questions: [
          { prompt: "Which is an asset in a risk analysis?", options: ["A patient appointment database", "A vague feeling of danger", "A random password", "A marketing slogan"], correct: 0, feedback: "An asset is something valuable the organization needs to protect.", hint: "What valuable thing could be affected?" },
          { prompt: "A clinic's asset is patient records; the threat is phishing; the vulnerability is reused passwords. What is the impact if that path succeeds?", options: ["Unauthorized access to patient records", "A slower website", "A larger marketing budget", "An improved password policy"], correct: 0, feedback: "Impact describes the harm that results if the threat exploits the vulnerability against the asset.", hint: "What actually goes wrong if the attack works?" },
          { prompt: "Why is it insufficient to name only the asset when doing risk analysis?", options: ["Because risk depends on how a specific threat could exploit a specific vulnerability, not the asset alone", "Because assets never change", "Because naming a threat is optional", "Because vulnerabilities are irrelevant if the asset is valuable"], correct: 0, feedback: "Risk is the combination of asset, threat, and vulnerability — an asset alone doesn't tell you what could go wrong or how.", hint: "What three things does a complete risk statement need?" },
          { prompt: "A team wants to prioritize which risk to address first. What should they compare?", options: ["The likelihood and impact of each risk against the cost of the control", "Which risk was reported most recently", "Which system is oldest", "Which fix is easiest, regardless of risk"], correct: 0, feedback: "Proportionate prioritization weighs how likely and how damaging a risk is against what it costs to mitigate.", hint: "What makes one risk more urgent than another?" },
        ],
      },
      {
        id: "02", unit: "SOCIAL ENGINEERING", title: "Read a message like evidence", description: "Evaluate phishing cues without trusting one superficial signal.", checkpoint: "Verify an unexpected or urgent request through a channel the message itself did not provide.",
        concept: "Phishing attempts exploit urgency, authority, and look-alike context to obtain credentials or trigger unsafe actions.",
        teaching: "Pause, verify the request using a separate trusted channel, and inspect the actual sender and destination before acting.",
        example: "An email asks payroll staff to open a shared document immediately; the display name is familiar but the address is not.",
        why: "A familiar name is not proof. Independent verification breaks the attacker-controlled channel.",
        takeaways: ["Urgency is a cue, not proof.", "Verify out of band.", "Inspect destinations before entering credentials."],
        questions: [
          { prompt: "What is the safest response to an urgent credential request from an unfamiliar sender address?", options: ["Use the link quickly", "Verify through a trusted, separate channel", "Forward credentials by reply", "Ignore every security message forever"], correct: 1, feedback: "Independent verification avoids relying on the suspicious message itself.", hint: "How can you verify without using the message's link or reply path?" },
          { prompt: "A message's display name says 'IT Support' but the actual address is unrelated to the company domain. What does this mismatch suggest?", options: ["The display name may be spoofed and shouldn't be trusted alone", "Display names are always accurate", "The message is safe because it mentions IT", "Domain mismatches are irrelevant to phishing"], correct: 0, feedback: "Attackers can set any display name; the underlying address is a much stronger signal to inspect.", hint: "Which part of a message is easy to fake, and which is harder?" },
          { prompt: "A colleague asks by unexpected text to buy gift cards immediately for a 'confidential' reason. What cue makes this suspicious?", options: ["Urgency and secrecy discourage the normal verification this request deserves", "Text messages are always untrustworthy", "Gift cards are inherently suspicious", "Confidential requests are always legitimate"], correct: 0, feedback: "Urgency and secrecy are classic pressure tactics designed to bypass a normal pause-and-verify response.", hint: "What is the request trying to prevent you from doing?" },
          { prompt: "What single habit best defends against most social engineering attempts?", options: ["Pausing to verify unexpected or urgent requests through a separate, trusted channel", "Trusting every message that looks professionally formatted", "Responding as quickly as possible to avoid delay", "Never opening any email"], correct: 0, feedback: "A brief, independent verification step breaks the attacker's control over the communication channel.", hint: "What single action defeats most urgency-based attacks?" },
        ],
      },
      {
        id: "03", unit: "ACCESS CONTROL", title: "Make access proportionate", description: "Use authentication and authorization for a defined purpose.", checkpoint: "Ask what task this access is actually for, and grant nothing beyond it.",
        concept: "Authentication establishes who is requesting access; authorization limits what that identity may do.",
        teaching: "Give people the minimum access needed for their task and review high-impact permissions regularly.",
        example: "A student worker needs to update contact details but should not approve refunds or export the entire customer table.",
        why: "Least privilege reduces the harm from mistakes, compromised accounts, and unnecessary access.",
        takeaways: ["Authentication and authorization differ.", "Least privilege is task-specific.", "Review access as roles change."],
        questions: [
          { prompt: "Which choice is authorization rather than authentication?", options: ["Checking a password", "Allowing a verified user to approve refunds", "Sending a login code", "Confirming a device"], correct: 1, feedback: "Authorization decides what an authenticated identity may do.", hint: "Which action controls permissions after identity is known?" },
          { prompt: "A former employee's account is disabled the day they leave, but their access had never been reviewed while employed. What risk does this create?", options: ["Overly broad permissions may have gone unnoticed and unused for a long time before being disabled", "Disabling the account is unnecessary", "Permissions never need review once granted", "This process is already fully secure"], correct: 0, feedback: "Access should be reviewed periodically, not just revoked at departure — unused broad permissions are risk sitting quietly the whole time.", hint: "What happens to permissions that are granted but never re-checked?" },
          { prompt: "A new intern is given administrator access 'to be safe' even though the task only needs read access to one folder. What principle does this violate?", options: ["Least privilege", "Two-factor authentication", "Password complexity", "Data encryption"], correct: 0, feedback: "Least privilege means granting only the access a task actually requires, not more.", hint: "What principle limits access to what's needed?" },
          { prompt: "What is the strongest justification for reviewing access permissions on a schedule rather than only at hiring?", options: ["Roles and responsibilities change over time, so granted access can become mismatched with current need", "Scheduled reviews are required by law everywhere", "Permissions never change once granted", "Reviewing access is only useful for large organizations"], correct: 0, feedback: "As roles shift, previously appropriate access can become excessive; regular review keeps permissions matched to current need.", hint: "Why might access that was correct on day one become wrong later?" },
        ],
      },
      {
        id: "04", unit: "INCIDENT RESPONSE", title: "Contain, preserve, and learn", description: "Turn an alert into a proportionate evidence-guided response.", checkpoint: "Confirm the signal and contain the system before you touch anything that could destroy evidence.",
        concept: "Incident response balances containment, evidence preservation, communication, and recovery rather than treating every alert as a single fix.",
        teaching: "Follow the response plan: confirm the signal, limit further harm, preserve relevant evidence, communicate through designated channels, and learn after recovery.",
        example: "A workstation begins encrypting shared files and an alert reports unusual file activity.",
        why: "Disconnecting the affected system can limit spread while logs and timestamps support later analysis.",
        takeaways: ["Containment comes before convenience.", "Preserve evidence.", "Recovery includes improvement."],
        questions: [
          { prompt: "A workstation appears to be encrypting shared files. What is the strongest immediate priority?", options: ["Contain the affected system using the response plan", "Delete all logs", "Wait for the next day", "Post details publicly"], correct: 0, feedback: "Containment limits additional harm while preserving the path for investigation and recovery.", hint: "Which action reduces spread without destroying evidence?" },
          { prompt: "During containment, why should logs and timestamps be preserved rather than immediately deleted?", options: ["They provide evidence needed to understand and recover from the incident", "Logs are never useful after an incident", "Deleting logs speeds up recovery", "Timestamps are only relevant for billing"], correct: 0, feedback: "Preserved evidence lets responders reconstruct what happened and confirm the incident is actually contained.", hint: "What would investigators need after the incident is contained?" },
          { prompt: "After an incident is resolved, a team skips a post-incident review to save time. What is the main cost of skipping this step?", options: ["The same gap that allowed the incident may go unaddressed and recur", "Post-incident reviews are purely ceremonial", "Skipping review has no real downside", "Reviews only matter for large incidents"], correct: 0, feedback: "Learning from the incident is what prevents the same root cause from producing a repeat incident.", hint: "What does a review actually accomplish that containment alone doesn't?" },
          { prompt: "Which sequence best reflects a proportionate incident response?", options: ["Confirm the signal, contain it, preserve evidence, communicate, then recover and review", "Recover immediately, then decide later whether it was real", "Communicate publicly first, then investigate", "Delete affected systems immediately without investigation"], correct: 0, feedback: "Response should verify first, then limit harm, protect evidence, coordinate communication, and close with recovery and learning.", hint: "What comes before containment, and what comes after recovery?" },
        ],
      },
    ],
    "/cybersecurity.png", "Security tokens and a response checklist arranged on a charcoal desk.",
    { label: "NIST Cybersecurity Framework 2.0", href: "https://www.nist.gov/cyberframework" },
  ),
  algorithms: makeProgram(
    [
      {
        id: "01", unit: "ALGORITHMIC THINKING", title: "Count the work, not the vibe", description: "Describe an algorithm as explicit steps before comparing it.", checkpoint: "Trace the algorithm's worst case explicitly instead of trusting how fast it feels on a small example.",
        concept: "An algorithm is a precise procedure; comparison starts by identifying the work it performs as input grows.",
        teaching: "Trace a small input, count the repeated operation, and separate the algorithm from the speed of one computer.",
        example: "To find a name in an unsorted list, a scan checks items one by one until it finds a match or reaches the end.",
        why: "The worst case grows with the list length because every item may need inspection.",
        takeaways: ["Algorithms are procedures.", "Trace the repeated operation.", "Separate hardware from growth."],
        questions: [
          { prompt: "For an unsorted list, what is the worst-case work of scanning for a name?", options: ["Check one item", "Check every item", "Sort instantly", "No comparison is needed"], correct: 1, feedback: "If the name is last or absent, a linear scan may inspect each item.", hint: "What happens when the target is absent?" },
          { prompt: "Algorithm A always takes 100 steps; Algorithm B takes between 5 and 100,000 steps depending on input. Why report worst case for B?", options: ["It gives a guarantee that holds no matter what input arrives", "It's always the number of steps that actually happens", "Best case is more useful for guarantees", "Average case requires no assumptions about input"], correct: 0, feedback: "Worst-case analysis promises a bound that holds under any input, which is what a reliability guarantee needs.", hint: "Which measure protects you from the least convenient input?" },
          { prompt: "A search checks every item in a 10-item list and never finds a match. How many comparisons did the worst case require?", options: ["10", "1", "5", "0"], correct: 0, feedback: "A full scan with no match inspects every item, so the worst case here is exactly 10 comparisons.", hint: "If nothing matches, how many items get skipped?" },
          { prompt: "Before comparing two algorithms' speed, what should you specify first?", options: ["The size and structure of the input they'll run on", "Which programming language looks nicer", "The programmer's typing speed", "The color of the code editor"], correct: 0, feedback: "Growth claims are only meaningful relative to how input size and structure change.", hint: "What does 'faster' actually depend on?" },
        ],
      },
      {
        id: "02", unit: "GROWTH RATES", title: "See what scales", description: "Use Big-O to compare how work grows with input size.", checkpoint: "Ask what happens to the work when you double the input, not just how it performs on the input you have.",
        concept: "Asymptotic analysis focuses on growth for large inputs, ignoring constant factors that depend on a particular machine.",
        teaching: "Identify nesting and halving: one pass is linear, a pairwise comparison can be quadratic, and repeated halving is logarithmic.",
        example: "Checking every pair among n student projects requires roughly n times n comparisons.",
        why: "Doubling n makes a quadratic workload roughly four times larger, not merely twice as large.",
        takeaways: ["Growth matters at scale.", "Nested independent loops often multiply work.", "Halving is a distinctive pattern."],
        questions: [
          { prompt: "A process compares every item with every other item. Which growth rate best fits?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 3, feedback: "Independent nested comparisons produce about n × n work.", hint: "How many pairs are considered as the list grows?" },
          { prompt: "An algorithm's work stays exactly the same regardless of input size. Which growth rate describes it?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], correct: 0, feedback: "Constant time work, O(1), does not grow as input size increases.", hint: "What does 'constant' mean for growth?" },
          { prompt: "Doubling the input size roughly doubles an algorithm's running time. Which growth rate is most consistent with this?", options: ["O(n)", "O(n²)", "O(1)", "O(2ⁿ)"], correct: 0, feedback: "Linear growth, O(n), scales work proportionally with input size — doubling input roughly doubles work.", hint: "What growth rate scales proportionally, not multiplicatively?" },
          { prompt: "Why is Big-O described using large inputs rather than small ones?", options: ["Because growth differences hidden at small sizes become decisive at large sizes", "Because small inputs are never tested", "Because Big-O only applies to sorting", "Because constant factors matter most at small sizes"], correct: 0, feedback: "At small sizes constant factors can dominate; at large sizes the growth rate itself determines performance.", hint: "When does the shape of growth start to matter most?" },
        ],
      },
      {
        id: "03", unit: "SEARCH + SORT", title: "Use structure to reduce work", description: "Choose a search method that matches what is already known.", checkpoint: "Confirm the data actually satisfies the assumption, like sorted order, an algorithm depends on before using it.",
        concept: "Binary search gains speed by discarding half a sorted search space at each comparison.",
        teaching: "Ask first whether the collection is sorted and whether maintaining that order is worth its cost for the task.",
        example: "A sorted phone directory lets you compare a target with the midpoint and discard one half repeatedly.",
        why: "Binary search is fast because it uses the order; it is not valid on an arbitrary unsorted list.",
        takeaways: ["Binary search needs sorted data.", "Order is an investment.", "Match the method to the representation."],
        questions: [
          { prompt: "What condition is required before binary search is valid?", options: ["The data are sorted by the search key", "The list is random", "There are exactly two items", "Every item is unique"], correct: 0, feedback: "Binary search relies on order to justify discarding half the remaining values.", hint: "What evidence lets you discard one half safely?" },
          { prompt: "A list of 1,000 sorted numbers is searched with binary search. Roughly how many comparisons are needed in the worst case?", options: ["About 10", "About 1,000", "About 500", "About 1"], correct: 0, feedback: "Binary search roughly halves the remaining space each step; log₂(1000) is about 10.", hint: "How many times can 1,000 be halved before reaching 1?" },
          { prompt: "A dataset is updated frequently and rarely searched. Is maintaining sorted order worth it just to enable binary search?", options: ["Not necessarily — the cost of keeping it sorted may outweigh the rare benefit", "Yes, sorted order is always worth maintaining", "No, sorting a list has no cost", "Yes, because binary search is required by law"], correct: 0, feedback: "Sorting and re-sorting has a real cost; it should be weighed against how often the resulting order is actually used.", hint: "What does keeping data sorted cost, and how often would that investment pay off here?" },
          { prompt: "What is the strongest reason to check whether data is sorted before choosing binary search?", options: ["Binary search on unsorted data can silently return wrong or missing results", "Binary search works the same regardless of order", "Sorting is never necessary for search", "Unsorted data always searches faster"], correct: 0, feedback: "Binary search's correctness depends entirely on order; using it on unsorted data breaks its guarantees without necessarily raising an error.", hint: "What happens to binary search's guarantee if its assumption is false?" },
        ],
      },
      {
        id: "04", unit: "TRADEOFFS", title: "Defend the tradeoff", description: "Choose for time, memory, accuracy, and maintainability—not speed alone.", checkpoint: "Name the resource you are willing to spend more of before claiming one structure is simply 'better'.",
        concept: "A good algorithmic choice considers constraints: input size, update frequency, memory, correctness needs, and implementation risk.",
        teaching: "Name the workload and constraints before declaring a method best; a faster lookup may cost memory or update time.",
        example: "A hash table speeds repeated lookups but requires extra storage and a strategy for collisions.",
        why: "The right choice changes if memory is scarce, ordering matters, or records are constantly updated.",
        takeaways: ["There is rarely one universal best method.", "State the workload.", "Include costs beyond running time."],
        questions: [
          { prompt: "Why might a faster lookup structure not always be the best choice?", options: ["It may use more memory or make other operations harder", "Speed never matters", "Algorithms have no constraints", "All structures cost the same"], correct: 0, feedback: "Choosing a structure means balancing multiple costs against the actual workload.", hint: "What resource or operation might be traded for faster lookup?" },
          { prompt: "A system needs to preserve insertion order, but a hash table doesn't guarantee order. What should guide the choice here?", options: ["Whether preserving insertion order matters more than the hash table's lookup speed", "Always choose the fastest lookup regardless of ordering needs", "Order never matters in any system", "Hash tables always preserve order"], correct: 0, feedback: "The right structure depends on which property the task actually needs — speed and ordering guarantees can conflict.", hint: "What does this specific task require that a hash table doesn't promise?" },
          { prompt: "A mobile app has very limited memory but performs lookups constantly. Which factor should weigh most heavily in choosing a data structure?", options: ["The memory footprint of each candidate structure relative to its lookup speed", "Only how fast the structure looks in a benchmark", "The structure's popularity in tutorials", "Whichever structure requires the least code to write"], correct: 0, feedback: "Under a tight memory constraint, memory cost becomes a decisive factor alongside speed.", hint: "What resource is scarce here, and how does that limit the options?" },
          { prompt: "What makes a tradeoff decision defensible to a skeptical reviewer?", options: ["Naming the workload, constraints, and costs that were weighed, not just the final choice", "Picking the structure everyone else uses", "Avoiding any explanation of the reasoning", "Choosing based on which name sounds more advanced"], correct: 0, feedback: "A defensible choice makes its reasoning inspectable: what was needed, what was traded, and why.", hint: "What turns a guess into a defensible decision?" },
        ],
      },
    ],
    "/algorithms.png", "A tabletop study of branching paths, sorting tiles, and a maze grid.",
    { label: "MIT OpenCourseWare: Introduction to Algorithms", href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
  ),
  "sql-modeling": makeProgram(
    [
      {
        id: "01", unit: "RELATIONAL THINKING", title: "Model what the facts are about", description: "Separate entities, attributes, and relationships before writing queries.", checkpoint: "State what one row represents before adding a single column to the table.",
        concept: "A relational model stores facts about entities in tables and connects them through meaningful keys.",
        teaching: "Ask what one row represents. Give each entity a stable key, and avoid placing repeating groups in one cell.",
        example: "Students belong in a Students table, courses in Courses, and enrollments in a table that links one student to one course.",
        why: "The enrollment relationship has its own facts, such as term and grade, which do not belong to either entity alone.",
        takeaways: ["One table has one row meaning.", "Keys identify rows.", "Relationships can hold their own facts."],
        questions: [
          { prompt: "What does a row in an Enrollments table most naturally represent?", options: ["One student taking one course", "All courses at a university", "A random list of names", "One entire department"], correct: 0, feedback: "An enrollment is a relationship between a particular student and a particular course.", hint: "What two entities does an enrollment connect?" },
          { prompt: "A table stores a student's three phone numbers in one comma-separated cell. What modeling problem does this create?", options: ["It violates the idea that one cell should hold one atomic value, making the data hard to query and update", "It is the correct way to store multiple values", "It has no downsides for querying", "It automatically creates a related table"], correct: 0, feedback: "Repeating groups in one cell make filtering, updating, and joining on individual values difficult; each fact belongs in its own row or related table.", hint: "What happens when you need to search for just one of those phone numbers?" },
          { prompt: "A Courses table and an Instructors table both need to reference each other reliably. What should connect specific rows between them?", options: ["A stable key, such as an instructor ID, referenced as a foreign key", "Matching on instructor name text", "Row order in each table", "The table's file size"], correct: 0, feedback: "Names can repeat or change; a stable key reliably identifies which specific row is meant.", hint: "What happens if two instructors share the same name?" },
          { prompt: "Before creating a new table, what question most directly clarifies its design?", options: ["What does exactly one row in this table represent?", "What color should the table's header be?", "How many total tables does the database have?", "Which table was created first?"], correct: 0, feedback: "Naming the row's meaning clarifies which attributes belong in the table and which belong elsewhere.", hint: "What must be true about every single row for the table to make sense?" },
        ],
      },
      {
        id: "02", unit: "QUERY MEANING", title: "Ask exactly the question you mean", description: "Use selection, projection, and conditions deliberately.", checkpoint: "Translate the query into a plain-language sentence and check it matches the actual question.",
        concept: "A SQL query is a claim about a defined set of rows and columns; filters determine who is included.",
        teaching: "Read a query in plain language: which table, which rows, which columns, and which grouping does it request?",
        example: "SELECT name FROM Students WHERE major = 'Biology' asks for names only among biology students.",
        why: "Moving a condition or omitting it changes the population behind the answer.",
        takeaways: ["Filters define the population.", "Columns define the output.", "Translate SQL into a sentence."],
        questions: [
          { prompt: "What does a WHERE clause primarily control?", options: ["Which rows are included", "The font of results", "The database password", "The table's physical location"], correct: 0, feedback: "WHERE filters the rows that satisfy the stated condition.", hint: "Which part decides who belongs in the result?" },
          { prompt: "`SELECT name FROM Students` (no WHERE clause) runs instead of the intended query filtered to Biology majors. What changes?", options: ["It returns names from every major, not just Biology", "It returns an error", "It returns only Biology students anyway", "It returns no rows"], correct: 0, feedback: "Omitting the WHERE clause removes the filter, so the population expands to every row in the table.", hint: "What happens to the population when the filter is missing?" },
          { prompt: "A query selects `name, department` but the analyst only meant to report names. Why might the extra column still matter?", options: ["Extra columns can reveal or imply information beyond what was intended to be shared", "Extra columns never affect anything", "SQL requires exactly one column per query", "More columns always mean better analysis"], correct: 0, feedback: "The columns returned define what the output actually reveals; unintended columns can leak more than intended.", hint: "What does the output actually expose to whoever reads it?" },
          { prompt: "What is the best way to check that a query answers the intended question?", options: ["Translate the query into a plain-language sentence and compare it to the original question", "Run it and assume the result is correct if it doesn't error", "Check that the syntax is valid and stop there", "Compare the query's length to similar queries"], correct: 0, feedback: "Restating a query in plain language exposes mismatches between what was asked and what was actually written.", hint: "How do you catch a mismatch between intent and syntax?" },
        ],
      },
      {
        id: "03", unit: "JOINS", title: "Join without changing the population", description: "Check keys and cardinality before trusting a combined table.", checkpoint: "Compare row counts before and after a join to catch silent duplication or loss.",
        concept: "A join combines rows through a matching condition; duplicate keys or mismatched grain can multiply or drop records.",
        teaching: "State the expected row grain before the join, inspect key uniqueness, and compare counts before and after.",
        example: "Joining one order to multiple order-line rows will create multiple rows for that order.",
        why: "A total can be inflated if an order-level amount is repeated once for every line item.",
        takeaways: ["Joins can multiply rows.", "Match grain to the question.", "Audit row counts after joins."],
        questions: [
          { prompt: "Why can a join inflate an order-level total?", options: ["One order can match several line items, repeating the order amount", "Joins always remove rows", "SQL ignores duplicate keys", "Tables cannot be related"], correct: 0, feedback: "One-to-many joins repeat the one-side values across the many-side rows.", hint: "How many line items might match one order?" },
          { prompt: "Before trusting a join's output, what is the most useful audit step?", options: ["Compare row counts before and after the join to check for unexpected multiplication", "Assume the join is correct if the query runs without error", "Skip auditing if the tables are small", "Check only that column names match"], correct: 0, feedback: "A join can run successfully and still multiply or drop rows silently; comparing counts catches this.", hint: "What kind of error produces no syntax error at all?" },
          { prompt: "A join between Students and Enrollments is meant to list each student once, but a student who took 3 courses appears 3 times. What caused this?", options: ["The join is at the enrollment grain, not the student grain, so each enrollment produces a row", "The database has a bug", "Students cannot take multiple courses", "The join used the wrong table names"], correct: 0, feedback: "Joining to a many-side table changes the row grain; each matching enrollment produces its own row for that student.", hint: "What does each row in the joined result actually represent now?" },
          { prompt: "What should you check before joining two tables on a key column?", options: ["Whether that key is unique in at least one of the two tables", "Whether the tables have the same number of columns", "Whether the tables were created on the same day", "Whether the column names are capitalized the same way"], correct: 0, feedback: "If the key isn't unique on either side, the join can multiply rows in ways that are easy to miss.", hint: "What property of the key determines whether rows get multiplied?" },
        ],
      },
      {
        id: "04", unit: "AGGREGATES + AUDIT", title: "Aggregate, then audit", description: "Summarize groups while checking denominator and duplicates.", checkpoint: "State the denominator behind any rate or average before reporting it.",
        concept: "Aggregate functions summarize the rows currently present; GROUP BY defines which rows are summarized together.",
        teaching: "Before reporting a count or average, inspect the unit of analysis, missing values, duplicate records, and denominator.",
        example: "Counting rows in a visit table answers visits, not necessarily unique patients.",
        why: "A patient with three visits contributes three rows unless the query explicitly counts distinct patient IDs.",
        takeaways: ["Counts depend on row grain.", "Distinct changes the unit counted.", "Audit the denominator."],
        questions: [
          { prompt: "When should you use COUNT(DISTINCT patient_id)?", options: ["When the question is how many unique patients", "When counting every visit", "To sort a table", "To create a password"], correct: 0, feedback: "DISTINCT removes repeated patient IDs before counting, matching a unique-patient question.", hint: "Does the question ask about events or people?" },
          { prompt: "A report says '200 patients were seen' but it actually counted visit rows, not unique patient IDs. What is the risk?", options: ["The number may overstate unique patients if some patients had multiple visits", "The number is always accurate regardless of grain", "Visit counts and patient counts are always equal", "This mistake cannot happen with SQL"], correct: 0, feedback: "If any patient had more than one visit, counting rows overstates the number of unique patients.", hint: "What happens to the count if one patient shows up in three rows?" },
          { prompt: "A GROUP BY query averages wait time per clinic. One clinic has only 2 recorded visits, but it's reported the same way as a clinic with 5,000. What's missing?", options: ["The sample size behind each average, since small denominators are less stable", "The clinic's name", "The database's version number", "The time zone of the server"], correct: 0, feedback: "An average from 2 visits is far less reliable than one from 5,000; the denominator should accompany the summary.", hint: "Which average is more likely to swing wildly with one unusual visit?" },
          { prompt: "What is the best habit before reporting any aggregated number (count, average, sum)?", options: ["State what is being counted or averaged, over what population, and check the denominator", "Round the number to look cleaner", "Report it without further explanation if it seems reasonable", "Always prefer the largest number available"], correct: 0, feedback: "An aggregate is only meaningful alongside its definition, population, and denominator.", hint: "What three things make a number interpretable rather than just impressive?" },
        ],
      },
    ],
    "/sql-modeling.png", "Linked relational data cards, a database token, and key-shaped markers.",
    { label: "PostgreSQL documentation: SQL tutorial", href: "https://www.postgresql.org/docs/current/tutorial-sql.html" },
  ),
  "data-visualization": makeProgram(
    [
      {
        id: "01", unit: "CHART CHOICE", title: "Match the chart to the question", description: "Select a visual encoding that lets the comparison be seen.", checkpoint: "Name the comparison the reader needs to make before picking a chart form to make it.",
        concept: "A chart is an argument: its form should match the comparison, trend, distribution, or relationship the reader must evaluate.",
        teaching: "Name the question first, then choose an encoding that makes the relevant values easy to compare without decorative noise.",
        example: "To compare infection rates across six units, a sorted bar chart makes magnitude differences easier to read than a pie chart.",
        why: "Human comparison of aligned lengths is more reliable than comparison of many angles and areas.",
        takeaways: ["Start with the decision question.", "Choose a perceptually direct comparison.", "Reduce decoration that competes with evidence."],
        questions: [
          { prompt: "Which chart is usually clearest for comparing values across six named units?", options: ["A sorted bar chart", "A pie chart with six similar slices", "A decorative 3D chart", "A table with no labels"], correct: 0, feedback: "Aligned bar lengths make comparisons across named groups easy to judge.", hint: "What chart lets the reader compare magnitudes on a common baseline?" },
          { prompt: "A dataset tracks one metric changing over 24 months. Which chart form best matches this question?", options: ["A line chart showing the trend over time", "A pie chart", "A single bar", "A word cloud"], correct: 0, feedback: "A line chart makes a trend over a continuous sequence, like months, easy to follow.", hint: "What visual form is built to show change across an ordered sequence?" },
          { prompt: "A designer chooses a 3D exploded pie chart because it 'looks more impressive' for comparing 4 categories. What is the main risk?", options: ["3D distortion makes slice sizes harder to compare accurately, favoring decoration over clarity", "3D charts are always more accurate", "Pie charts are required for any categorical data", "There is no risk; visual appeal is the main goal"], correct: 0, feedback: "3D effects distort perceived area and angle, making comparisons less accurate — the opposite of what a chart should do.", hint: "What does the 3D effect do to how slice sizes are perceived?" },
          { prompt: "What should be decided first when choosing a chart form?", options: ["The specific comparison, trend, or relationship the reader needs to evaluate", "Which chart type looks most modern", "The color scheme", "The size of the image file"], correct: 0, feedback: "The chart's purpose — what comparison it must support — should drive the choice of form, not aesthetics alone.", hint: "What must be true about a chart before it can be judged well- or poorly-chosen?" },
        ],
      },
      {
        id: "02", unit: "SCALE + BASELINE", title: "Interrogate the visual claim", description: "Recognize how axes, ranges, and design choices change perceived difference.", checkpoint: "Check the axis baseline and range before reacting to how big a difference looks.",
        concept: "A truncated axis can visually amplify a small absolute difference; scale choices must be clear and appropriate to the claim.",
        teaching: "Read the baseline, range, units, and interval before reacting to a dramatic visual gap.",
        example: "Two satisfaction scores of 92% and 94% look dramatically different when a bar chart axis starts at 90%.",
        why: "The numbers differ by two percentage points; the chart's cropped range makes that modest difference look much larger.",
        takeaways: ["Check baselines.", "Separate absolute from visual difference.", "Use context when a truncated scale is justified."],
        questions: [
          { prompt: "What is the main risk of a truncated axis on a bar chart?", options: ["It can exaggerate a modest difference", "It always improves accuracy", "It removes all labels", "It makes data categorical"], correct: 0, feedback: "A narrow range can make small changes appear visually enormous relative to their actual magnitude.", hint: "Where does the displayed scale begin?" },
          { prompt: "Two bar charts show the same data: one y-axis starts at 0, the other at 90. Why might a reader reach different conclusions from each?", options: ["The truncated axis makes the same absolute difference look proportionally larger", "The data itself is different between the two charts", "Axis starting point never affects perception", "Only the color changes between the charts"], correct: 0, feedback: "The underlying numbers are identical; only the visual scale changes, which can mislead a reader about the size of the difference.", hint: "What actually differs between the two charts if the data is the same?" },
          { prompt: "When is a non-zero baseline potentially justified rather than misleading?", options: ["When the meaningful range of the data is narrow and the choice is clearly labeled", "Whenever it makes the trend look more dramatic", "Only for pie charts", "Never — all charts must start at zero"], correct: 0, feedback: "A narrow, clearly labeled range can be legitimate for genuinely small but meaningful variation; the key is transparency, not the baseline itself.", hint: "What makes a scale choice honest rather than deceptive?" },
          { prompt: "What should a careful reader check immediately when a chart shows a dramatic visual gap?", options: ["The axis baseline, range, and units before reacting to the visual size of the gap", "Only the chart's title", "The font used for the labels", "Whether the chart has a border"], correct: 0, feedback: "The scale determines how a real difference is visually represented; checking it first prevents being misled by design choices.", hint: "What determines how large a real difference looks on the page?" },
        ],
      },
      {
        id: "03", unit: "UNCERTAINTY", title: "Show what the estimate cannot say", description: "Present uncertainty, sample size, and variation as part of the evidence.", checkpoint: "Pair every estimate with the sample size it came from before treating it as precise.",
        concept: "A point estimate is incomplete when its uncertainty, variability, or denominator changes how confidently it should be interpreted.",
        teaching: "Label the population and time period, show uncertainty where appropriate, and avoid claiming a precise difference the data do not support.",
        example: "A clinic rate rises from 2% to 4%, but the underlying sample is only 50 patients and the interval is wide.",
        why: "The change may matter, but the small denominator means the estimate needs careful contextual interpretation.",
        takeaways: ["Denominators matter.", "Uncertainty belongs in the story.", "Precision is not the same as certainty."],
        questions: [
          { prompt: "Why should a reader see the denominator alongside a rate?", options: ["It helps judge how stable and meaningful the estimate is", "It makes the chart prettier", "It removes uncertainty", "It guarantees causation"], correct: 0, feedback: "The same percentage can reflect very different evidence when based on 10 versus 10,000 observations.", hint: "How many observations produced the rate?" },
          { prompt: "A chart shows a point estimate with no error bars or confidence interval. What can the reader NOT conclude from it alone?", options: ["How much the true value might plausibly vary around that point", "The exact numeric value shown", "The units being measured", "The time period covered"], correct: 0, feedback: "A single point hides how precise or uncertain that estimate actually is; uncertainty needs to be shown separately.", hint: "What does a point estimate alone fail to communicate?" },
          { prompt: "A rate rises from 10% to 15% in a sample of 8 people. What is the most defensible framing?", options: ["The change is based on a very small sample and should be interpreted cautiously", "The 5-point increase is a large, certain effect", "Small samples are just as reliable as large ones", "The rate change proves a causal relationship"], correct: 0, feedback: "With only 8 people, a shift from 10% to 15% may reflect the change of a single person, not a stable trend.", hint: "How many people would need to change status to move this rate?" },
          { prompt: "What is the strongest way to present uncertainty responsibly in a chart?", options: ["Show the estimate alongside its sample size and, where possible, a range of plausible values", "Omit uncertainty so the chart looks cleaner", "Only show uncertainty when the news is good", "Replace numbers with vague verbal descriptions"], correct: 0, feedback: "Pairing the estimate with sample size and a plausible range lets the reader judge confidence honestly.", hint: "What two things does a reader need alongside a single number?" },
        ],
      },
      {
        id: "04", unit: "DESIGN DEFENSE", title: "Defend an honest comparison", description: "Explain a chart choice to a skeptical reader.", checkpoint: "Write the one-sentence claim your chart is meant to support, then check every visual choice against it.",
        concept: "An honest visualization makes its population, measure, comparison, scale, and uncertainty inspectable rather than hiding them behind polish.",
        teaching: "Write a one-sentence claim, then check that every visual choice supports that claim without overstating it.",
        example: "A line chart shows monthly wait time with a clearly labeled median, sample size, and a note describing an outlier month.",
        why: "Readers can see what changed, how it was summarized, and what context limits the conclusion.",
        takeaways: ["Make the claim explicit.", "Label the measure and population.", "Invite inspection, not persuasion by decoration."],
        questions: [
          { prompt: "Which addition most improves the defensibility of a trend chart?", options: ["A labeled measure, population, time period, and relevant context", "A stronger gradient", "A 3D effect", "Fewer labels regardless of audience"], correct: 0, feedback: "Context lets a reader evaluate what the trend actually represents and how far the claim can go.", hint: "What information would a skeptical reader need to evaluate the claim?" },
          { prompt: "A skeptical reader asks 'compared to what?' about a chart showing '20% improvement.' What is missing from the chart?", options: ["A clearly labeled baseline or comparison group that the 20% is measured against", "A brighter color palette", "A larger font size", "An animated transition"], correct: 0, feedback: "A percentage change is only meaningful relative to a stated baseline; without it, the claim can't be evaluated.", hint: "What does 'improvement' need to be measured against?" },
          { prompt: "Before publishing a chart, the designer writes a one-sentence claim it is meant to support. What is this practice meant to catch?", options: ["Visual choices that don't actually support, or that overstate, the stated claim", "Whether the file size is small enough", "Whether the chart uses the company's brand colors", "How long the chart took to build"], correct: 0, feedback: "Writing the claim first gives a concrete standard to check every visual decision against, catching overstatement or mismatch.", hint: "What does having an explicit claim let you check every design choice against?" },
          { prompt: "What distinguishes an honest visualization from a persuasive one, in this framework?", options: ["It invites inspection of its population, measure, and uncertainty rather than hiding them behind polish", "It uses more colors and animation", "It never shows any negative results", "It is always simpler than a persuasive chart"], correct: 0, feedback: "Honesty here means transparency — every element that would let a skeptical reader check the claim is visible, not hidden.", hint: "What does an honest chart let the reader do that a purely persuasive one avoids?" },
        ],
      },
    ],
    "/data-visualization.png", "Clear and misleading chart cards arranged with a ruler and annotation pencil.",
    { label: "NIST: Exploratory Data Analysis", href: "https://www.itl.nist.gov/div898/handbook/eda/section1/eda11.htm" },
  ),
  "statistical-inference": makeProgram(
    [
      {
        id: "01", unit: "SIGNIFICANCE", title: "Read a p-value for what it actually says", description: "Separate 'unlikely by chance' from 'important' or 'true'.",
        concept: "A p-value is the probability of seeing data this extreme (or more) if the null hypothesis were true; it is not the probability the hypothesis is true.",
        teaching: "Before citing a p-value, state the null hypothesis it tests, and remember a small p-value describes surprise under that hypothesis, not the size or importance of an effect.",
        example: "A new triage script produces p = 0.03 for reducing wait time compared with the old script, in a trial of 40,000 patients.",
        why: "With a very large sample, even a trivially small, practically meaningless difference can produce a small p-value.",
        takeaways: ["A p-value is conditional on the null hypothesis.", "Statistical significance is not the same as practical importance.", "Always check the effect size alongside the p-value."],
        checkpoint: "Ask what practical difference the effect represents before treating a small p-value as important.",
        questions: [
          { prompt: "A trial finds p = 0.04 for a new drug's effect on blood pressure. What does this p-value most directly tell you?", options: ["How likely the drug's effect would be if it truly had no effect on blood pressure", "The probability the drug works", "The size of the drug's effect", "The probability the null hypothesis is true"], correct: 0, feedback: "A p-value describes how surprising the observed data would be under the null hypothesis, not the probability that hypothesis is true.", hint: "What is being tested, and what is a p-value conditional on?" },
          { prompt: "A study of 500,000 users finds a 0.01% increase in click rate with p = 0.001. What should a skeptical reader ask next?", options: ["Whether a 0.01% difference is practically meaningful for the business", "Nothing, since p < 0.05 proves the change matters", "Whether the p-value could be even smaller", "Whether the sample was randomly assigned only"], correct: 0, feedback: "Extremely large samples can make tiny, practically irrelevant differences statistically significant.", hint: "What does sample size do to how small a real difference needs to be to reach significance?" },
          { prompt: "Which best distinguishes practical significance from statistical significance?", options: ["Practical significance asks whether the effect size matters for a real decision; statistical significance asks whether it's likely due to chance", "They are two names for the same concept", "Statistical significance is always the stronger claim", "Practical significance requires a smaller p-value"], correct: 0, feedback: "A statistically significant effect can still be too small to matter, and a practically important effect can fail to reach significance in a small sample.", hint: "What question does each type of significance actually answer?" },
          { prompt: "Before reporting a significant result, what is the most defensible next step?", options: ["State the effect size and its real-world implication alongside the p-value", "Round the p-value to make it look more convincing", "Omit the sample size to keep the report simple", "Repeat the test until a smaller p-value appears"], correct: 0, feedback: "Reporting effect size and context lets readers judge whether a statistically significant result is also practically meaningful.", hint: "What number, besides the p-value, tells a reader how much the result matters?" },
        ],
      },
      {
        id: "02", unit: "INTERVALS", title: "Judge a confidence interval, not just a point estimate", description: "Use the width and range of an interval, not only its midpoint.",
        concept: "A confidence interval describes a range of plausible values for a parameter, and its width reflects the precision of the estimate.",
        teaching: "Look at where the interval falls and how wide it is—a wide interval crossing a meaningful threshold means the estimate cannot rule out that possibility.",
        example: "A poll estimates approval at 52%, with a 95% confidence interval of 47% to 57%.",
        why: "The interval includes values below 50%, so the poll cannot rule out that true approval is actually a minority.",
        takeaways: ["A point estimate alone hides uncertainty.", "A wide interval signals low precision.", "Check whether a meaningful threshold falls inside the interval."],
        checkpoint: "Check whether a decision-relevant threshold falls inside the confidence interval before treating the point estimate as settled.",
        questions: [
          { prompt: "A poll shows 52% approval with a 95% CI of 47%–57%. What is the most defensible conclusion?", options: ["The true approval could plausibly be below 50%, so a majority is not confirmed", "Approval is definitely above 50%", "The poll is invalid because the interval is wide", "Approval is exactly 52%"], correct: 0, feedback: "Since 50% falls inside the interval, the data cannot rule out that true approval is below a majority.", hint: "Does the interval include values below the threshold that matters?" },
          { prompt: "Two studies estimate the same effect: Study A gives a CI of 2%–4%; Study B gives a CI of -3%–9%. Which is more precise?", options: ["Study A, because its interval is narrower", "Study B, because its interval is wider", "They are equally precise", "Precision cannot be judged from intervals"], correct: 0, feedback: "A narrower interval reflects a more precise estimate of the true value.", hint: "What does interval width tell you about precision?" },
          { prompt: "Why is reporting only a point estimate (like '52% approval') potentially misleading?", options: ["It hides how much the estimate could plausibly vary", "Point estimates are always wrong", "It always overstates the true value", "Point estimates cannot be calculated accurately"], correct: 0, feedback: "Without the interval, a reader cannot judge how confident to be in the exact number.", hint: "What information does a single number fail to communicate?" },
          { prompt: "A confidence interval for a new treatment's effect is -1 to +8 (in units of improvement). What is the most defensible interpretation?", options: ["The data cannot rule out that the treatment has no effect or even a slightly negative one", "The treatment definitely works", "The treatment definitely does not work", "The interval proves the effect is exactly 3.5"], correct: 0, feedback: "Because the interval includes zero and negative values, a true zero or negative effect cannot be ruled out.", hint: "Does the interval include zero?" },
        ],
      },
      {
        id: "03", unit: "SAMPLING", title: "Question a sample before trusting its conclusion", description: "Check who was included, and who was left out, before generalizing.",
        concept: "A sample's conclusions only generalize to the population it was actually drawn from, using the method it was actually drawn by.",
        teaching: "Ask who could have been included, who opted in or was excluded, and whether the sampling method could systematically favor certain outcomes.",
        example: "An online survey about commute times only reaches people who use the survey app, likely skewing toward tech-comfortable, younger respondents.",
        why: "The result may describe app users' commutes, not the commute times of the general population.",
        takeaways: ["Ask who was excluded from the sample.", "A large sample does not fix a biased sampling method.", "Match the population you're generalizing to the population you sampled."],
        checkpoint: "Name the population the sample actually represents before generalizing its conclusion further.",
        questions: [
          { prompt: "An online survey about commute times reaches only users of a specific ride-sharing app. What is the main risk in generalizing its results?", options: ["The sample may not represent people who don't use that app", "Online surveys are always inaccurate", "The sample size is definitely too small", "Commute times never vary by group"], correct: 0, feedback: "Convenience samples like this systematically exclude people outside the app's user base, biasing the result.", hint: "Who was never able to be included in this sample?" },
          { prompt: "A study surveys 100,000 people but only through a single social media platform popular with one age group. Why doesn't the large sample size fix the bias?", options: ["A large sample from a biased source is still biased, just biased with more precision", "100,000 is always enough to represent any population", "Sample size and bias are unrelated to sampling method", "Bias only matters in small samples"], correct: 0, feedback: "Increasing sample size reduces random error but does not correct a systematic sampling bias.", hint: "What kind of error does a bigger sample size actually reduce?" },
          { prompt: "A hospital study only includes patients who returned for a follow-up visit. What population does this sample actually represent?", options: ["Patients well enough or motivated enough to return for follow-up, not all treated patients", "All patients treated at the hospital", "A random sample of the general public", "Every patient equally, regardless of outcome"], correct: 0, feedback: "Patients who don't return (possibly due to worse or better outcomes) are systematically excluded, changing what the sample represents.", hint: "Who is missing from a 'returned for follow-up' sample?" },
          { prompt: "Before generalizing a sample's finding to a broader population, what is the most important check?", options: ["Whether the sampling method could systematically exclude or favor certain groups", "Whether the sample size is over 1,000", "Whether the study used a computer to collect data", "Whether the result matches expectations"], correct: 0, feedback: "A representative sampling method matters more than raw sample size for valid generalization.", hint: "What determines whether a sample represents the population you care about?" },
        ],
      },
      {
        id: "04", unit: "EFFECT SIZE", title: "Tell a real effect from noise", description: "Use replication and effect size to judge whether a result is trustworthy.",
        concept: "A single significant result can arise from chance, especially when many comparisons are tested; replication and consistent effect size build confidence.",
        teaching: "Be cautious of a single striking result from many tested comparisons, and look for replication or a plausible mechanism before trusting it.",
        example: "Out of 20 unrelated snack-food comparisons, one shows a 'significant' link to test scores at p < 0.05.",
        why: "Testing 20 comparisons at the 5% significance level makes finding at least one 'significant' result by chance alone likely, even if nothing is really related.",
        takeaways: ["Multiple comparisons inflate the chance of a false positive.", "Replication is stronger evidence than a single result.", "A plausible mechanism strengthens a statistical finding."],
        checkpoint: "Ask how many comparisons were tested before trusting a single significant finding among them.",
        questions: [
          { prompt: "Out of 20 unrelated comparisons tested at p < 0.05, one comes back significant. What is the most defensible interpretation?", options: ["This could easily be a false positive from testing many comparisons", "This one result is definitely real", "Statistical significance guarantees a true finding", "None of the 20 comparisons should ever be tested"], correct: 0, feedback: "Testing many comparisons at the same threshold makes at least one false positive likely by chance alone.", hint: "How many 'rolls of the dice' happened before this result appeared?" },
          { prompt: "What is the strongest way to build confidence in a surprising significant finding?", options: ["Successfully replicate it in an independent study or sample", "Lower the significance threshold after seeing the result", "Report only the significant comparison and omit the others", "Repeat the same test on the same data until it's significant"], correct: 0, feedback: "Independent replication is much stronger evidence than a single significant result, especially one found among many tests.", hint: "What kind of evidence is hardest to produce by chance?" },
          { prompt: "A researcher tests 50 comparisons and reports only the 3 that were significant, without mentioning the other 47. What problem does this create?", options: ["It hides how likely those 3 findings were to occur by chance among 50 tests", "It has no effect on how the results should be interpreted", "It only matters if the sample size is small", "It makes the findings more trustworthy"], correct: 0, feedback: "Selectively reporting significant results without disclosing the total number tested hides the true likelihood of chance findings.", hint: "What context does a reader need to judge how surprising 3 out of 50 significant results really is?" },
          { prompt: "Which factor most increases confidence that an effect is real rather than noise?", options: ["A plausible mechanism plus a result that replicates across independent studies", "A single study with a very small p-value", "A large number of comparisons tested at once", "A dramatic-looking chart"], correct: 0, feedback: "A plausible explanation combined with independent replication is much stronger evidence than one low p-value.", hint: "What two things together make a finding hard to explain away as chance?" },
        ],
      },
    ],
    "/course-library-hero.png", "An editorial composition representing statistical reasoning.",
    { label: "NIST/SEMATECH e-Handbook of Statistical Methods", href: "https://www.itl.nist.gov/div898/handbook/" },
  ),
  "ml-foundations": makeProgram(
    [
      {
        id: "01", unit: "TRAIN VS TEST", title: "Judge a model on data it hasn't seen", description: "Training accuracy alone proves nothing about new data.",
        concept: "A model's performance on the data it was trained on does not indicate how it will perform on new data; held-out test data is required to estimate real-world performance.",
        teaching: "Always separate training data from testing data, and be suspicious of any accuracy reported only on the training set.",
        example: "A model reaches 99% accuracy on its training data but only 62% on a held-out test set.",
        why: "The gap reveals the model memorized specifics of the training data rather than learning a generalizable pattern—overfitting.",
        takeaways: ["Training accuracy alone proves nothing about new data.", "A large train-test gap signals overfitting.", "Held-out data estimates real-world performance."],
        checkpoint: "Check the gap between training and test performance before trusting a model's reported accuracy.",
        questions: [
          { prompt: "A model scores 99% on training data and 62% on held-out test data. What does this gap suggest?", options: ["The model has likely overfit the training data", "The model is performing excellently", "The test set must be broken", "Higher training accuracy always means a better model"], correct: 0, feedback: "A large gap between training and test performance is the classic signature of overfitting.", hint: "What does it mean when a model does far better on data it has already seen?" },
          { prompt: "Why is it misleading to report a model's accuracy using only its training data?", options: ["It cannot show how the model performs on data it hasn't seen", "Training accuracy is always inaccurate to calculate", "Test data is optional for any real evaluation", "Training data is always larger than test data"], correct: 0, feedback: "A model can memorize training data without learning a pattern that generalizes; test data is needed to check that.", hint: "What is training accuracy unable to reveal about future predictions?" },
          { prompt: "A team improves training accuracy by making the model larger and more complex, but test accuracy gets worse. What does this suggest?", options: ["The added complexity is helping the model memorize rather than generalize", "The model is now definitely better", "Test accuracy is irrelevant if training accuracy improves", "Larger models are always more accurate on new data"], correct: 0, feedback: "Increasing complexity can let a model fit noise in the training data, hurting generalization to new data.", hint: "What tends to happen to generalization when a model grows more complex without more diverse data?" },
          { prompt: "What is the most defensible way to estimate how a model will perform in production?", options: ["Evaluate it on data it was not trained on, ideally similar to what it will see in production", "Report its accuracy on the training set", "Ask the model how confident it is", "Assume higher training accuracy transfers directly"], correct: 0, feedback: "Held-out, production-like data gives the most honest estimate of real-world performance.", hint: "What data best mimics the conditions the model will actually face?" },
        ],
      },
      {
        id: "02", unit: "DATA QUALITY", title: "Trust the data before you trust the model", description: "A model can only learn what its training data actually shows it.",
        concept: "A model can only learn patterns present in its training data; biased, mislabeled, or unrepresentative data produces a biased or unreliable model.",
        teaching: "Before evaluating a model's algorithm, examine who and what is represented in its training data, and how labels were assigned.",
        example: "A hiring model trained mostly on resumes from past hires, who were disproportionately from a few universities, learns to favor those universities.",
        why: "The model reproduces and can amplify the historical pattern in its training data, not some neutral notion of merit.",
        takeaways: ["A model reflects its training data's patterns, including biases.", "Check who is represented and how labels were created.", "A biased dataset produces a biased model regardless of algorithm quality."],
        checkpoint: "Ask who is represented, and how, in the training data before trusting what the model has learned.",
        questions: [
          { prompt: "A hiring model trained on past hires, mostly from a few universities, ends up favoring applicants from those same schools. What is the root cause?", options: ["The training data reflected a historical pattern the model learned to reproduce", "The algorithm itself is inherently flawed", "This always happens regardless of training data", "The model is malfunctioning"], correct: 0, feedback: "The model faithfully learned the pattern present in its training data, including its historical skew.", hint: "Where did the model's preference actually come from?" },
          { prompt: "Why might mislabeled training data be more damaging than a small training set?", options: ["A model can learn confidently wrong patterns from bad labels, not just uncertain ones from a small set", "Mislabeled data has no effect on model performance", "Small training sets are never a problem", "Mislabeled data only matters at very large scale"], correct: 0, feedback: "Wrong labels teach the model incorrect patterns with apparent confidence, which can be more misleading than sparse but correct data.", hint: "What's the difference between a model that has too little data and one trained on wrong answers?" },
          { prompt: "Before trusting a model's predictions about a new population, what should you check?", options: ["Whether the training data actually represents that population", "Only the model's reported accuracy number", "How fast the model makes predictions", "How many parameters the model has"], correct: 0, feedback: "A model trained on one population may not generalize to a different population it wasn't trained on.", hint: "What does a model actually 'know' about besides its own training data?" },
          { prompt: "A company removes a protected attribute like gender from its hiring model's inputs, but the model still shows a similar bias. What is the likely explanation?", options: ["Other features (like university or zip code) may act as proxies correlated with the removed attribute", "Removing the attribute should have completely eliminated any bias", "Bias in models is impossible to reduce", "The remaining features must be broken"], correct: 0, feedback: "Correlated proxy variables can reintroduce the same pattern even after removing the explicit attribute.", hint: "Could another feature be quietly standing in for the one that was removed?" },
        ],
      },
      {
        id: "03", unit: "METRICS", title: "Choose a metric that matches the real cost of errors", description: "Accuracy alone can hide poor performance on rare outcomes.",
        concept: "Accuracy alone can be misleading, especially with imbalanced classes; the right metric depends on the relative cost of false positives and false negatives.",
        teaching: "Before accepting an accuracy number, ask how common the outcome is and what a false positive costs versus a false negative.",
        example: "A rare-disease screening model that always predicts 'no disease' can still score 99% accuracy if only 1% of patients actually have the disease.",
        why: "That model is useless for its purpose—it catches zero real cases—despite a seemingly excellent accuracy score.",
        takeaways: ["Accuracy can hide poor performance on rare but important outcomes.", "Match the metric to the cost of each error type.", "Check the base rate of the outcome being predicted."],
        checkpoint: "Check the base rate of the outcome and the relative cost of each error type before trusting an accuracy score.",
        questions: [
          { prompt: "A rare-disease model predicts 'no disease' for everyone and scores 99% accuracy, since only 1% of patients are actually sick. Is this a good model?", options: ["No, it catches zero real cases despite the high accuracy score", "Yes, 99% accuracy is excellent by definition", "Yes, because accuracy is always the right metric", "It cannot be evaluated without more computing power"], correct: 0, feedback: "With a 1% base rate, always predicting the majority class scores high accuracy while being completely useless at its actual task.", hint: "How many real disease cases does this model actually catch?" },
          { prompt: "For a spam filter, a false positive (blocking a real email) is far more costly to the user than a false negative (missing one spam email). What should this influence?", options: ["The metric and threshold chosen should weigh false positives more heavily than false negatives", "Accuracy is still the only metric that matters", "False positives and false negatives should always be weighed equally", "The model should be tuned to minimize training time instead"], correct: 0, feedback: "When error costs are asymmetric, the evaluation metric and decision threshold should reflect that asymmetry.", hint: "Should a model treat both kinds of mistakes as equally bad here?" },
          { prompt: "What question should come before choosing a model evaluation metric?", options: ["What does a false positive cost, and what does a false negative cost, in this specific use case?", "Which metric produces the highest-looking number?", "Which metric is fastest to compute?", "Which metric was used in the original research paper?"], correct: 0, feedback: "The right metric depends on the real-world consequences of each type of error for this specific application.", hint: "What should actually drive the choice of metric?" },
          { prompt: "A model for detecting fraud has 99.5% accuracy but misses 80% of actual fraud cases. What does this reveal?", options: ["Accuracy alone hid poor performance on the rare, important outcome (fraud)", "The model must be excellent since accuracy is so high", "This is impossible if accuracy is that high", "Fraud detection doesn't need metrics beyond accuracy"], correct: 0, feedback: "Because fraud is rare, a model can achieve high overall accuracy while still failing at detecting most real fraud cases.", hint: "How does a rare positive class affect what accuracy alone can hide?" },
        ],
      },
      {
        id: "04", unit: "DEPLOYMENT", title: "Watch a model after it ships, not just before", description: "Deployed models need ongoing monitoring, not a one-time check.",
        concept: "A model's performance can degrade over time as real-world data drifts away from its training data; deployed models need ongoing monitoring.",
        teaching: "Treat model deployment as the start of an ongoing evaluation, not the end of the project—monitor real predictions against real outcomes.",
        example: "A demand-forecasting model trained on pre-pandemic shopping data performs progressively worse as shopping habits shift.",
        why: "Without monitoring, the model's declining accuracy would go unnoticed until its recommendations caused real business harm.",
        takeaways: ["Real-world data can drift away from training data over time.", "Monitoring after deployment is not optional.", "A model that was accurate at launch can degrade silently."],
        checkpoint: "Set up monitoring that compares the model's live predictions against real outcomes, not just its launch-day accuracy.",
        questions: [
          { prompt: "A demand-forecasting model trained on pre-pandemic data performs progressively worse as shopping habits shift. What does this illustrate?", options: ["Real-world data can drift away from training data over time, degrading performance", "Once trained, a model's accuracy never changes", "The original training was necessarily flawed", "This only happens to forecasting models"], correct: 0, feedback: "Data drift means the patterns a model learned can become outdated as real-world conditions change.", hint: "What changed between when the model was trained and when it was being used?" },
          { prompt: "Why is monitoring a model after deployment necessary, even if it performed well in testing?", options: ["Real-world conditions can drift away from the test data, silently degrading performance", "A model that passed testing can never fail in production", "Monitoring is only needed for models that failed testing", "Testing performance guarantees permanent production performance"], correct: 0, feedback: "Good test performance reflects conditions at one point in time; ongoing monitoring catches drift that testing cannot predict.", hint: "Does passing a test once guarantee performance forever?" },
          { prompt: "A fraud-detection model's accuracy silently drops over 6 months as fraud tactics evolve, but no one is monitoring live performance. What is the main risk?", options: ["The degradation goes unnoticed until it causes real financial harm", "The model will automatically fix itself over time", "This is not a real risk if the model tested well initially", "Fraud tactics never actually change"], correct: 0, feedback: "Without monitoring, a gradually degrading model can cause significant harm before anyone notices the problem.", hint: "What happens when performance decline has no one watching for it?" },
          { prompt: "What is the most defensible practice for a model already in production?", options: ["Continuously compare its predictions against real outcomes and retrain when performance drifts", "Deploy it once and revisit only if users complain", "Assume launch-day performance holds indefinitely", "Retrain on a fixed yearly schedule regardless of performance"], correct: 0, feedback: "Active monitoring against real outcomes catches drift early, rather than waiting for a fixed schedule or user complaints.", hint: "What signal should actually trigger a retrain?" },
        ],
      },
    ],
    "/course-library-hero.png", "An editorial composition representing machine learning reasoning.",
    { label: "Google: Machine Learning Crash Course", href: "https://developers.google.com/machine-learning/crash-course" },
  ),
  "systems-design": makeProgram(
    [
      {
        id: "01", unit: "SCALE", title: "Name the bottleneck before scaling anything", description: "A system is only as fast as its most constrained resource.",
        concept: "A system slows down at its bottleneck—the single most constrained resource—and scaling unrelated parts does not help.",
        teaching: "Measure where time is actually spent before adding capacity; adding servers to a part of the system that isn't the bottleneck wastes effort.",
        example: "A web app is slow because every request waits on a single database connection, but the team adds more web servers.",
        why: "More web servers just means more requests waiting on the same single database bottleneck—no improvement.",
        takeaways: ["Identify the bottleneck before scaling.", "Scaling a non-bottleneck resource does not help.", "Measure, don't guess, where time is spent."],
        checkpoint: "Measure where requests actually spend their time before deciding what to scale.",
        questions: [
          { prompt: "A slow web app has every request waiting on one shared database connection, but the team adds more web servers. Why doesn't this help?", options: ["The bottleneck is the database connection, not the web servers", "Adding servers always fixes performance issues", "The database was never actually the problem", "Web servers and database connections scale identically"], correct: 0, feedback: "Since every request still waits on the same single database bottleneck, adding web servers doesn't relieve the actual constraint.", hint: "What is every request actually waiting on?" },
          { prompt: "What is the most reliable way to find a system's bottleneck?", options: ["Measure where requests actually spend their time", "Guess based on which component seems most complex", "Add more resources everywhere until it's fast", "Assume the newest component is the problem"], correct: 0, feedback: "Measurement reveals where time is actually spent, rather than relying on assumptions about complexity or age.", hint: "How do you know where time is going without measuring it?" },
          { prompt: "A team doubles their server count but response time barely improves. What does this suggest?", options: ["The bottleneck is likely somewhere else, such as a database or external service", "Doubling servers should always double performance", "The measurement tools must be broken", "The application code is definitely the only issue"], correct: 0, feedback: "If scaling a resource doesn't improve performance, that resource probably wasn't the actual bottleneck.", hint: "What does it mean when scaling one resource has little effect?" },
          { prompt: "Before recommending a scaling solution, what should a systems designer establish first?", options: ["Which specific resource is the limiting factor under real load", "Which solution is cheapest regardless of the actual bottleneck", "Which vendor offers the newest hardware", "How many total servers the company currently owns"], correct: 0, feedback: "A scaling recommendation is only useful if it targets the actual bottleneck identified under real load.", hint: "What must be true about a fix for it to actually help?" },
        ],
      },
      {
        id: "02", unit: "CACHING", title: "Cache what's expensive and stable, not everything", description: "Caching trades freshness for speed—choose carefully.",
        concept: "Caching trades staleness for speed; it works best for data that's expensive to compute and doesn't change too often.",
        teaching: "Before caching something, ask how expensive it is to recompute and how often it changes—caching fast-changing data risks serving stale results.",
        example: "A dashboard caches a user's account balance for 10 minutes to reduce database load.",
        why: "If the balance changes (a payment posts) within that window, the user sees a stale, incorrect number—an unacceptable tradeoff for financial data.",
        takeaways: ["Caching trades freshness for speed.", "Cache expensive, slow-changing data.", "Some data (like financial balances) may be too sensitive to cache without careful invalidation."],
        checkpoint: "Ask what happens if a user sees stale data before caching something that changes frequently or matters urgently.",
        questions: [
          { prompt: "A dashboard caches a user's account balance for 10 minutes. What is the main risk?", options: ["A user could see a stale, incorrect balance after a recent transaction", "Caching always makes data more accurate", "The cache will never expire", "Balances never change within 10 minutes"], correct: 0, feedback: "Any change within the cache window won't be reflected, so the user may see outdated financial data.", hint: "What happens if the real balance changes before the cache expires?" },
          { prompt: "Which is the best candidate for caching?", options: ["A product description that rarely changes and is expensive to render", "A live stock price during trading hours", "A user's current account balance", "A one-time payment confirmation"], correct: 0, feedback: "Stable, expensive-to-compute data is the ideal caching candidate; frequently changing or sensitive data is risky to cache.", hint: "Which of these changes least often and costs the most to regenerate?" },
          { prompt: "Why is caching described as a tradeoff rather than a pure win?", options: ["It trades data freshness for speed, risking staleness", "It has no downsides once implemented", "It always makes data more accurate", "It only affects storage costs"], correct: 0, feedback: "Caching improves speed but risks serving outdated data until the cache is refreshed or invalidated.", hint: "What do you give up in exchange for faster responses?" },
          { prompt: "Before adding a cache to a fast-changing data source, what should a designer plan for first?", options: ["A clear invalidation strategy so stale data doesn't linger", "Nothing—caching is always safe to add", "The largest possible cache size", "Removing the original data source entirely"], correct: 0, feedback: "Without a plan to invalidate or refresh the cache, fast-changing data can become misleadingly stale.", hint: "What mechanism keeps a cache from serving outdated data indefinitely?" },
        ],
      },
      {
        id: "03", unit: "FAILURE MODES", title: "Design for the failure, not just the happy path", description: "Resilient systems assume components will fail.",
        concept: "Distributed systems fail partially and unpredictably; resilient design assumes components will fail and limits the damage when they do.",
        teaching: "Ask what happens to the rest of the system when one dependency becomes slow or unavailable, not just whether the happy path works.",
        example: "A checkout page calls a recommendation service; when that service times out, the entire checkout page fails to load instead of just omitting recommendations.",
        why: "A non-critical dependency was allowed to take down a critical path, when a graceful fallback (skip recommendations) would have preserved checkout.",
        takeaways: ["Assume dependencies will fail.", "Separate critical paths from non-critical ones.", "Design graceful fallbacks for non-critical failures."],
        checkpoint: "Ask what should happen to the rest of the system if this one dependency fails or times out.",
        questions: [
          { prompt: "A checkout page fails entirely when a non-critical recommendation service times out. What is the design flaw?", options: ["A non-critical dependency was allowed to break a critical path", "Recommendation services should never be used", "Timeouts should never be allowed to occur", "Checkout pages should never call external services"], correct: 0, feedback: "A resilient design would let checkout proceed without recommendations rather than fail entirely.", hint: "Was the recommendation service actually necessary for checkout to succeed?" },
          { prompt: "What is the best way to prevent one failing dependency from taking down an entire page?", options: ["Design a graceful fallback so non-critical failures don't block critical functionality", "Ensure no dependency ever fails", "Remove all external dependencies from every page", "Retry the failing dependency indefinitely before giving up"], correct: 0, feedback: "Graceful fallbacks let critical functionality continue even when a non-critical dependency is unavailable.", hint: "What should happen to the rest of the page when one non-critical piece fails?" },
          { prompt: "Why should resilient system design assume components will fail, rather than hoping they won't?", options: ["In distributed systems, partial and unpredictable failures are common and must be planned for", "Well-built systems never fail", "Assuming failure is unnecessarily pessimistic and wastes engineering time", "Failure only matters for very large systems"], correct: 0, feedback: "Distributed systems experience partial failures regularly; planning for them prevents cascading outages.", hint: "How often do real distributed systems actually experience partial failures?" },
          { prompt: "Which practice best reflects designing for failure rather than just the happy path?", options: ["Identifying which failures are survivable and building fallbacks for them", "Testing only the scenario where everything works correctly", "Assuming failures are rare enough to ignore", "Adding more features instead of handling edge cases"], correct: 0, feedback: "Deliberately identifying and planning for failure scenarios is the core practice of resilient design.", hint: "What should a designer actively look for, beyond the success case?" },
        ],
      },
      {
        id: "04", unit: "TRADEOFFS", title: "Defend a design tradeoff with the actual constraints", description: "There is rarely one universally 'correct' architecture.",
        concept: "System design decisions trade off consistency, availability, latency, and cost; there is rarely a single 'correct' architecture independent of the actual requirements.",
        teaching: "Name the specific constraints (traffic pattern, consistency needs, budget, team size) before defending one architecture over another.",
        example: "A team debates a complex microservices architecture for a product with three engineers and a few hundred daily users.",
        why: "The operational complexity of microservices may cost more in coordination overhead than it saves, given the actual scale and team size.",
        takeaways: ["Match architecture complexity to actual scale and team size.", "Name specific constraints before defending a design.", "The 'best' architecture depends on context, not fashion."],
        checkpoint: "Name the actual scale, team size, and constraints before defending one architecture over another.",
        questions: [
          { prompt: "A team of three engineers building a product with a few hundred daily users debates adopting a complex microservices architecture. What is the strongest concern?", options: ["The operational complexity may cost more than it saves at this scale and team size", "Microservices are always the best choice for any team", "A monolith can never scale later if needed", "Three engineers is always enough for any architecture"], correct: 0, feedback: "Microservices add coordination and operational overhead that may not be justified for a small team and modest scale.", hint: "Does the complexity of this architecture match the team's size and actual traffic?" },
          { prompt: "What should drive an architecture decision, according to defensible systems design?", options: ["The system's actual constraints: traffic pattern, consistency needs, budget, and team size", "Whichever architecture is most popular in the industry", "Whichever architecture is most technically impressive", "The architecture used by the largest company in the field"], correct: 0, feedback: "Defensible design decisions are grounded in the specific constraints of the system being built, not trends.", hint: "What should actually determine the right architecture for a given system?" },
          { prompt: "A system needs strong consistency for financial transactions but the team proposes an architecture optimized for maximum availability during network partitions. What tension does this reveal?", options: ["A tradeoff between consistency and availability that needs to be resolved based on the transaction requirements", "There is no real tradeoff between consistency and availability", "Availability should always be prioritized over consistency", "This tension only matters for very large systems"], correct: 0, feedback: "Consistency and availability often trade off directly; financial transactions typically require prioritizing consistency.", hint: "What do financial transactions typically need more than uptime during a network split?" },
          { prompt: "What makes a system design decision defensible to a skeptical reviewer?", options: ["Naming the specific constraints considered and how the chosen design addresses them", "Choosing the same architecture as a well-known tech company", "Avoiding any explanation of the reasoning behind the choice", "Picking the design that took the least time to describe"], correct: 0, feedback: "A defensible decision makes its reasoning about actual constraints visible and inspectable.", hint: "What turns a design choice from a guess into a defensible decision?" },
        ],
      },
    ],
    "/course-library-hero.png", "An editorial composition representing systems design reasoning.",
    { label: "Google SRE Book: Introduction", href: "https://sre.google/sre-book/introduction/" },
  ),
  "critical-thinking": makeProgram(
    [
      {
        id: "01", unit: "CLAIMS + EVIDENCE", title: "Separate the claim from the evidence for it", description: "State the claim precisely before evaluating what supports it.",
        concept: "An argument consists of a claim and the evidence offered to support it; strong evaluation examines whether the evidence actually supports the specific claim made.",
        teaching: "Restate the claim in one sentence, then list the evidence separately, and check whether the evidence actually supports that specific claim, not a nearby one.",
        example: "An ad claims a supplement 'supports immune health' and cites a study showing it increased a certain blood marker in a lab dish.",
        why: "A change in a lab marker does not establish that the supplement improves immune health in actual people—the evidence doesn't match the claim's scope.",
        takeaways: ["State the claim precisely before evaluating it.", "Check whether evidence matches the claim's actual scope.", "Lab or indirect evidence doesn't always support a real-world claim."],
        checkpoint: "Restate the exact claim being made, then check whether the evidence offered actually matches that scope.",
        questions: [
          { prompt: "An ad claims a supplement 'supports immune health,' citing a lab study showing it changed a blood marker in a dish. What is the gap?", options: ["A lab marker change doesn't establish real-world immune health benefits in people", "The study proves the claim completely", "Lab studies are always irrelevant to health claims", "The claim and evidence match exactly"], correct: 0, feedback: "The evidence (a lab marker change) is far narrower than the claim (supports immune health in people), leaving a real gap.", hint: "Does a change in a dish prove something about a living person's immune system?" },
          { prompt: "What is the first step in evaluating any argument?", options: ["State the specific claim being made in one clear sentence", "Assume the claim is true if it sounds scientific", "Look only at how confident the speaker sounds", "Search for evidence that supports the claim, ignoring the claim's exact wording"], correct: 0, feedback: "Precisely restating the claim prevents evaluating evidence against a vaguer or different claim than what was actually made.", hint: "What must you know exactly before you can check if evidence supports it?" },
          { prompt: "A company claims its app 'improves productivity' and cites a survey where users said they 'felt busier.' What is the mismatch?", options: ["Feeling busier is not the same as being more productive", "The survey proves the productivity claim", "Feelings and productivity are always the same thing", "No evidence is needed for this kind of claim"], correct: 0, feedback: "Subjective busyness doesn't establish an objective productivity improvement—the evidence doesn't match the claim.", hint: "Is 'feeling busier' the same thing as actually getting more done?" },
          { prompt: "Why is it important to check evidence against the exact scope of a claim?", options: ["Evidence that supports a narrower or different claim can be mistaken for supporting the broader one", "All evidence supports all related claims equally", "Claims never need evidence if they sound reasonable", "Scope doesn't affect whether evidence is relevant"], correct: 0, feedback: "Evidence for a narrow or related claim is often presented as if it supports a broader claim it doesn't actually establish.", hint: "What happens when evidence for a small claim gets used to support a much bigger one?" },
        ],
      },
      {
        id: "02", unit: "REASONING ERRORS", title: "Name the reasoning error before dismissing an argument", description: "Naming the specific flaw is stronger than a vague objection.",
        concept: "Common reasoning errors—like attacking the person instead of the argument, or presenting only two options when more exist—can make weak arguments look strong or strong arguments look weak.",
        teaching: "When an argument feels off, name the specific pattern (attacking the source, a false choice, a slippery slope) rather than just feeling unconvinced.",
        example: "A debate participant says, 'You can't trust his opinion on the budget—he's not even a numbers person,' instead of addressing the budget argument itself.",
        why: "This attacks the person rather than evaluating the argument's actual merits—the budget claim itself was never addressed.",
        takeaways: ["Attacking the person isn't the same as refuting the argument.", "Naming the specific error clarifies why an argument is weak.", "A false choice hides other real options."],
        checkpoint: "Name the specific reasoning error at work, rather than just noting that an argument feels unconvincing.",
        questions: [
          { prompt: "In a debate, someone says 'You can't trust his budget opinion—he's not a numbers person,' without addressing the budget claim itself. What error is this?", options: ["Attacking the person instead of the argument (ad hominem)", "A valid rebuttal of the budget claim", "A false choice", "A slippery slope argument"], correct: 0, feedback: "This attacks the source's credibility instead of engaging with the actual content of the budget argument.", hint: "Does this response address the budget claim, or the person making it?" },
          { prompt: "A politician says, 'Either we cut this program completely, or the budget collapses.' What reasoning error does this likely commit?", options: ["A false choice that ignores other possible options, like partial cuts", "A valid, complete list of all options", "An attack on the person", "A statement that requires no evidence"], correct: 0, feedback: "Presenting only two extreme options while ignoring middle-ground alternatives is a false choice (false dilemma).", hint: "Are 'cut completely' and 'total collapse' really the only two possibilities?" },
          { prompt: "Why is naming a specific reasoning error more useful than just saying an argument 'feels wrong'?", options: ["It identifies exactly what is flawed, making the critique clear and checkable", "Naming errors is never actually useful", "Feelings are always a more reliable guide than analysis", "It guarantees the argument is completely false"], correct: 0, feedback: "A named, specific error can be checked and explained, while a vague feeling of doubt cannot.", hint: "Which is easier to explain and verify: a specific named pattern, or a vague feeling?" },
          { prompt: "'If we allow students to retake one quiz, soon everyone will demand unlimited retakes on everything.' What reasoning error is this?", options: ["A slippery slope that assumes an extreme outcome without justifying each step", "A well-supported prediction", "An attack on the person", "A false choice"], correct: 0, feedback: "This assumes one small change inevitably leads to an extreme outcome, without evidence for each step in between.", hint: "Does allowing one retake actually guarantee the extreme outcome described?" },
        ],
      },
      {
        id: "03", unit: "SOURCE EVALUATION", title: "Weigh a source's evidence, not just its confidence", description: "Confidence is not evidence for a claim.",
        concept: "The confidence or authority with which a claim is stated is not evidence for the claim; source evaluation requires checking expertise, potential bias, and the underlying evidence.",
        teaching: "Ask what expertise the source actually has on this specific topic, what they might gain from a particular conclusion, and what evidence they cite.",
        example: "A celebrity endorses a financial investment strategy on social media with great confidence and no cited data.",
        why: "Fame and confidence are not evidence of financial expertise or the strategy's actual performance.",
        takeaways: ["Confidence is not evidence.", "Check a source's relevant expertise on the specific topic.", "Consider what a source might gain from a particular conclusion."],
        checkpoint: "Check what specific expertise and evidence back a source's claim, not just how confidently it's delivered.",
        questions: [
          { prompt: "A celebrity confidently endorses a financial strategy on social media, citing no data. What should a critical reader question?", options: ["Whether the celebrity has relevant financial expertise and what evidence supports the strategy", "Nothing, since confident delivery is convincing enough", "Whether the celebrity is likeable", "How many followers the celebrity has"], correct: 0, feedback: "Fame and confidence are not evidence of financial expertise or a strategy's real performance.", hint: "Does confidence in delivery say anything about whether a claim is true?" },
          { prompt: "A study on a new food product's health benefits is funded entirely by that product's manufacturer. What should this prompt a reader to check?", options: ["Whether the funding source could have influenced the study's design or reported conclusions", "Nothing, since funding source never affects research", "The study must be entirely fabricated", "The color scheme of the manufacturer's website"], correct: 0, feedback: "Funding sources with a stake in the outcome can introduce bias in design, analysis, or reporting, so it's worth scrutinizing.", hint: "Does the funder have an interest in a particular result?" },
          { prompt: "Which question best evaluates a source's credibility on a specific claim?", options: ["Does this source have relevant expertise and evidence for this particular topic?", "Does this source have a large following?", "Does this source speak with confidence?", "Does this source agree with what I already believe?"], correct: 0, feedback: "Relevant expertise and cited evidence are what actually establish credibility on a specific claim, not popularity or confidence.", hint: "What actually qualifies someone to make a credible claim on a topic?" },
          { prompt: "A doctor is quoted on a topic outside their specialty (e.g., a cardiologist commenting on rare genetic disorders). What should a careful reader consider?", options: ["Whether this doctor's expertise actually extends to this specific specialty", "Any doctor's opinion is equally credible on any medical topic", "Titles alone always establish relevant expertise", "This concern only matters outside of medicine"], correct: 0, feedback: "Expertise is often topic-specific; a credential in one area doesn't necessarily transfer authority to an unrelated specialty.", hint: "Does a medical degree make someone an expert on every medical topic equally?" },
        ],
      },
      {
        id: "04", unit: "CHANGING YOUR MIND", title: "Decide in advance what would change your mind", description: "A defensible position specifies what would count against it.",
        concept: "A defensible position specifies what evidence would count against it; a claim that can't be falsified by any possible evidence is difficult to evaluate rationally.",
        teaching: "Before committing to a position, state what observation or evidence would make you reconsider it—if nothing could, the position may not be a reasoned one.",
        example: "A person claims a psychic's vague prediction 'came true,' reinterpreting the vague wording to fit whatever happened afterward.",
        why: "If any outcome can be reinterpreted as confirmation, the prediction was never actually testable or falsifiable to begin with.",
        takeaways: ["A good position specifies what would count as counter-evidence.", "An unfalsifiable claim can't be rationally evaluated.", "Being willing to update your view under new evidence is a strength, not a weakness."],
        checkpoint: "Name the specific evidence that would change your mind before committing fully to a position.",
        questions: [
          { prompt: "A person claims a psychic's vague prediction 'came true,' reinterpreting the wording to match whatever happened. What is the core problem?", options: ["If any outcome can count as confirmation, the prediction was never actually testable", "This shows the prediction was accurate", "Vague predictions are always more reliable", "This is a normal and valid way to evaluate predictions"], correct: 0, feedback: "A claim that fits any possible outcome cannot be meaningfully tested or falsified.", hint: "Could any outcome at all have been made to fit this prediction?" },
          { prompt: "What makes a position more defensible and rational?", options: ["Being able to specify what evidence would change your mind about it", "Refusing to ever reconsider it, no matter the evidence", "Holding it as strongly as possible regardless of evidence", "Avoiding stating any specific claim at all"], correct: 0, feedback: "Specifying what would count as counter-evidence makes a position testable and open to honest evaluation.", hint: "What distinguishes a reasoned position from an unfalsifiable one?" },
          { prompt: "A colleague says, 'Nothing could ever convince me this policy is wrong.' What does this reveal about their position?", options: ["Their position may not be based on evidence that could be reasonably evaluated", "This shows strong, well-reasoned confidence", "This is the ideal way to hold any position", "This means the policy is definitely correct"], correct: 0, feedback: "A position immune to any possible evidence is difficult to evaluate rationally and may not be evidence-based at all.", hint: "Can a position that no evidence could ever challenge really be called reasoned?" },
          { prompt: "Why is updating a position based on new, credible evidence considered a strength in critical thinking, not a weakness?", options: ["It shows the position is grounded in evidence rather than fixed belief", "Changing your mind is always a sign of weak reasoning", "A good thinker should never update their views", "Consistency is always more important than accuracy"], correct: 0, feedback: "Being responsive to genuine evidence is what distinguishes reasoned belief from stubborn or unfounded belief.", hint: "What does refusing to ever update a view, regardless of evidence, suggest about how that view was formed?" },
        ],
      },
    ],
    "/course-library-hero.png", "An editorial composition representing critical thinking.",
    { label: "Stanford Encyclopedia of Philosophy: Critical Thinking", href: "https://plato.stanford.edu/entries/critical-thinking/" },
  ),
};
export default function Home() {
  const [screen, setScreen] = useState<
    "home" | "library" | "course" | "lesson" | "diagnostic" | "result" | "notes"
  >("home");
  const [libraryCourseId, setLibraryCourseId] = useState("data-literacy");
  const [activeCourseId, setActiveCourseId] = useState("data-literacy");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [stage, setStage] = useState<
    "learn" | "media" | "tutor" | "practice" | "complete"
  >("learn");
  const [learnStep, setLearnStep] = useState(0);
  const [recallText, setRecallText] = useState("");
  const [recallShown, setRecallShown] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [hint, setHint] = useState(false);
  const [progressByCourse, setProgressByCourse] = useState<
    Record<string, { completed: number[]; unlocked: number }>
  >({});
  const [tutorReply, setTutorReply] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorTurns, setTutorTurns] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [spokenLine, setSpokenLine] = useState(-1);
  const [narrationRate, setNarrationRate] = useState(1);
  const narratorRef = useRef<Narrator | null>(null);
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
  function toggleTheme() {
    const root = document.documentElement;
    const next: ThemeId = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("socratic-theme", next);
    } catch {
      // Private browsing can refuse storage; the toggle still works this session.
    }
  }
  const [customTitle, setCustomTitle] = useState("");
  const [customText, setCustomText] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customProgram, setCustomProgram] = useState<CourseProgram | null>(null);
  const [customMeta, setCustomMeta] = useState<(typeof courseLibrary)[number] | null>(null);
  const mergedCoursePrograms = customProgram
    ? { ...coursePrograms, custom: customProgram }
    : coursePrograms;
  const mergedCourseLibrary = customMeta ? [...courseLibrary, customMeta] : courseLibrary;
  const activeCourse = mergedCoursePrograms[activeCourseId] ?? coursePrograms["data-literacy"];
  const activeCourseMeta = mergedCourseLibrary.find((course) => course.id === activeCourseId) ?? mergedCourseLibrary[0];
  const completed = progressByCourse[activeCourseId]?.completed ?? [];
  const unlocked = progressByCourse[activeCourseId]?.unlocked ?? 0;
  const lesson = activeCourse.lessons[lessonIndex];
  const questions = lesson.questions.map((q) =>
    level === "Accelerated" && q.challenge ? { ...q, prompt: q.challenge } : q,
  );
  const question = questions[questionIndex];
  const extra = activeCourse.learningExtras[lessonIndex];
  const visual = activeCourse.lessonVisuals[lessonIndex];
  const briefingVisual = activeCourse.briefingVisuals[lessonIndex];
  const deepDive = activeCourse.lessonDeepDives[lessonIndex];
  const briefingScript = activeCourse.briefingScripts[lessonIndex];
  const tutorScenario = activeCourse.tutorScenarios[lessonIndex];
  const libraryCourse =
    mergedCourseLibrary.find((course) => course.id === libraryCourseId) ??
    mergedCourseLibrary[0];
  const mastery = Math.round((completed.length / activeCourse.lessons.length) * 100);
  // The teaching lesson is paged: one short idea per screen instead of one long
  // scroll, so the learner always sees where they are and what is next.
  const learnPages = [
    { key: "idea", label: "The core idea" },
    { key: "example", label: "Worked example" },
    ...deepDive.map((item, index) => ({
      key: `build-${index}`,
      label: item.title,
    })),
    { key: "takeaways", label: "Key takeaways" },
  ];
  const learnPage = learnPages[Math.min(learnStep, learnPages.length - 1)];
  const diagram = lessonDiagrams[activeCourseId]?.[lessonIndex] ?? fallbackDiagram;
  const depth = lessonDepth[activeCourseId]?.[lessonIndex];
  const lessonNarration = splitSentences(
    [
      `${lesson.title}.`,
      lesson.concept,
      lesson.teaching,
      depth?.detail ?? "",
      lesson.example,
      lesson.why,
    ]
      .filter(Boolean)
      .join(" "),
  );
  const briefingNarration = splitSentences(
    [`${lesson.title}.`, ...briefingScript].join(" "),
  );
  const stageOrder = ["learn", "media", "tutor", "practice", "complete"];
  const stageRank = stageOrder.indexOf(stage);
  const journeyProgress =
    stage === "complete"
      ? 100
      : stage === "practice"
        ? 70 + ((questionIndex + 1) / questions.length) * 28
        : stage === "tutor"
          ? 52 + Math.min(tutorTurns.length, 3) * 5
          : stage === "media"
            ? 46
            : ((learnStep + 1) / learnPages.length) * 44;
  function goToLearnStep(index: number) {
    stopNarration();
    setLearnStep(Math.max(0, Math.min(index, learnPages.length - 1)));
    if (stage !== "learn") setStage("learn");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }
  function advanceLearn() {
    if (learnStep < learnPages.length - 1) {
      goToLearnStep(learnStep + 1);
      return;
    }
    startMedia();
  }
  async function generateCustomLesson() {
    if (customText.trim().length < 200) {
      setCustomError("Paste at least a paragraph or two (about 200 characters) so the tutor has enough to work with.");
      return;
    }
    setCustomLoading(true);
    setCustomError(null);
    try {
      const response = await fetch("/api/source-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText, title: customTitle }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not build a lesson from that material.");
      const apiLessons: Lesson[] = payload.lessons.map((l: Lesson) => ({
        id: l.id,
        unit: l.unit,
        title: l.title,
        description: l.description,
        concept: l.concept,
        teaching: l.teaching,
        example: l.example,
        why: l.why,
        takeaways: l.takeaways,
        questions: l.questions,
      }));
      const program = makeProgram(apiLessons, "/course-library-hero.png", "An editorial composition representing your own study material.", {
        label: "Your pasted material",
        href: "#",
      });
      setCustomProgram(program);
      setCustomMeta({
        id: "custom",
        subject: payload.subject || "YOUR MATERIAL",
        title: payload.title || customTitle || "Your material",
        description: "A Socratic lesson generated from the material you pasted.",
        level: "Custom",
        format: `${apiLessons.length} lesson${apiLessons.length === 1 ? "" : "s"} · from your material`,
        visual: "/course-library-hero.png",
        visualAlt: "An editorial composition representing your own study material.",
        available: true,
        modules: apiLessons.map((l) => l.title),
        outcomes: ["Learn from your own source", "Defend your reasoning about it"],
      });
    } catch (error) {
      setCustomError(error instanceof Error ? error.message : "Could not build a lesson from that material.");
    } finally {
      setCustomLoading(false);
    }
  }
  function openCourse(courseId: string) {
    setActiveCourseId(courseId);
    setLibraryCourseId(courseId);
    setLessonIndex(0);
    setStage("learn");
    setLearnStep(0);
    setQuestionIndex(0);
    setChoice(null);
    setFeedback("idle");
    setHint(false);
    setTutorReply("");
    setTutorTurns([]);
    setScreen("course");
  }
  function openLesson(index: number) {
    if (index > unlocked) return;
    setLessonIndex(index);
    setStage("learn");
    setLearnStep(0);
    setRecallText("");
    setRecallShown(false);
    stopNarration();
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
    stopNarration();
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
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setChoice(null);
      setFeedback("idle");
      setHint(false);
      return;
    }
    const nextCompleted = completed.includes(lessonIndex)
      ? completed
      : [...completed, lessonIndex];
    setProgressByCourse({
      ...progressByCourse,
      [activeCourseId]: {
        completed: nextCompleted,
        unlocked:
          lessonIndex < activeCourse.lessons.length - 1
            ? Math.max(unlocked, lessonIndex + 1)
            : unlocked,
      },
    });
    setStage("complete");
  }
  function retry() {
    setChoice(null);
    setFeedback("idle");
    setHint(false);
  }
  function startMedia() {
    stopNarration();
    setStage("media");
    setMediaPlayed(false);
  }
  function startTutor() {
    stopNarration();
    setStage("tutor");
    setTutorReply("");
    setTutorInput("");
    setTutorTurns([]);
  }
  function getNarrator() {
    if (!narratorRef.current) {
      narratorRef.current = new Narrator({
        onSentence: (index) => setSpokenLine(index),
        onStateChange: (playing) => setIsReading(playing),
      });
    }
    return narratorRef.current;
  }
  function stopNarration() {
    narratorRef.current?.stop();
    setSpokenLine(-1);
  }
  function toggleNarration(lines: string[]) {
    const narrator = getNarrator();
    if (narrator.playing) {
      stopNarration();
      return;
    }
    narrator.setRate(narrationRate);
    void narrator.speak(lines);
  }
  function changeNarrationRate(rate: number) {
    setNarrationRate(rate);
    narratorRef.current?.setRate(rate);
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
        tutorTurns.length === 0
          ? tutorScenario.prompt
          : tutorTurns.length === 1
            ? tutorScenario.probe
            : tutorScenario.transfer;
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${tutorScenario.case}\n\n${currentPrompt}`,
          learnerAnswer: answer,
          hintLevel: Math.min(tutorTurns.length, 2),
          quizFocus: tutorScenario.quizFocus,
          dialogueStep: tutorTurns.length + 1,
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
  const lessonCount = activeCourse.lessons.length;
  const stageSteps = [
    {
      id: "media" as const,
      icon: "play" as const,
      label: "Audio + visual briefing",
    },
    {
      id: "tutor" as const,
      icon: "chat" as const,
      label: "Socratic tutor session",
    },
    {
      id: "practice" as const,
      icon: "target" as const,
      label: `Mastery check · ${questions.length} questions`,
    },
  ];
  return (
    <main className="course-app">
      <header className="app-header">
        <div className="app-header-inner">
          <button className="app-brand" onClick={() => setScreen("home")}>
            <span className="brand-mark">
              <UIIcon name="compass" />
            </span>
            <span className="brand-name">
              Socratic<em>AI</em>
            </span>
          </button>
          <nav className="app-nav">
            <button
              className={screen === "library" ? "active" : ""}
              onClick={() => setScreen("library")}
            >
              Library
            </button>
            <button
              className={
                screen === "course" || screen === "lesson" ? "active" : ""
              }
              onClick={() => setScreen("course")}
            >
              Course
            </button>
            <button
              className={
                screen === "diagnostic" || screen === "result" ? "active" : ""
              }
              onClick={beginDiagnostic}
            >
              Diagnostic
            </button>
            <button
              className={screen === "notes" ? "active" : ""}
              onClick={() => setScreen("notes")}
            >
              Notebook
            </button>
          </nav>
          <div className="app-tools">
            <div className="header-progress" title="Skills mastered">
              <span>
                <b>{completed.length}</b> / {lessonCount} skills
              </span>
              <i>
                <b style={{ width: `${mastery}%` }} />
              </i>
            </div>
            <button
              className="icon-button theme-toggle"
              onClick={toggleTheme}
              aria-label="Switch between light and dark theme"
              title="Switch theme"
            >
              <UIIcon name="moon" className="when-light" />
              <UIIcon name="sun" className="when-dark" />
            </button>
            <span className="profile-dot" aria-hidden="true">
              AK
            </span>
          </div>
        </div>
      </header>

      {screen === "home" && (
        <section className="screen home-screen">
          <div className="page">
            <div className="home-grid">
              <div className="home-copy">
                <p className="eyebrow">
                  <i /> THE SOCRATIC LEARNING STUDIO
                </p>
                <h1>
                  Learn the concept.
                  <br />
                  <em>Defend the why.</em>
                </h1>
                <p className="lead">
                  Every skill is taught one idea at a time, briefed in audio and
                  visuals, argued through with a Socratic tutor, and then
                  checked on your own.
                </p>
                <div className="button-row">
                  <button
                    className="btn btn-primary"
                    onClick={() => setScreen("library")}
                  >
                    Browse the library
                    <UIIcon name="arrow-right" />
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setScreen("course")}
                  >
                    Resume my course
                    <UIIcon name="arrow-right" />
                  </button>
                </div>
                <dl className="home-stats">
                  <div>
                    <dt>{mergedCourseLibrary.length}</dt>
                    <dd>Course pathways</dd>
                  </div>
                  <div>
                    <dt>4</dt>
                    <dd>Steps in every skill</dd>
                  </div>
                  <div>
                    <dt>100%</dt>
                    <dd>Reasoning before grading</dd>
                  </div>
                </dl>
              </div>
              <aside className="home-panel">
                <div className="home-panel-head">
                  <span className="icon-tile">
                    <CourseIcon id={activeCourseMeta.id} />
                  </span>
                  <div>
                    <small>{activeCourseMeta.subject}</small>
                    <b>{activeCourseMeta.title}</b>
                  </div>
                </div>
                <ol className="loop-list">
                  {[
                    {
                      icon: "read" as const,
                      title: "Learn",
                      copy: "Short teaching pages, one idea per screen.",
                    },
                    {
                      icon: "play" as const,
                      title: "Brief",
                      copy: "A spoken and visual recap of the same idea.",
                    },
                    {
                      icon: "chat" as const,
                      title: "Reason",
                      copy: "Defend a position before you are graded.",
                    },
                    {
                      icon: "target" as const,
                      title: "Master",
                      copy: "Retrieve the idea on your own to unlock the next skill.",
                    },
                  ].map((item) => (
                    <li key={item.title}>
                      <span className="loop-icon">
                        <UIIcon name={item.icon} />
                      </span>
                      <div>
                        <b>{item.title}</b>
                        <p>{item.copy}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setScreen("course")}
                >
                  Start learning
                  <UIIcon name="arrow-right" />
                </button>
              </aside>
            </div>
          </div>
        </section>
      )}

      {screen === "library" && (
        <section className="screen library-screen">
          <div className="page">
            <header className="section-head">
              <p className="eyebrow">
                <i /> THE SOCRATIC COURSE LIBRARY
              </p>
              <h1>
                {mergedCourseLibrary.length} pathways.
                <br />
                <em>One learning loop.</em>
              </h1>
              <p className="lead">
                College-level courses built around the same sequence: clear
                teaching, visual and audio support, required reasoning, then an
                independent mastery check.
              </p>
            </header>

            <div className="library-grid">
              {mergedCourseLibrary.map((course) => (
                <article
                  key={course.id}
                  className={`course-card ${libraryCourse.id === course.id ? "selected" : ""}`}
                >
                  <div className="course-card-top">
                    <span className="icon-tile lg">
                      <CourseIcon id={course.id} />
                    </span>
                    <span className="tag">{course.level}</span>
                  </div>
                  <small className="course-card-subject">{course.subject}</small>
                  <h3>{course.title}</h3>
                  <p className="course-card-copy">{course.description}</p>
                  <div className="course-card-meta">
                    <span>
                      <UIIcon name="read" />
                      {course.modules.length} lessons
                    </span>
                    <span>
                      <UIIcon name="target" />
                      {course.modules.length * 4} questions
                    </span>
                  </div>
                  <div className="course-card-actions">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => openCourse(course.id)}
                    >
                      Open course
                      <UIIcon name="arrow-right" />
                    </button>
                    <button
                      className="btn btn-quiet btn-block"
                      aria-pressed={libraryCourse.id === course.id}
                      onClick={() => setLibraryCourseId(course.id)}
                    >
                      {libraryCourse.id === course.id
                        ? "Outline shown below"
                        : "Preview outline"}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <section className="course-detail" aria-live="polite">
              <div className="course-detail-side">
                <span className="icon-tile xl">
                  <CourseIcon id={libraryCourse.id} />
                </span>
                <small>{libraryCourse.subject}</small>
                <h2>{libraryCourse.title}</h2>
                <p>{libraryCourse.description}</p>
                <ul className="outcome-list">
                  {libraryCourse.outcomes.map((outcome) => (
                    <li key={outcome}>
                      <UIIcon name="check" />
                      {outcome}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => openCourse(libraryCourse.id)}
                >
                  Open this course
                  <UIIcon name="arrow-right" />
                </button>
              </div>
              <div className="course-detail-main">
                <p className="kicker">COURSE OUTLINE</p>
                <ol className="module-list">
                  {libraryCourse.modules.map((module, index) => (
                    <li key={module}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <b>{module}</b>
                        <p>Teaching pages · briefing · tutor · 4 questions</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="import-panel">
              <div className="import-copy">
                <p className="kicker">BRING YOUR OWN MATERIAL</p>
                <h2>Paste a textbook chapter, or your own notes.</h2>
                <p>
                  Drop in an assigned reading, a paper abstract, or your own
                  notes. The tutor builds a lesson from exactly that material —
                  same teaching pages, tutor dialogue, and quiz as every other
                  course.
                </p>
              </div>
              <div className="import-form">
                <label>
                  <span>
                    Give it a name <em>(optional)</em>
                  </span>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(event) => setCustomTitle(event.target.value)}
                    placeholder="e.g. Chapter 4: Cellular Respiration"
                    maxLength={80}
                  />
                </label>
                <label>
                  <span>Paste your material</span>
                  <textarea
                    value={customText}
                    onChange={(event) => {
                      setCustomText(event.target.value);
                      if (customError) setCustomError(null);
                    }}
                    placeholder="Paste a textbook chapter, article, or your own notes here..."
                    rows={6}
                  />
                </label>
                <div className="import-actions">
                  <span>
                    {customText.trim().split(/\s+/).filter(Boolean).length} words
                    · 200 characters minimum
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={customLoading || customText.trim().length < 200}
                    onClick={generateCustomLesson}
                  >
                    {customLoading ? "Building your lesson…" : "Generate my lesson"}
                    <UIIcon name="arrow-right" />
                  </button>
                </div>
                {customError && <p className="form-error">{customError}</p>}
                {customProgram && customMeta && (
                  <div className="form-success">
                    <p>
                      <UIIcon name="check" />
                      &ldquo;{customMeta.title}&rdquo; is ready —{" "}
                      {customProgram.lessons.length} lesson
                      {customProgram.lessons.length === 1 ? "" : "s"} built from
                      your material.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => openCourse("custom")}
                    >
                      Start your lesson
                      <UIIcon name="arrow-right" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      )}

      {screen === "diagnostic" && (
        <section className="screen narrow-screen">
          <div className="page">
            <header className="section-head centered">
              <p className="eyebrow">
                <i /> PLACEMENT DIAGNOSTIC
              </p>
              <h1>Find your starting point.</h1>
              <p className="lead">
                Five questions. This only sets the difficulty of the wording —
                it never unlocks or completes a skill.
              </p>
            </header>
            <article className="panel-card">
              <div className="quiz-meter">
                <span>
                  QUESTION {diagIndex + 1} OF {diagnostic.length}
                </span>
                <i>
                  <b
                    style={{
                      width: `${((diagIndex + 1) / diagnostic.length) * 100}%`,
                    }}
                  />
                </i>
              </div>
              <h2>{diagnostic[diagIndex].prompt}</h2>
              <div className="choice-list">
                {diagnostic[diagIndex].options.map((option, index) => (
                  <button
                    key={option}
                    className={diagChoice === index ? "selected" : ""}
                    onClick={() => setDiagChoice(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <p>{option}</p>
                  </button>
                ))}
              </div>
              <div className="card-actions">
                <button
                  className="btn btn-primary"
                  disabled={diagChoice === null}
                  onClick={submitDiagnostic}
                >
                  {diagIndex === diagnostic.length - 1 ? "See my level" : "Continue"}
                  <UIIcon name="arrow-right" />
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {screen === "result" && (
        <section className="screen narrow-screen">
          <div className="page">
            <article className="panel-card result-card">
              <span className="icon-tile xl">
                <UIIcon name="trophy" />
              </span>
              <p className="kicker">DIAGNOSTIC COMPLETE</p>
              <h1>
                Your starting level: <em>{level}</em>
              </h1>
              <p className="lead">
                {level === "Accelerated"
                  ? "You showed strong foundations, so questions will use more demanding wording."
                  : level === "Standard"
                    ? "You have useful foundations. Lessons will build fluency with clear explanations and applied checks."
                    : "You have a clear place to begin. Each skill teaches the idea in full before asking you to use it."}
              </p>
              <p className="score">
                {diagScore} of {diagnostic.length} correct
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setScreen("course")}
              >
                Start the first skill
                <UIIcon name="arrow-right" />
              </button>
            </article>
          </div>
        </section>
      )}

      {screen === "course" && (
        <section className="screen course-screen">
          <div className="page">
            <div className="course-layout">
              <aside className="course-sidebar">
                <span className="icon-tile lg">
                  <CourseIcon id={activeCourseMeta.id} />
                </span>
                <small>{activeCourseMeta.subject}</small>
                <h2>{activeCourseMeta.title}</h2>
                <p>{activeCourseMeta.description}</p>
                <div className="meter">
                  <div>
                    <span>Module mastery</span>
                    <b>{mastery}%</b>
                  </div>
                  <i>
                    <b style={{ width: `${mastery}%` }} />
                  </i>
                  <small>
                    {completed.length} of {lessonCount} skills complete
                  </small>
                </div>
                <ul className="legend">
                  <li>
                    <span className="dot done" /> Mastered
                  </li>
                  <li>
                    <span className="dot open" /> Ready to start
                  </li>
                  <li>
                    <span className="dot locked" /> Locked until prior mastery
                  </li>
                </ul>
                <p className="status-pill">
                  <span className="dot open" />
                  Diagnostic level <b>{level}</b>
                </p>
              </aside>

              <section className="course-main">
                <header className="section-head">
                  <p className="eyebrow">
                    <i /> MODULE 01 — FOUNDATIONS
                  </p>
                  <h1>
                    Learn first.
                    <br />
                    <em>Then prove it.</em>
                  </h1>
                  <p className="lead">
                    Each skill moves through short teaching pages, a briefing,
                    a required Socratic case, and an independent mastery check.
                  </p>
                </header>
                <div className="stat-row">
                  <span>
                    <UIIcon name="read" />
                    {lessonCount} teaching lessons
                  </span>
                  <span>
                    <UIIcon name="target" />
                    {activeCourse.lessons.reduce(
                      (sum, item) => sum + item.questions.length,
                      0,
                    )}{" "}
                    mastery questions
                  </span>
                  <span>
                    <UIIcon name="compass" />
                    Adaptive level: {level}
                  </span>
                </div>
                <ol className="skill-list">
                  {activeCourse.lessons.map((item, index) => {
                    const isDone = completed.includes(index);
                    const locked = index > unlocked;
                    return (
                      <li key={item.id}>
                        <button
                          disabled={locked}
                          className={
                            isDone ? "done" : locked ? "locked" : "ready"
                          }
                          onClick={() => openLesson(index)}
                        >
                          <span className="skill-status">
                            {isDone ? (
                              <UIIcon name="check" />
                            ) : locked ? (
                              <UIIcon name="lock" />
                            ) : (
                              String(index + 1).padStart(2, "0")
                            )}
                          </span>
                          <span className="skill-copy">
                            <small>{item.unit}</small>
                            <b>{item.title}</b>
                            <p>{item.description}</p>
                          </span>
                          <span className="skill-action">
                            {isDone ? "Review" : locked ? "Locked" : "Start"}
                            <UIIcon name="arrow-right" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </div>
          </div>
        </section>
      )}

      {screen === "lesson" && (
        <section
          className={`lesson-screen ${railOpen ? "rail-open" : "rail-closed"}`}
        >
          <aside className="lesson-rail">
            <button className="rail-back" onClick={() => setScreen("course")}>
              <UIIcon name="chevron-left" />
              Back to course
            </button>
            <div className="rail-course">
              <span className="icon-tile">
                <CourseIcon id={activeCourseMeta.id} />
              </span>
              <div>
                <small>COURSE</small>
                <b>{activeCourseMeta.title}</b>
              </div>
            </div>
            <div className="rail-lesson">
              <button
                aria-label="Previous lesson"
                disabled={lessonIndex === 0}
                onClick={() => openLesson(lessonIndex - 1)}
              >
                <UIIcon name="chevron-left" />
              </button>
              <div>
                <small>
                  LESSON {lessonIndex + 1} OF {lessonCount}
                </small>
                <b>{lesson.title}</b>
              </div>
              <button
                aria-label="Next lesson"
                disabled={
                  lessonIndex >= lessonCount - 1 || lessonIndex + 1 > unlocked
                }
                onClick={() => openLesson(lessonIndex + 1)}
              >
                <UIIcon name="chevron-right" />
              </button>
            </div>
            <nav className="rail-steps" aria-label="Lesson steps">
              <p className="rail-group">Teaching lesson</p>
              {learnPages.map((page, index) => (
                <button
                  key={page.key}
                  className={
                    stage === "learn" && index === learnStep
                      ? "active"
                      : stage !== "learn" || index < learnStep
                        ? "done"
                        : ""
                  }
                  onClick={() => goToLearnStep(index)}
                >
                  <span className="rail-step-icon">
                    {stage !== "learn" || index < learnStep ? (
                      <UIIcon name="check" />
                    ) : (
                      <UIIcon name="read" />
                    )}
                  </span>
                  <span className="rail-step-label">{page.label}</span>
                </button>
              ))}
              <p className="rail-group">Then prove it</p>
              {stageSteps.map((step) => {
                const rank = stageOrder.indexOf(step.id);
                const reached = stageRank >= rank;
                return (
                  <button
                    key={step.id}
                    disabled={!reached}
                    className={
                      stage === step.id
                        ? "active"
                        : stageRank > rank
                          ? "done"
                          : ""
                    }
                    onClick={() => {
                      if (step.id === "media") startMedia();
                      else if (step.id === "tutor") startTutor();
                      else startPractice();
                    }}
                  >
                    <span className="rail-step-icon">
                      {stageRank > rank ? (
                        <UIIcon name="check" />
                      ) : reached ? (
                        <UIIcon name={step.icon} />
                      ) : (
                        <UIIcon name="lock" />
                      )}
                    </span>
                    <span className="rail-step-label">{step.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="rail-meter">
              <div>
                <span>Lesson progress</span>
                <b>{Math.round(journeyProgress)}%</b>
              </div>
              <i>
                <b style={{ width: `${journeyProgress}%` }} />
              </i>
            </div>
          </aside>

          <button
            className="rail-toggle"
            aria-label={railOpen ? "Hide lesson steps" : "Show lesson steps"}
            onClick={() => setRailOpen(!railOpen)}
          >
            <UIIcon name={railOpen ? "close" : "menu"} />
            <span>{railOpen ? "Hide steps" : "Lesson steps"}</span>
          </button>

          <div className="lesson-main">
            {stage === "learn" && (
              <article className="lesson-card" key={learnPage.key}>
                <div className="lesson-card-head">
                  <span className="pill">
                    Teaching · step {learnStep + 1} of {learnPages.length}
                  </span>
                  <span className="lesson-card-unit">{lesson.unit}</span>
                </div>

                {learnPage.key === "idea" && (
                  <>
                    <h1>{lesson.title}</h1>
                    <p className="lead">{lesson.concept}</p>
                    <NarrationPlayer
                      label="Lesson narration"
                      lines={lessonNarration}
                      playing={isReading}
                      activeIndex={spokenLine}
                      rate={narrationRate}
                      onToggle={() => toggleNarration(lessonNarration)}
                      onRate={changeNarrationRate}
                    />
                    <LessonDiagram spec={diagram} />
                    <p className="body">{lesson.teaching}</p>
                    {depth && (
                      <section className="depth-block">
                        <span className="panel-label">
                          <UIIcon name="compass" />
                          How this actually works
                        </span>
                        <p className="body">{depth.detail}</p>
                      </section>
                    )}
                    <p className="figure-note">{visual.caption}</p>
                  </>
                )}

                {learnPage.key === "example" && (
                  <>
                    <h1>See it in context</h1>
                    <p className="lead">
                      One concrete case, then the reason it changes what you
                      report.
                    </p>
                    <div className="callout">
                      <span className="callout-label">
                        <UIIcon name="spark" />
                        Worked example
                      </span>
                      <p>{lesson.example}</p>
                    </div>
                    <LessonDiagram spec={diagram} compact />
                    <h2>Why it matters</h2>
                    <p className="body">{lesson.why}</p>
                    {depth && (
                      <section className="pitfall">
                        <span className="callout-label">
                          <UIIcon name="close" />
                          The mistake people actually make
                        </span>
                        <p>{depth.pitfall}</p>
                      </section>
                    )}
                  </>
                )}

                {learnPage.key.startsWith("build-") &&
                  (() => {
                    const buildIndex = Number(learnPage.key.split("-")[1]);
                    const item = deepDive[buildIndex];
                    return (
                      <>
                        <p className="kicker">
                          Build the idea · {buildIndex + 1} of {deepDive.length}
                        </p>
                        <h1>{item.title}</h1>
                        <p className="body">{item.copy}</p>
                        <LessonDiagram spec={diagram} focus={buildIndex} />
                        <div className="callout">
                          <span className="callout-label">
                            <UIIcon name="spark" />
                            Example
                          </span>
                          <p>{item.example}</p>
                        </div>
                      </>
                    );
                  })()}

                {learnPage.key === "takeaways" && (
                  <>
                    <h1>Keep these in mind</h1>
                    <ul className="takeaway-list">
                      {lesson.takeaways.map((takeaway, index) => (
                        <li key={`${index}-${takeaway}`}>
                          <UIIcon name="check" />
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                    <section className="recall">
                      <span className="panel-label">
                        <UIIcon name="note" />
                        Say it in your own words
                      </span>
                      <p className="recall-prompt">
                        Before the briefing, write one sentence explaining
                        &ldquo;{lesson.title}&rdquo; as you would to a colleague.
                      </p>
                      <textarea
                        aria-label="Explain this idea in your own words"
                        value={recallText}
                        onChange={(event) => setRecallText(event.target.value)}
                        placeholder="In my own words..."
                      />
                      <div className="recall-actions">
                        <button
                          className="btn btn-quiet"
                          disabled={!recallText.trim()}
                          onClick={() => setRecallShown(true)}
                        >
                          Compare with a model answer
                        </button>
                        {recallShown && (
                          <span className="recall-hint">
                            Yours is not graded — the point is noticing the gap.
                          </span>
                        )}
                      </div>
                      {recallShown && (
                        <div className="callout">
                          <span className="callout-label">
                            <UIIcon name="check" />
                            One good answer
                          </span>
                          <p>{lesson.checkpoint ?? lesson.concept}</p>
                        </div>
                      )}
                    </section>
                    <div className="split-panels">
                      <div className="panel">
                        <span className="panel-label">Use this in practice</span>
                        <ol>
                          {extra.steps.map((step, index) => (
                            <li key={`${index}-${step}`}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="panel">
                        <span className="panel-label">Go deeper</span>
                        {extra.sources.map((source) => (
                          <a
                            key={source.href}
                            href={source.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {source.label}
                            <UIIcon name="external" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <footer className="lesson-nav">
                  <button
                    className="btn btn-ghost"
                    disabled={learnStep === 0}
                    onClick={() => goToLearnStep(learnStep - 1)}
                  >
                    <UIIcon name="arrow-left" />
                    Back
                  </button>
                  <span className="lesson-dots" aria-hidden="true">
                    {learnPages.map((page, index) => (
                      <i key={page.key} className={index === learnStep ? "on" : ""} />
                    ))}
                  </span>
                  <button className="btn btn-primary" onClick={advanceLearn}>
                    {learnStep === learnPages.length - 1
                      ? "Start the briefing"
                      : "Continue"}
                    <UIIcon name="arrow-right" />
                  </button>
                </footer>
              </article>
            )}

            {stage === "media" && (
              <article className="lesson-card">
                <div className="lesson-card-head">
                  <span className="pill">Audio + visual briefing</span>
                  <span className="lesson-card-unit">Ungraded</span>
                </div>
                <h1>See the pattern. Hear the reasoning.</h1>
                <p className="lead">
                  A short recap that connects the written idea, the visual, and
                  the example before you enter the Socratic case.
                </p>
                <NarrationPlayer
                  label="Spoken briefing"
                  lines={briefingNarration}
                  playing={isReading}
                  activeIndex={spokenLine}
                  rate={narrationRate}
                  onToggle={() => {
                    toggleNarration(briefingNarration);
                    setMediaPlayed(true);
                  }}
                  onRate={changeNarrationRate}
                />
                <LessonDiagram spec={diagram} />
                <p className="figure-note">{briefingVisual.caption}</p>
                {lessonIndex === 0 && (
                  <a
                    className="inline-link"
                    href="https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/more-mean-median/v/impact-on-median-and-mean-when-increasing-highest-value"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch the optional companion video
                    <UIIcon name="external" />
                  </a>
                )}
                <footer className="lesson-nav">
                  <button
                    className="btn btn-ghost"
                    onClick={() => goToLearnStep(learnPages.length - 1)}
                  >
                    <UIIcon name="arrow-left" />
                    Back
                  </button>
                  <span className="nav-note">
                    {mediaPlayed
                      ? "Briefing played"
                      : "Play the briefing to continue"}
                  </span>
                  <button
                    className="btn btn-primary"
                    disabled={!mediaPlayed}
                    onClick={startTutor}
                  >
                    Continue to the tutor
                    <UIIcon name="arrow-right" />
                  </button>
                </footer>
              </article>
            )}

            {stage === "tutor" && (
              <article className="lesson-card">
                <div className="lesson-card-head">
                  <span className="pill">
                    Socratic tutor · step {Math.min(tutorTurns.length + 1, 3)} of 3
                  </span>
                  <span className="lesson-card-unit">Ungraded</span>
                </div>
                <h1>Commit, then test your thinking.</h1>
                <p className="lead">
                  First make a claim, then examine the evidence, then transfer
                  the idea to a new case.
                </p>
                <div className="callout">
                  <span className="callout-label">
                    <UIIcon name="spark" />
                    The case
                  </span>
                  <p>{tutorScenario.case}</p>
                </div>
                {tutorTurns.length < 3 && (
                  <div className="tutor-turn">
                    <p className="tutor-prompt">
                      {tutorTurns.length === 0
                        ? tutorScenario.prompt
                        : tutorTurns.length === 1
                          ? tutorScenario.probe
                          : tutorScenario.transfer}
                    </p>
                    <textarea
                      aria-label="Your tutor response"
                      value={tutorInput}
                      onChange={(event) => setTutorInput(event.target.value)}
                      placeholder="State your position and the evidence behind it..."
                    />
                    <button
                      className="btn btn-primary"
                      disabled={!tutorInput.trim() || tutorLoading}
                      onClick={submitTutorTurn}
                    >
                      {tutorLoading
                        ? "Tutor is reading your reasoning…"
                        : tutorTurns.length === 0
                          ? "Submit my position"
                          : tutorTurns.length === 1
                            ? "Examine the evidence"
                            : "Apply the idea"}
                      <UIIcon name="arrow-right" />
                    </button>
                  </div>
                )}
                {tutorReply && (
                  <div className="tutor-reply">
                    <span className="callout-label">
                      <UIIcon name="chat" />
                      Socratic tutor
                    </span>
                    <p>{tutorReply}</p>
                  </div>
                )}
                {tutorTurns.length >= 3 && (
                  <footer className="lesson-nav">
                    <span className="nav-note">Reasoning complete</span>
                    <button className="btn btn-primary" onClick={startPractice}>
                      Begin the mastery check
                      <UIIcon name="arrow-right" />
                    </button>
                  </footer>
                )}
              </article>
            )}

            {stage === "practice" && (
              <article className="lesson-card">
                <div className="lesson-card-head">
                  <span className="pill">
                    Mastery check · question {questionIndex + 1} of{" "}
                    {questions.length}
                  </span>
                  <span className="lesson-card-unit">Graded</span>
                </div>
                <div className="quiz-meter">
                  <span>Independent retrieval</span>
                  <i>
                    <b
                      style={{
                        width: `${((questionIndex + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </i>
                </div>
                <h2 className="question-prompt">{question.prompt}</h2>
                <div className="choice-list">
                  {question.options.map((option, index) => (
                    <button
                      key={option}
                      disabled={feedback === "correct"}
                      className={`${choice === index ? "selected" : ""} ${
                        feedback === "correct" && index === question.correct
                          ? "correct"
                          : ""
                      } ${
                        feedback === "incorrect" && choice === index
                          ? "incorrect"
                          : ""
                      }`}
                      onClick={() => feedback === "idle" && setChoice(index)}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      <p>{option}</p>
                    </button>
                  ))}
                </div>
                {hint && feedback !== "correct" && (
                  <div className="callout">
                    <span className="callout-label">
                      <UIIcon name="spark" />
                      A nudge, not the answer
                    </span>
                    <p>{question.hint}</p>
                  </div>
                )}
                {feedback !== "idle" && (
                  <div className={`verdict ${feedback}`}>
                    <b>
                      <UIIcon name={feedback === "correct" ? "check" : "close"} />
                      {feedback === "correct"
                        ? `Correct — ${String.fromCharCode(65 + question.correct)}`
                        : "Not quite."}
                    </b>
                    <p>
                      {feedback === "correct"
                        ? detailedExplanation()
                        : "Use the nudge, revisit the teaching pages if you need them, and choose again. Mastery requires the correct answer."}
                    </p>
                  </div>
                )}
                <footer className="lesson-nav">
                  <button className="btn btn-quiet" onClick={() => setHint(true)}>
                    Need a nudge?
                  </button>
                  {feedback === "incorrect" && (
                    <button className="btn btn-ghost" onClick={retry}>
                      Try another answer
                    </button>
                  )}
                  <button
                    className="btn btn-primary"
                    disabled={choice === null}
                    onClick={feedback === "correct" ? nextQuestion : checkAnswer}
                  >
                    {feedback === "correct"
                      ? questionIndex === questions.length - 1
                        ? "Complete this skill"
                        : "Next question"
                      : "Check answer"}
                    <UIIcon name="arrow-right" />
                  </button>
                </footer>
              </article>
            )}

            {stage === "complete" && (
              <article className="lesson-card complete-card">
                <span className="icon-tile xl">
                  <UIIcon name="trophy" />
                </span>
                <p className="kicker">Mastery earned</p>
                <h1>You made the reasoning yours.</h1>
                <p className="lead">
                  You answered every question correctly.{" "}
                  {lessonIndex < lessonCount - 1
                    ? "The next skill is now unlocked."
                    : "That completes this course module."}
                </p>
                <div className="button-row">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      lessonIndex < lessonCount - 1
                        ? openLesson(lessonIndex + 1)
                        : setScreen("course")
                    }
                  >
                    {lessonIndex < lessonCount - 1
                      ? "Open the next skill"
                      : "Back to the course"}
                    <UIIcon name="arrow-right" />
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setScreen("course")}
                  >
                    See all skills
                  </button>
                </div>
              </article>
            )}
          </div>
        </section>
      )}

      {screen === "notes" && (
        <section className="screen narrow-screen">
          <div className="page">
            <header className="section-head">
              <p className="eyebrow">
                <i /> YOUR WORKING NOTEBOOK
              </p>
              <h1>Make the ideas your own.</h1>
              <p className="lead">
                Capture questions, examples, and patterns you want to remember.
              </p>
            </header>
            <article className="panel-card">
              <textarea
                aria-label="Notebook"
                className="notes-textarea"
                placeholder="Write the thought you want to keep..."
              />
              <p className="figure-note">
                Tip — write one thing you noticed before one thing you learned.
              </p>
            </article>
            {savedNotes.length > 0 && (
              <section className="saved-notes">
                <p className="kicker">Captured from your lessons</p>
                <ul>
                  {savedNotes.map((note, index) => (
                    <li key={`${note}-${index}`}>{note}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>
      )}

      {screen !== "notes" && (
        <div className="notebook-dock">
          {notebookOpen && (
            <div className="notebook-popover">
              <div className="notebook-popover-head">
                <p>Quick capture</p>
                <button
                  aria-label="Close quick capture"
                  onClick={() => setNotebookOpen(false)}
                >
                  <UIIcon name="close" />
                </button>
              </div>
              <textarea
                value={quickNote}
                onChange={(event) => setQuickNote(event.target.value)}
                placeholder="What do you want to remember?"
              />
              <button
                className="btn btn-primary btn-block"
                disabled={!quickNote.trim()}
                onClick={saveQuickNote}
              >
                Save to notebook
                <UIIcon name="arrow-right" />
              </button>
            </div>
          )}
          <button
            className="notebook-fab"
            aria-expanded={notebookOpen}
            onClick={() => setNotebookOpen(!notebookOpen)}
          >
            <UIIcon name={notebookOpen ? "close" : "note"} />
            {notebookOpen ? "Close" : "Quick note"}
          </button>
        </div>
      )}
    </main>
  );
}
