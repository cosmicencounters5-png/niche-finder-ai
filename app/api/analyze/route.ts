import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { idea } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert startup strategist that finds hidden niche opportunities that are specific and actionable.",
      },
      {
        role: "user",
        content: `Find hidden niche opportunities for this startup idea: ${idea}`,
      },
    ],
  });

  return Response.json({
    result: completion.choices[0].message.content,
  });
}