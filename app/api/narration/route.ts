type NarrationRequest = {
  text?: string;
};

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
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "marin",
        input: text.slice(0, 4000),
        response_format: "mp3",
        instructions:
          "Speak as a calm, warm clinical educator. Sound natural and conversational, with a measured pace, clear pronunciation, and thoughtful pauses. Do not sound promotional or synthetic.",
      }),
    });

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
