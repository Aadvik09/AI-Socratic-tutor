/* The contract between the course-building agent and the app.
   The agent returns JSON matching this shape; the app renders it. Keeping one
   normalized `visual` shape (rather than a union per diagram kind) is what makes
   structured output reliable — each renderer interprets the same fields. */

export const LEARNING_MODES = [
  {
    id: "socratic",
    name: "Pure Socratic",
    blurb: "Almost no exposition. The agent asks from the first screen and you build the explanation yourself.",
    instruction:
      "Dialogue-first. Keep every mechanism summary to one or two sentences of orientation only — never the full explanation. The Socratic ladder carries the teaching: the learner must derive each causal step by answering questions. Opening questions must be answerable from ordinary reasoning, not recall.",
  },
  {
    id: "mechanism",
    name: "Mechanism first",
    blurb: "Understand why it happens — causal chains and diagrams — then defend it under questioning.",
    instruction:
      "Lead with causation. Every lesson's mechanism must be a genuine causal chain where each step states what causes what and why, not a list of facts. Visuals should be causal-chain or feedback-loop wherever the content allows. The dialogue then tests whether the learner can run the chain forwards and backwards.",
  },
  {
    id: "case",
    name: "Case-led",
    blurb: "Start from a presentation and reason backwards to the mechanism, the way a clinician actually meets it.",
    instruction:
      "Open each lesson from a concrete presentation — findings, values, a person in front of you — and work backwards to the mechanism. Signs and actions carry more weight than abstract definitions. Visuals should favour lab-panel, compare and decision-tree.",
  },
  {
    id: "visual",
    name: "Visual-led",
    blurb: "Diagrams do the explaining. Prose is captions, not paragraphs.",
    instruction:
      "The visual is the primary teaching object in every lesson. Prose must be short: mechanism summary under 40 words and steps under 20 words each. Choose the visual kind that genuinely fits the idea and make its items carry the detail.",
  },
  {
    id: "rapid",
    name: "High-yield",
    blurb: "Compressed. Discriminating features, classic traps, and what to do about them.",
    instruction:
      "Compress hard. Prioritise discriminating features between confusable entities, the classic traps, and decision rules. Favour compare and decision-tree visuals. Misconceptions matter more than background.",
  },
] as const;

export type LearningModeId = (typeof LEARNING_MODES)[number]["id"];

export const VISUAL_KINDS = [
  "causal-chain",
  "feedback-loop",
  "lab-panel",
  "compare",
  "decision-tree",
  "timeline",
  "spectrum",
] as const;
export type VisualKind = (typeof VISUAL_KINDS)[number];

export type VisualItem = {
  /** Row/step/node name. */
  label: string;
  /** The explanatory half: what this step produces, why the value matters. */
  detail: string;
  /** Kind-specific payload — a measured value, a branch answer, a position. */
  value: string;
  /** Kind-specific grouping — column name, branch path, or status band. */
  group: string;
};

export type VisualSpec = {
  kind: VisualKind;
  title: string;
  caption: string;
  items: VisualItem[];
};

export type MechanismStep = {
  cause: string;
  effect: string;
  because: string;
};

export type SocraticProbe = {
  /** A position the learner may take, in their own likely words. */
  ifLearnerSays: string;
  /** The question that tests that position without correcting it. */
  ask: string;
};

export type SocraticLadder = {
  /** First question. Must not contain the explanation. */
  opening: string;
  probes: SocraticProbe[];
  /** Progressively narrower questions when the learner is stuck. */
  narrowing: string[];
  /** What the learner should be able to say unaided by the end. */
  target: string;
};

export type BuiltLesson = {
  id: string;
  title: string;
  drivingQuestion: string;
  mechanismSummary: string;
  mechanismSteps: MechanismStep[];
  visual: VisualSpec;
  socratic: SocraticLadder;
  misconceptions: { claim: string; whyWrong: string; probe: string }[];
  signs: { finding: string; because: string }[];
  actions: { situation: string; nextStep: string; rationale: string }[];
  check: {
    prompt: string;
    options: string[];
    correct: number;
    feedback: string;
  };
};

export type BuiltModule = {
  id: string;
  title: string;
  drivingQuestion: string;
  lessons: BuiltLesson[];
};

export type BuiltCourse = {
  id: string;
  topic: string;
  mode: LearningModeId;
  title: string;
  subject: string;
  summary: string;
  audience: string;
  prerequisites: string[];
  modules: BuiltModule[];
  glossary: { term: string; definition: string }[];
  createdAt: number;
  /** Populated in the sourced build; empty for a zero-shot build. */
  sources: { label: string; href: string }[];
  /** How this course was produced, shown in the UI so provenance is never implied. */
  provenance: "zero-shot" | "sourced" | "fixture";
};

/* ---------- JSON schemas for structured output ---------- */

const visualSchema = {
  type: "object",
  additionalProperties: false,
  required: ["kind", "title", "caption", "items"],
  properties: {
    kind: { type: "string", enum: [...VISUAL_KINDS] },
    title: { type: "string" },
    caption: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "detail", "value", "group"],
        properties: {
          label: { type: "string" },
          detail: { type: "string" },
          value: { type: "string" },
          group: { type: "string" },
        },
      },
    },
  },
} as const;

export const planSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "subject",
    "summary",
    "audience",
    "prerequisites",
    "glossary",
    "modules",
  ],
  properties: {
    title: { type: "string" },
    subject: { type: "string" },
    summary: { type: "string" },
    audience: { type: "string" },
    prerequisites: { type: "array", items: { type: "string" } },
    glossary: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["term", "definition"],
        properties: { term: { type: "string" }, definition: { type: "string" } },
      },
    },
    modules: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "drivingQuestion", "lessonTitles"],
        properties: {
          title: { type: "string" },
          drivingQuestion: { type: "string" },
          lessonTitles: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
} as const;

export const moduleSchema = {
  type: "object",
  additionalProperties: false,
  required: ["lessons"],
  properties: {
    lessons: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "drivingQuestion",
          "mechanismSummary",
          "mechanismSteps",
          "visual",
          "socratic",
          "misconceptions",
          "signs",
          "actions",
          "check",
        ],
        properties: {
          title: { type: "string" },
          drivingQuestion: { type: "string" },
          mechanismSummary: { type: "string" },
          mechanismSteps: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["cause", "effect", "because"],
              properties: {
                cause: { type: "string" },
                effect: { type: "string" },
                because: { type: "string" },
              },
            },
          },
          visual: visualSchema,
          socratic: {
            type: "object",
            additionalProperties: false,
            required: ["opening", "probes", "narrowing", "target"],
            properties: {
              opening: { type: "string" },
              probes: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["ifLearnerSays", "ask"],
                  properties: {
                    ifLearnerSays: { type: "string" },
                    ask: { type: "string" },
                  },
                },
              },
              narrowing: { type: "array", items: { type: "string" } },
              target: { type: "string" },
            },
          },
          misconceptions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["claim", "whyWrong", "probe"],
              properties: {
                claim: { type: "string" },
                whyWrong: { type: "string" },
                probe: { type: "string" },
              },
            },
          },
          signs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["finding", "because"],
              properties: {
                finding: { type: "string" },
                because: { type: "string" },
              },
            },
          },
          actions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["situation", "nextStep", "rationale"],
              properties: {
                situation: { type: "string" },
                nextStep: { type: "string" },
                rationale: { type: "string" },
              },
            },
          },
          check: {
            type: "object",
            additionalProperties: false,
            required: ["prompt", "options", "correct", "feedback"],
            properties: {
              prompt: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correct: { type: "integer" },
              feedback: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

/* ---------- Validation ---------- */

export type ValidationIssue = { path: string; problem: string };

const isStr = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

function checkVisual(v: unknown, path: string, out: ValidationIssue[]) {
  const spec = v as Partial<VisualSpec>;
  if (!spec || typeof spec !== "object") {
    out.push({ path, problem: "missing visual" });
    return;
  }
  if (!VISUAL_KINDS.includes(spec.kind as VisualKind)) {
    out.push({ path: `${path}.kind`, problem: `unknown visual kind "${spec.kind}"` });
  }
  if (!isStr(spec.caption)) out.push({ path: `${path}.caption`, problem: "empty caption" });
  const items = Array.isArray(spec.items) ? spec.items : [];
  if (items.length < 2) {
    out.push({ path: `${path}.items`, problem: "a visual needs at least 2 items" });
  }
  if (items.length > 8) {
    out.push({ path: `${path}.items`, problem: "more than 8 items will not render legibly" });
  }
  items.forEach((item, i) => {
    if (!isStr(item?.label)) out.push({ path: `${path}.items[${i}].label`, problem: "empty label" });
  });
}

/** Structural validation with human-readable issues, used to drive one repair pass. */
export function validateLessons(lessons: unknown): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  if (!Array.isArray(lessons) || lessons.length === 0) {
    return [{ path: "lessons", problem: "no lessons returned" }];
  }
  lessons.forEach((raw, index) => {
    const lesson = raw as Partial<BuiltLesson>;
    const at = `lessons[${index}]`;
    if (!isStr(lesson.title)) out.push({ path: `${at}.title`, problem: "empty title" });
    if (!isStr(lesson.drivingQuestion)) {
      out.push({ path: `${at}.drivingQuestion`, problem: "empty driving question" });
    } else if (!lesson.drivingQuestion.includes("?")) {
      out.push({ path: `${at}.drivingQuestion`, problem: "driving question is not a question" });
    }
    const steps = lesson.mechanismSteps ?? [];
    if (steps.length < 2) {
      out.push({ path: `${at}.mechanismSteps`, problem: "a mechanism needs at least 2 causal steps" });
    }
    steps.forEach((step, i) => {
      if (!isStr(step?.because)) {
        out.push({ path: `${at}.mechanismSteps[${i}].because`, problem: "step does not say why" });
      }
    });
    checkVisual(lesson.visual, `${at}.visual`, out);

    const soc = lesson.socratic;
    if (!isStr(soc?.opening)) {
      out.push({ path: `${at}.socratic.opening`, problem: "missing opening question" });
    } else if (!soc!.opening.includes("?")) {
      out.push({ path: `${at}.socratic.opening`, problem: "opening must be a question" });
    }
    if ((soc?.probes ?? []).length < 2) {
      out.push({ path: `${at}.socratic.probes`, problem: "need at least 2 adaptive probes" });
    }
    (soc?.probes ?? []).forEach((probe, i) => {
      if (!probe?.ask?.includes("?")) {
        out.push({ path: `${at}.socratic.probes[${i}].ask`, problem: "probe must be a question" });
      }
    });
    if (!isStr(soc?.target)) {
      out.push({ path: `${at}.socratic.target`, problem: "missing dialogue target" });
    }
    if ((lesson.misconceptions ?? []).length < 1) {
      out.push({ path: `${at}.misconceptions`, problem: "need at least 1 misconception" });
    }
    const check = lesson.check;
    const options = check?.options ?? [];
    if (options.length < 3) {
      out.push({ path: `${at}.check.options`, problem: "need at least 3 options" });
    }
    if (
      typeof check?.correct !== "number" ||
      check.correct < 0 ||
      check.correct >= options.length
    ) {
      out.push({ path: `${at}.check.correct`, problem: "correct index out of range" });
    }
  });
  return out;
}

export function slugify(topic: string): string {
  return (
    topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "course"
  );
}
