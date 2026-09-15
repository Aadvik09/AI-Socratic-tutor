import {
  LEARNING_MODES,
  moduleSchema,
  planSchema,
  slugify,
  validateLessons,
  type BuiltCourse,
  type BuiltLesson,
  type BuiltModule,
  type LearningModeId,
} from "../../build-schema";

export const maxDuration = 300;

type BuildRequest = {
  topic?: string;
  mode?: LearningModeId;
  depth?: "orientation" | "standard" | "deep";
  audience?: string;
};

const DEPTHS = {
  orientation: { modules: 2, lessons: 2 },
  standard: { modules: 3, lessons: 3 },
  deep: { modules: 4, lessons: 3 },
} as const;

const BUILDER_ROLE = `You are the curriculum architect for a Socratic learning studio. You design courses that teach why something happens, then force the learner to defend that understanding under questioning.

Non-negotiable standards:
- Causal, not encyclopaedic. Every explanation must state a mechanism: what causes what, and why that follows. Never list facts that a learner could not reconstruct from a cause.
- Questions must be genuinely Socratic: they lead the learner to derive the answer, never announce it. A question that contains its own answer is a failure.
- Write for an intelligent adult who does not yet know this material. No filler, no hedging, no meta-commentary about learning or about the course itself.
- Be accurate. Where a fact is contested or varies by population, say so inside the content rather than flattening it.
- Never invent citations, studies, guideline names, or numeric thresholds you are not confident in. Prefer describing the shape of a finding over fabricating a precise figure.`;

function modeInstruction(mode: LearningModeId): string {
  return (
    LEARNING_MODES.find((m) => m.id === mode)?.instruction ??
    LEARNING_MODES[0].instruction
  );
}

async function callModel<T>(
  apiKey: string,
  model: string,
  instructions: string,
  input: string,
  schemaName: string,
  schema: unknown,
): Promise<T> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Model request failed (${response.status}). ${detail.slice(0, 300)}`,
    );
  }
  const payload = (await response.json()) as {
    output_text?: string;
    output?: { content?: { text?: string }[] }[];
  };
  const text =
    payload.output_text ?? payload.output?.[0]?.content?.[0]?.text ?? "";
  if (!text) throw new Error("The model returned an empty response.");
  return JSON.parse(text) as T;
}

type PlanResult = {
  title: string;
  subject: string;
  summary: string;
  audience: string;
  prerequisites: string[];
  glossary: { term: string; definition: string }[];
  modules: { title: string; drivingQuestion: string; lessonTitles: string[] }[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as BuildRequest;
  const topic = body.topic?.trim();
  const mode: LearningModeId = body.mode ?? "mechanism";
  const depth = DEPTHS[body.depth ?? "standard"] ?? DEPTHS.standard;
  const audience = body.audience?.trim() || "a motivated learner new to this topic";

  if (!topic) {
    return Response.json({ error: "A topic is required." }, { status: 400 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "The course builder needs an OpenAI API key. Set OPENAI_API_KEY in the deployment environment and redeploy.",
        code: "no_api_key",
      },
      { status: 503 },
    );
  }
  const model = process.env.OPENAI_BUILD_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4.1";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      try {
        send({
          phase: "start",
          message: `Designing a course on “${topic}”`,
          detail: `Mode: ${LEARNING_MODES.find((m) => m.id === mode)?.name}. Zero-shot — no textbook, no supplied sources.`,
        });

        /* ---- 1. Plan the curriculum ---- */
        send({ phase: "plan", message: "Deciding what actually has to be understood, and in what order" });
        const plan = await callModel<PlanResult>(
          apiKey,
          model,
          `${BUILDER_ROLE}\n\nMODE: ${modeInstruction(mode)}`,
          `Design the curriculum outline for a course on: ${topic}
Audience: ${audience}
Produce exactly ${depth.modules} modules, each with exactly ${depth.lessons} lesson titles.

Sequence the modules so that each one depends only on what came before. The first module must establish the mechanism that everything later rests on — do not open with classification or terminology.
Each module's drivingQuestion is the single question that module answers, phrased as a question a learner would actually ask.
Lesson titles are claims or questions, not noun phrases: "Why iron runs out before the blood count falls" rather than "Iron metabolism".
The glossary holds only terms the course itself uses and the learner would not already know — between 4 and 8 of them.`,
          "course_plan",
          planSchema,
        );

        send({
          phase: "plan-done",
          message: `Planned ${plan.modules.length} modules`,
          detail: plan.modules
            .map((m, i) => `${i + 1}. ${m.title} — ${m.drivingQuestion}`)
            .join("\n"),
        });

        /* ---- 2. Author each module ---- */
        const modules: BuiltModule[] = [];
        for (let i = 0; i < plan.modules.length; i++) {
          const outline = plan.modules[i];
          send({
            phase: "module",
            index: i,
            total: plan.modules.length,
            message: `Writing module ${i + 1}: ${outline.title}`,
            detail: outline.lessonTitles.join(" · "),
          });

          const authorInput = `Course: ${plan.title}
Topic: ${topic}
Audience: ${audience}
Module ${i + 1} of ${plan.modules.length}: ${outline.title}
This module answers: ${outline.drivingQuestion}
Earlier modules covered: ${
            modules.length
              ? modules.map((m) => m.title).join("; ")
              : "nothing yet — this is the first module"
          }

Write these lessons, in order: ${outline.lessonTitles.map((t, n) => `${n + 1}) ${t}`).join("  ")}

For each lesson:
- mechanismSummary: the causal answer to the driving question, in 2-4 sentences. State the cause, not the category.
- mechanismSteps: 3-5 links in the causal chain. Each has cause, effect, and "because" — the reason that effect follows from that cause. A step whose "because" is a restatement of the effect is wrong.
- visual: choose the kind that genuinely fits this idea. causal-chain for a mechanism; feedback-loop for regulation; lab-panel for measured findings (value = the measurement, group = reference range, detail = what it tells you); compare for distinguishing confusable entities (label = the feature, group = the entity being compared, value = that entity's value for the feature); decision-tree for a diagnostic path (group = the branch taken to get here); timeline for progression over time; spectrum for severity or position on a continuum (value = a number 0-100). Between 3 and 6 items.
- socratic.opening: a question that starts the learner reasoning without telling them anything. It must be answerable from what they already know or can infer, and must not contain the mechanism.
- socratic.probes: 3 likely learner positions — including at least one confidently wrong one — each with the question you would ask in response. Never correct; ask the question that makes the learner test their own claim.
- socratic.narrowing: 3 progressively more specific questions for a learner who is stuck. Even the last one must remain a question.
- socratic.target: what the learner should be able to say unaided at the end.
- misconceptions: 2 real ones, with why each is wrong and the question that surfaces it.
- signs: 3-4 observable findings and, for each, the mechanistic reason it appears. This is the "if you see this" half.
- actions: 2-3 situations and the reasoned next step. This is the "what do you do from there" half.
- check: one question with 4 options, the zero-based correct index, and feedback explaining why the answer follows from the mechanism.`;

          let authored = await callModel<{ lessons: Omit<BuiltLesson, "id">[] }>(
            apiKey,
            model,
            `${BUILDER_ROLE}\n\nMODE: ${modeInstruction(mode)}`,
            authorInput,
            "module_lessons",
            moduleSchema,
          );

          /* ---- 3. Validate, and repair once if needed ---- */
          const issues = validateLessons(authored.lessons);
          if (issues.length) {
            send({
              phase: "repair",
              index: i,
              message: `Checking module ${i + 1} against the standard`,
              detail: `${issues.length} issue${issues.length === 1 ? "" : "s"} to fix: ${issues
                .slice(0, 6)
                .map((issue) => `${issue.path} — ${issue.problem}`)
                .join("; ")}`,
            });
            authored = await callModel<{ lessons: Omit<BuiltLesson, "id">[] }>(
              apiKey,
              model,
              `${BUILDER_ROLE}\n\nMODE: ${modeInstruction(mode)}`,
              `${authorInput}

Your previous draft had these problems. Return the full corrected set of lessons, fixing every one:
${issues.map((issue) => `- ${issue.path}: ${issue.problem}`).join("\n")}

Previous draft:
${JSON.stringify(authored.lessons).slice(0, 12000)}`,
              "module_lessons",
              moduleSchema,
            );
          }

          const moduleId = `m${i + 1}`;
          modules.push({
            id: moduleId,
            title: outline.title,
            drivingQuestion: outline.drivingQuestion,
            lessons: authored.lessons.map((lesson, n) => ({
              ...lesson,
              id: `${moduleId}-l${n + 1}`,
            })),
          });
          send({
            phase: "module-done",
            index: i,
            message: `Module ${i + 1} written`,
            detail: `${authored.lessons.length} lessons · ${authored.lessons.reduce(
              (sum, l) => sum + (l.mechanismSteps?.length ?? 0),
              0,
            )} causal steps · ${authored.lessons.reduce(
              (sum, l) => sum + (l.socratic?.probes?.length ?? 0),
              0,
            )} dialogue branches`,
          });
        }

        const course: BuiltCourse = {
          id: `${slugify(topic)}-${Date.now().toString(36)}`,
          topic,
          mode,
          title: plan.title,
          subject: plan.subject,
          summary: plan.summary,
          audience: plan.audience || audience,
          prerequisites: plan.prerequisites ?? [],
          modules,
          glossary: plan.glossary ?? [],
          createdAt: Date.now(),
          sources: [],
          provenance: "zero-shot",
        };

        send({
          phase: "done",
          message: "Course ready",
          detail: `${modules.length} modules · ${modules.reduce(
            (sum, m) => sum + m.lessons.length,
            0,
          )} lessons`,
          course,
        });
      } catch (error) {
        send({
          phase: "error",
          message: "The build stopped",
          detail: error instanceof Error ? error.message : "Unknown error.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
