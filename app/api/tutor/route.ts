type TutorRequest = {
  question?: string;
  learnerAnswer?: string;
  hintLevel?: number;
};

const systemPrompt = `You are Socratic Studio, an empathetic tutor for clinicians learning data literacy.
Follow these non-negotiable rules: ask exactly one question at a time; do not give a final answer before the learner has attempted the problem; praise specific reasoning, not effort alone; challenge unsupported claims; keep replies below 95 words; use clinical context where it helps; increase hints gradually from nudge to partial insight to explicit explanation. The learner is practicing judgment, so evaluate their reasoning rather than pretending every problem has one answer.`;

function guidedFallback(question: string, answer: string, hintLevel: number) {
  const lower = answer.toLowerCase();
  if (hintLevel > 0) {
    const hints = [
      "Start by naming the feature of the data that could mislead a quick interpretation.",
      "Compare the summary measure that moves with extreme values to the one that is more resistant to them.",
      "A few large observations can pull the mean upward while leaving the median closer to a typical value. What pattern does that create?",
    ];
    return { reply: hints[Math.min(hintLevel, 3) - 1], mode: "guided" };
  }
  if (lower.includes("skew") || lower.includes("outlier") || lower.includes("extreme") || lower.includes("long")) {
    return { reply: "You noticed the key tension: a small number of unusually long stays may be shaping the average. Which statistic here would stay closest to a typical patient’s stay, and why?", mode: "guided" };
  }
  return { reply: `You made an initial claim about this scenario. Before we settle it, look at the relationship between the mean and the median. ${question.includes("mean") ? "What kind of values would make the mean move farther upward than the median?" : "What evidence in the values would support your choice?"}`, mode: "guided" };
}

export async function POST(request: Request) {
  const body = (await request.json()) as TutorRequest;
  const question = body.question?.trim() ?? "";
  const learnerAnswer = body.learnerAnswer?.trim() ?? "";
  const hintLevel = Math.max(0, Math.min(body.hintLevel ?? 0, 3));

  if (!question) return Response.json({ error: "A tutoring question is required." }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json(guidedFallback(question, learnerAnswer, hintLevel));

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        instructions: systemPrompt,
        input: `Current question: ${question}\nLearner answer: ${learnerAnswer || "[No attempt yet]"}\nHint level requested: ${hintLevel}.`,
      }),
    });
    if (!response.ok) throw new Error("The tutoring model was unavailable.");
    const payload = (await response.json()) as { output_text?: string };
    return Response.json({ reply: payload.output_text?.trim() || guidedFallback(question, learnerAnswer, hintLevel).reply, mode: "ai" });
  } catch {
    return Response.json(guidedFallback(question, learnerAnswer, hintLevel));
  }
}
