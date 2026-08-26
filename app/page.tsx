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
        copy: "Name the assumption you are making, then identify the evidence that would change your mind.",
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
        id: "01", unit: "PROGRAM STATE", title: "Trace values before trusting output", description: "Follow assignments and expressions one step at a time.",
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
        id: "02", unit: "CONTROL FLOW", title: "Choose a path with evidence", description: "Use conditions and loops to make a program's choices explicit.",
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
        id: "03", unit: "FUNCTIONS + TESTS", title: "Make a claim small enough to test", description: "Break a problem into focused functions and examples.",
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
        id: "04", unit: "DATA + DEBUGGING", title: "Debug the assumption, not just the line", description: "Use evidence to locate a mismatch between expectation and program state.",
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
        id: "01", unit: "RISK MODELING", title: "Map what needs protection", description: "Connect assets, threats, and likely harm before selecting a control.",
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
        id: "02", unit: "SOCIAL ENGINEERING", title: "Read a message like evidence", description: "Evaluate phishing cues without trusting one superficial signal.",
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
        id: "03", unit: "ACCESS CONTROL", title: "Make access proportionate", description: "Use authentication and authorization for a defined purpose.",
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
        id: "04", unit: "INCIDENT RESPONSE", title: "Contain, preserve, and learn", description: "Turn an alert into a proportionate evidence-guided response.",
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
        id: "01", unit: "ALGORITHMIC THINKING", title: "Count the work, not the vibe", description: "Describe an algorithm as explicit steps before comparing it.",
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
        id: "02", unit: "GROWTH RATES", title: "See what scales", description: "Use Big-O to compare how work grows with input size.",
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
        id: "03", unit: "SEARCH + SORT", title: "Use structure to reduce work", description: "Choose a search method that matches what is already known.",
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
        id: "04", unit: "TRADEOFFS", title: "Defend the tradeoff", description: "Choose for time, memory, accuracy, and maintainability—not speed alone.",
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
        id: "01", unit: "RELATIONAL THINKING", title: "Model what the facts are about", description: "Separate entities, attributes, and relationships before writing queries.",
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
        id: "02", unit: "QUERY MEANING", title: "Ask exactly the question you mean", description: "Use selection, projection, and conditions deliberately.",
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
        id: "03", unit: "JOINS", title: "Join without changing the population", description: "Check keys and cardinality before trusting a combined table.",
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
        id: "04", unit: "AGGREGATES + AUDIT", title: "Aggregate, then audit", description: "Summarize groups while checking denominator and duplicates.",
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
        id: "01", unit: "CHART CHOICE", title: "Match the chart to the question", description: "Select a visual encoding that lets the comparison be seen.",
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
        id: "02", unit: "SCALE + BASELINE", title: "Interrogate the visual claim", description: "Recognize how axes, ranges, and design choices change perceived difference.",
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
        id: "03", unit: "UNCERTAINTY", title: "Show what the estimate cannot say", description: "Present uncertainty, sample size, and variation as part of the evidence.",
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
        id: "04", unit: "DESIGN DEFENSE", title: "Defend an honest comparison", description: "Explain a chart choice to a skeptical reader.",
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
    const narration = [lesson.title, ...briefingScript].join(". ");
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
            className={screen === "library" ? "active" : ""}
            onClick={() => setScreen("library")}
          >
            Library
          </button>
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
            <b>{completed.length}</b> / {activeCourse.lessons.length} skills
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
              <button
                className="text-button"
                onClick={() => setScreen("library")}
              >
                Browse course library <span>&rarr;</span>
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

      {screen === "library" && (
        <section className="library-screen">
          <section className="library-hero">
            <div>
              <p className="eyebrow">
                <i /> THE SOCRATIC COURSE LIBRARY
              </p>
              <h1>
                Learn the concept.
                <br />
                <em>Defend the why.</em>
              </h1>
              <p>
                College-level courses built around a consistent learning loop:
                clear teaching, visual and audio support, formative Socratic
                reasoning, then an independent mastery check.
              </p>
              <div className="library-hero-meta">
                <span>{mergedCourseLibrary.length} course pathways</span>
                <span>Visual + audio learning</span>
                <span>Required reasoning before quizzes</span>
              </div>
            </div>
            <figure>
              <img
                src="/course-library-hero.png"
                alt="An editorial study composition representing computing, data, algorithms, and cybersecurity."
              />
            </figure>
          </section>

          <section className="library-import">
            <div className="library-import-copy">
              <p className="question-type">BRING YOUR OWN MATERIAL</p>
              <h2>Paste a textbook chapter, or your own notes.</h2>
              <p>
                Drop in an assigned reading, a paper abstract, or your own
                notes. The tutor builds a lesson from exactly that
                material—same teaching, tutor dialogue, and quiz flow as
                every other course.
              </p>
            </div>
            <div className="library-import-form">
              <label>
                Give it a name <span>(optional)</span>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(event) => setCustomTitle(event.target.value)}
                  placeholder="e.g. Chapter 4: Cellular Respiration"
                  maxLength={80}
                />
              </label>
              <label>
                Paste your material
                <textarea
                  value={customText}
                  onChange={(event) => {
                    setCustomText(event.target.value);
                    if (customError) setCustomError(null);
                  }}
                  placeholder="Paste a textbook chapter, article, or your own notes here..."
                  rows={7}
                />
              </label>
              <div className="library-import-actions">
                <span>
                  {
                    customText.trim().split(/\s+/).filter(Boolean).length
                  }{" "}
                  words
                </span>
                <button
                  type="button"
                  className="primary-button"
                  disabled={customLoading || customText.trim().length < 200}
                  onClick={generateCustomLesson}
                >
                  {customLoading ? "Building your lesson…" : "Generate my lesson"}{" "}
                  <span>&rarr;</span>
                </button>
              </div>
              {customError && <p className="library-import-error">{customError}</p>}
              {customProgram && customMeta && (
                <div className="library-import-ready">
                  <p>
                    ✦ &ldquo;{customMeta.title}&rdquo; is ready — {customProgram.lessons.length}{" "}
                    lesson{customProgram.lessons.length === 1 ? "" : "s"} built from your
                    material.
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => openCourse("custom")}
                  >
                    Start your lesson <span>&rarr;</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="library-body">
            <div className="library-heading">
              <div>
                <p className="question-type">EXPLORE BY DISCIPLINE</p>
                <h2>Built for deeper learning.</h2>
              </div>
              <p>
                Every pathway starts with an explanation and an example, then
                asks the learner to reason before a quiz measures mastery.
              </p>
            </div>
            <div className="library-grid">
              {mergedCourseLibrary.map((course) => (
                <article
                  key={course.id}
                  className={`library-card ${libraryCourse.id === course.id ? "selected" : ""}`}
                  onClick={() => setLibraryCourseId(course.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setLibraryCourseId(course.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="library-card-image">
                    <img src={course.visual} alt={course.visualAlt} />
                    <span>OPEN NOW</span>
                  </div>
                  <div className="library-card-copy">
                    <small>{course.subject}</small>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <footer>
                      <span>{course.level}</span>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          openCourse(course.id);
                        }}
                      >
                        Open course <span>&rarr;</span>
                      </button>
                      <b>
                        {course.available ? "Open course" : "View outline"} →
                      </b>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="library-detail" aria-live="polite">
            <div className="library-detail-visual">
              <img src={libraryCourse.visual} alt={libraryCourse.visualAlt} />
              <span>{libraryCourse.subject}</span>
            </div>
            <div className="library-detail-copy">
              <p className="question-type">COURSE BLUEPRINT</p>
              <h2>{libraryCourse.title}</h2>
              <p className="library-detail-lead">{libraryCourse.description}</p>
              <div className="library-outcomes">
                {libraryCourse.outcomes.map((outcome) => (
                  <span key={outcome}>✦ {outcome}</span>
                ))}
              </div>
              <ol>
                {libraryCourse.modules.map((module, index) => (
                  <li key={module}>
                    <span>0{index + 1}</span>
                    {module}
                  </li>
                ))}
              </ol>
              <div className="library-detail-footer">
                <span>{libraryCourse.modules.length} lessons · audio, visual, tutor, quiz</span>
                <button
                  className="primary-button"
                  onClick={() => openCourse(libraryCourse.id)}
                >
                  Open this course <span>&rarr;</span>
                </button>
              </div>
            </div>
          </section>
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
              YOUR PATH <span>01 / {activeCourse.lessons.length.toString().padStart(2, "0")}</span>
            </div>
            <h2>{activeCourseMeta.title}</h2>
            <p>{activeCourseMeta.description}</p>
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
              Each skill moves from a detailed teaching lesson and concrete
              examples, through a visual + spoken briefing and required Socratic
              case, then into an independent objective mastery check.
            </p>
            <div className="module-meta">
              <span>{activeCourse.lessons.length} teaching lessons</span>
              <span>
                {activeCourse.lessons.reduce((sum, item) => sum + item.questions.length, 0)}{" "}
                mastery questions
              </span>
              <span>Adaptive level: {level}</span>
            </div>
            <div className="skill-list">
              {activeCourse.lessons.map((item, index) => {
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
              {activeCourse.lessons.map((item, index) => (
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
                    <section
                      className="briefing-notes"
                      aria-label="Briefing notes"
                    >
                      <p className="question-type">BRIEFING NOTES</p>
                      <ol>
                        {briefingScript.map((line, index) => (
                          <li key={line}>
                            <span>0{index + 1}</span>
                            <p>{line}</p>
                          </li>
                        ))}
                      </ol>
                    </section>
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
                      Use the image and briefing notes to anchor the case. The
                      next step asks you to explain the idea in your own words
                      before the mastery check.
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
                        STEP {Math.min(tutorTurns.length + 1, 3)} OF 3
                      </span>
                    </div>
                    <h1>
                      Commit, then
                      <br />
                      <em>test your thinking.</em>
                    </h1>
                    <p className="lesson-lead">
                      This is formative and ungraded. First make a claim, then
                      examine the evidence, then transfer the idea to a new
                      case. The quiz will ask you to retrieve it independently.
                    </p>
                    <section className="tutor-case">
                      <span>CLINICAL CASE</span>
                      <p>{tutorScenario.case}</p>
                    </section>
                    <section className="tutor-quiz-bridge">
                      <span>WHAT THIS PREPARES YOU TO DO</span>
                      <p>{tutorScenario.quizFocus}</p>
                    </section>
                    {tutorTurns.length < 3 && (
                      <>
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
                              : tutorTurns.length === 1
                                ? "Examine the evidence"
                                : "Apply the idea"}{" "}
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
                    {tutorTurns.length >= 3 && (
                      <section className="tutor-complete">
                        <b>Pre-quiz reasoning complete</b>
                        <p>
                          You have made a claim, examined evidence, and applied
                          the idea in a new setting. The mastery check now asks
                          you to retrieve that reasoning on your own.
                        </p>
                        <button
                          className="primary-button"
                          onClick={startPractice}
                        >
                          Begin independent mastery check <span>&rarr;</span>
                        </button>
                      </section>
                    )}
                  </article>
                )}
                {stage === "practice" && (
                  <article className="question-card">
                    <p className="question-type">APPLY THE IDEA</p>
                    <h1>Check your reasoning.</h1>
                    <section className="quiz-brief">
                      <span>INDEPENDENT MASTERY CHECK</span>
                      <p>
                        The tutor prepared your reasoning. Now choose the best
                        answer independently, check your explanation, and use a
                        nudge only if you need one.
                      </p>
                    </section>
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
