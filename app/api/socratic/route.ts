export const maxDuration = 120;

type Turn = { role: "tutor" | "learner"; text: string };

type SocraticRequest = {
  topic?: string;
  /** What the learner should be able to say unaided by the end. */
  target?: string;
  /** Orientation the tutor may assume, but must never simply recite. */
  context?: string;
  transcript?: Turn[];
  /** mechanism → recognition → action */
  stage?: Stage;
};

type Stage = "mechanism" | "recognition" | "action";

const STAGE_GOAL: Record<Stage, string> = {
  mechanism:
    "Get the learner to construct the causal explanation themselves — what causes what, and why that follows. Do not move on until they have stated a mechanism, even a rough one.",
  recognition:
    "Now that they hold the mechanism, make them predict what it would look like from the outside: what would you observe, and why would that particular finding appear?",
  action:
    "Make them reason from an observation to a next step: given what they now see, what would they do, what would they check first, and what would change their mind?",
};

const SOCRATIC_ROLE = `You are a Socratic tutor. You teach exclusively by asking questions.

Absolute rules:
1. Every reply you produce is ONE question. Not two. Not a statement followed by a question.
2. Never state the explanation, the answer, or the mechanism yourself — not as a hint, not as a summary, not as a correction, not "as a recap". If the learner would learn the fact by reading your reply, you have failed.
3. Never say whether the learner is right or wrong. If they are wrong, ask the question that makes the contradiction visible to them. If they are right, ask the question that tests whether they know why.
4. Build on their exact words. Quote or reuse their phrasing so they can see you are following their reasoning, not running a script.
5. A question must never contain its own answer. "Does the low iron cause small cells?" is a failure; "What would happen to cell size if the factory ran short of its main raw material?" is the move.
6. Keep it under 40 words. One question, plainly worded.
7. If the learner is genuinely stuck or asks for the answer, do not give it. Ask a smaller question — decompose the step until it is answerable from what they already know.
8. No praise, no filler, no "great question", no meta-commentary about the process.

You also return a private assessment for the interface. The learner never sees it.`;

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["question", "understanding", "reached", "note"],
  properties: {
    question: {
      type: "string",
      description: "The single question to put to the learner. Must end with ?",
    },
    understanding: {
      type: "integer",
      description: "0-100: how close the learner is to stating the target unaided.",
    },
    reached: {
      type: "boolean",
      description: "True only when the learner has articulated the target in their own words.",
    },
    note: {
      type: "string",
      description: "One short line for the interface: what the learner has established so far.",
    },
  },
} as const;

/** Keeps the tutor honest when the model is unavailable: still only questions. */
function fallbackQuestion(stage: Stage, transcript: Turn[]): string {
  const learnerTurns = transcript.filter((t) => t.role === "learner");
  const last = learnerTurns[learnerTurns.length - 1]?.text.trim() ?? "";
  const depth = learnerTurns.length;
  const byStage: Record<Stage, string[]> = {
    mechanism: [
      "Before anything else — what do you already believe is happening here, and what makes you believe it?",
      "You have named a thing that happens. What has to be true immediately before it, for it to happen at all?",
      "If that step were blocked, what would change downstream — and what would stay exactly the same?",
    ],
    recognition: [
      "If what you just described were happening inside someone, what would you be able to observe from the outside?",
      "Which of those observations would you expect to appear first, and why that one before the others?",
      "What would you expect to find that would make you doubt your own explanation?",
    ],
    action: [
      "You see exactly that picture in front of you. What is the first thing you would want to know, and why that first?",
      "What would you do differently if the opposite of your expectation came back?",
      "What is the cheapest observation that would separate your explanation from the next most likely one?",
    ],
  };
  const options = byStage[stage];
  if (!last) return options[0];
  return options[Math.min(depth, options.length - 1)];
}

export async function POST(request: Request) {
  const body = (await request.json()) as SocraticRequest;
  const topic = body.topic?.trim() || "this idea";
  const target = body.target?.trim() || "";
  const context = body.context?.trim() || "";
  const transcript = Array.isArray(body.transcript) ? body.transcript.slice(-24) : [];
  const stage: Stage = body.stage ?? "mechanism";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({
      question: fallbackQuestion(stage, transcript),
      understanding: Math.min(
        90,
        transcript.filter((t) => t.role === "learner").length * 22,
      ),
      reached: false,
      note: "Offline dialogue — connect a model key for adaptive questioning.",
      mode: "offline",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        instructions: SOCRATIC_ROLE,
        input: `Topic: ${topic}
Current stage: ${stage}. ${STAGE_GOAL[stage]}
${target ? `The learner should eventually be able to say, unaided: ${target}` : ""}
${context ? `Orientation you may assume the learner has seen (never recite it back): ${context}` : ""}

Conversation so far:
${
  transcript.length
    ? transcript
        .map((t) => `${t.role === "tutor" ? "You asked" : "Learner"}: ${t.text}`)
        .join("\n")
    : "[nothing yet — ask your opening question]"
}

Ask the single next question.`,
        text: { format: { type: "json_schema", name: "socratic_turn", strict: true, schema } },
      }),
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    const payload = (await response.json()) as {
      output_text?: string;
      output?: { content?: { text?: string }[] }[];
    };
    const text = payload.output_text ?? payload.output?.[0]?.content?.[0]?.text ?? "";
    const parsed = JSON.parse(text) as {
      question: string;
      understanding: number;
      reached: boolean;
      note: string;
    };
    // The one rule worth enforcing in code rather than trusting to prose.
    const question = parsed.question?.trim();
    if (!question || !question.includes("?")) {
      throw new Error("model did not return a question");
    }
    return Response.json({ ...parsed, question, mode: "ai" });
  } catch {
    return Response.json({
      question: fallbackQuestion(stage, transcript),
      understanding: Math.min(
        90,
        transcript.filter((t) => t.role === "learner").length * 22,
      ),
      reached: false,
      note: "The tutor model is unavailable; continuing with a scripted ladder.",
      mode: "offline",
    });
  }
}
