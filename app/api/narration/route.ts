type NarrationRequest = {
  text?: string;
};

// "marin" is not a valid voice for the speech endpoint, so every request failed
// and the client silently fell back to the browser's default robotic voice.
// These are the documented voices; the first is the default and the second is a
// retry in case a deployment only supports the original set.
const VOICE = process.env.NARRATION_VOICE || "sage";
const FALLBACK_VOICE = "nova";

const INSTRUCTIONS =
  "You are a warm, unhurried teacher reading a short lesson aloud to one student. " +
  "Speak naturally and conversationally at a measured pace. Put a real pause at " +
  "sentence ends, lift slightly on the key term in each sentence, and let the last " +
  "word of a sentence settle rather than clipping it. Never sound promotional.";

async function requestSpeech(apiKey: string, text: string, voice: string) {
  return fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice,
      input: text.slice(0, 4000),
      response_format: "mp3",
      speed: 0.96,
      instructions: INSTRUCTIONS,
    }),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as NarrationRequest;
  const text = body.text?.trim();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!text) {
    return Response.json(
      { error: "Narration text is required." },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return Response.json(
      { error: "Natural narration is not configured." },
      { status: 503 },
    );
  }

  try {
    let response = await requestSpeech(apiKey, text, VOICE);
    if (!response.ok && response.status === 400) {
      response = await requestSpeech(apiKey, text, FALLBACK_VOICE);
    }
    if (!response.ok) throw new Error("Narration request failed.");

    return new Response(response.body, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "audio/mpeg",
      },
    });
  } catch {
    return Response.json(
      { error: "Natural narration is unavailable right now." },
      { status: 502 },
    );
  }
}
