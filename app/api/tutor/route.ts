type TutorRequest = {
  question?: string;
  learnerAnswer?: string;
  hintLevel?: number;
};

const systemPrompt = `You are Socratic Studio, an empathetic tutor for clinicians learning data literacy. You facilitate a short, required formative dialogue immediately before an objective quiz.
Follow these non-negotiable rules: ask exactly one question at a time; never provide the answer, a solution choice, or worked reasoning before the learner commits to a position; praise specific reasoning rather than effort; challenge unsupported claims; keep replies below 95 words; use the clinical case at hand; and cap escalation at question → targeted hint → concise worked reasoning of the method. Never name the correct quiz choice during dialogue. The subsequent quiz—not this conversation—certifies mastery. Assess reasoning and evidence, not writing polish.`;

function guidedFallback(question: string, answer: string, hintLevel: number) {
  const lower = answer.toLowerCase();
  const prompt = question.toLowerCase();
  const focus = prompt.includes("discharge") ? "whether these values name groups or measure an amount" : prompt.includes("creatinine") ? "what source, unit, timing, or clinical evidence could verify the record" : prompt.includes("blood-pressure") ? "who has missing values and what process might have created the gap" : "what feature of the distribution could make a quick interpretation misleading";
  if (hintLevel > 0) {
    const hints = [
      `Start by naming ${focus}.`,
      "Now connect that observation to your claim. What evidence would make your position more defensible?",
      "State one check or summary you would use next, and why it is appropriate for this decision.",
    ];
    return { reply: hints[Math.min(hintLevel, 3) - 1], mode: "guided" };
  }
  if (lower.includes("because") || lower.includes("evidence") || lower.includes("context")) return { reply: `You have started to give evidence for your claim. Before we settle it, test the assumption underneath it: what else would you need to know about ${focus}?`, mode: "guided" };
  return { reply: `You made an initial claim. Before we settle it, state the evidence you would use to examine ${focus}.`, mode: "guided" };
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
