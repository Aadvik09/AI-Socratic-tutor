type SourceQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  feedback: string;
  hint: string;
};
type SourceLesson = {
  id: string;
  unit: string;
  title: string;
  description: string;
  concept: string;
  teaching: string;
  example: string;
  why: string;
  takeaways: string[];
  questions: SourceQuestion[];
};
type SourceLessonRequest = {
  text?: string;
  title?: string;
};
type SourceLessonResponse = {
  subject: string;
  title: string;
  lessons: SourceLesson[];
};

const systemPrompt = `You are Socratic Studio's lesson designer. A learner pasted a passage of their own material — a textbook excerpt, article, or notes. Design a short Socratic learning module grounded strictly in that passage; never introduce facts the passage does not support.
Return ONLY valid JSON with no markdown fences and no commentary, matching exactly this shape:
{"subject": string, "title": string, "lessons": [{"id": string, "unit": string, "title": string, "description": string, "concept": string, "teaching": string, "example": string, "why": string, "takeaways": [string, string, string], "questions": [{"prompt": string, "options": [string, string, string, string], "correct": number, "feedback": string, "hint": string}, {"prompt": string, "options": [string, string, string, string], "correct": number, "feedback": string, "hint": string}]}]}
Produce between 2 and 4 lessons depending on how much distinct material the passage covers: a short passage gets 2 lessons, a long or dense one gets up to 4. Each lesson isolates one coherent idea from the passage, not the whole passage restated. "unit" is a 2-4 word all-caps label like a section header. "concept" is a precise definition or claim drawn from the text. "teaching" is a short strategy for reasoning about it. "example" is drawn from or closely modeled on the passage. "why" explains the consequence of getting it wrong. "takeaways" are exactly 3 short imperative bullets. Each lesson needs exactly 2 multiple-choice questions with 4 options each, one correct zero-based index, a feedback string explaining the correct answer, and a hint that does not give away the answer outright. Write in a neutral, rigorous, textbook-adjacent voice — no filler, no meta-commentary about "the passage" or "the text".`;

function slugTitle(text: string): string {
  const firstLine = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  if (!firstLine) return "Your material";
  return firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
}

function fallbackFromText(text: string, title?: string): SourceLessonResponse {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 40);
  const source = paragraphs.length ? paragraphs : [text.replace(/\s+/g, " ").trim()];
  const chunkCount = Math.min(3, Math.max(2, Math.ceil(source.length / 3)));
  const chunkSize = Math.ceil(source.length / chunkCount);
  const chunks: string[] = [];
  for (let i = 0; i < source.length; i += chunkSize) {
    chunks.push(source.slice(i, i + chunkSize).join(" "));
  }

  const lessons: SourceLesson[] = chunks.slice(0, 4).map((chunk, index) => {
    const sentence = chunk.split(/(?<=[.!?])\s+/)[0]?.slice(0, 220) || chunk.slice(0, 220);
    const snippet = chunk.length > 320 ? `${chunk.slice(0, 317)}...` : chunk;
    return {
      id: String(index + 1).padStart(2, "0"),
      unit: `SECTION ${index + 1}`,
      title: `Read section ${index + 1} closely`,
      description: "Identify the core claim in this part of your material before moving on.",
      concept: sentence,
      teaching:
        "Before accepting a claim from this passage, restate it in your own words and name the evidence the passage gives for it, if any.",
      example: snippet,
      why: "A claim you can restate and justify is one you can actually use later; one you only recognize is not.",
      takeaways: [
        "Restate the claim before trusting it.",
        "Separate what the passage asserts from what it shows evidence for.",
        "Connect this section to what came before it.",
      ],
      questions: [
        {
          prompt: "Which best describes the main claim of this section?",
          options: [
            sentence,
            "The section makes no identifiable claim.",
            "The section only lists unrelated facts.",
            "The claim contradicts itself.",
          ],
          correct: 0,
          feedback: "That statement is the section's central claim, drawn directly from the material.",
          hint: "Look at the first substantive sentence of this section.",
        },
        {
          prompt: "Before relying on this section's claim elsewhere, what should you do first?",
          options: [
            "Restate it in your own words and check what evidence supports it",
            "Memorize the exact wording without checking it",
            "Assume it is correct because it was written down",
            "Skip it and move to the next section",
          ],
          correct: 0,
          feedback:
            "Restating a claim and checking its support is what turns reading into understanding you can defend.",
          hint: "What habit distinguishes recognizing an idea from being able to use it?",
        },
      ],
    };
  });

  return {
    subject: "YOUR MATERIAL",
    title: title?.trim() || slugTitle(text),
    lessons,
  };
}

function isValidLesson(value: unknown): value is SourceLesson {
  if (!value || typeof value !== "object") return false;
  const lesson = value as Record<string, unknown>;
  if (
    typeof lesson.title !== "string" ||
    typeof lesson.concept !== "string" ||
    typeof lesson.teaching !== "string" ||
    typeof lesson.example !== "string" ||
    typeof lesson.why !== "string" ||
    !Array.isArray(lesson.takeaways) ||
    !Array.isArray(lesson.questions) ||
    lesson.questions.length === 0
  )
    return false;
  return lesson.questions.every((q) => {
    if (!q || typeof q !== "object") return false;
    const question = q as Record<string, unknown>;
    return (
      typeof question.prompt === "string" &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((o) => typeof o === "string") &&
      typeof question.correct === "number" &&
      question.correct >= 0 &&
      question.correct <= 3 &&
      typeof question.feedback === "string" &&
      typeof question.hint === "string"
    );
  });
}

function sanitize(parsed: unknown, text: string, title?: string): SourceLessonResponse | null {
  if (!parsed || typeof parsed !== "object") return null;
  const value = parsed as Record<string, unknown>;
  const lessonsRaw = value.lessons;
  if (!Array.isArray(lessonsRaw) || lessonsRaw.length === 0) return null;
  const validLessons = lessonsRaw.filter(isValidLesson);
  if (validLessons.length === 0) return null;
  return {
    subject: typeof value.subject === "string" && value.subject ? value.subject : "YOUR MATERIAL",
    title: typeof value.title === "string" && value.title ? value.title : title?.trim() || slugTitle(text),
    lessons: validLessons.map((lesson, index) => ({
      id: lesson.id || String(index + 1).padStart(2, "0"),
      unit: lesson.unit || "YOUR MATERIAL",
      title: lesson.title,
      description: lesson.description || "A lesson built from your pasted material.",
      concept: lesson.concept,
      teaching: lesson.teaching,
      example: lesson.example,
      why: lesson.why,
      takeaways: lesson.takeaways.length ? lesson.takeaways.slice(0, 3) : [
        "Restate the idea in your own words.",
        "Name the evidence behind it.",
        "Connect it to what you already know.",
      ],
      questions: lesson.questions.slice(0, 2),
    })),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as SourceLessonRequest;
  const text = (body.text ?? "").trim();
  const title = body.title?.trim();

  if (text.length < 200) {
    return Response.json(
      { error: "Paste at least a paragraph or two (about 200 characters) so the tutor has enough to work with." },
      { status: 400 },
    );
  }

  const trimmed = text.slice(0, 12000);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(fallbackFromText(trimmed, title));
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
        instructions: systemPrompt,
        input: `Title hint (optional, may be blank): ${title || "[none given]"}\n\nSource material:\n${trimmed}`,
      }),
    });
    if (!response.ok) throw new Error("The lesson model was unavailable.");
    const payload = (await response.json()) as { output_text?: string };
    const raw = (payload.output_text ?? "").trim();
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(cleaned);
    const sanitized = sanitize(parsed, trimmed, title);
    if (!sanitized) throw new Error("The model returned an unexpected shape.");
    return Response.json(sanitized);
  } catch {
    return Response.json(fallbackFromText(trimmed, title));
  }
}
