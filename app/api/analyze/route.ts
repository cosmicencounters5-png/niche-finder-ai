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
        content: `
You are an elite startup strategist.

Find overlooked niche opportunities that feel like insider intelligence.

Be specific and bold.

`,
      },
      {
        role: "user",
        content: `
Startup idea:
${idea}

Return EXACT format:

Hidden Niche Score: (number from 1-100)

Hidden Opportunities:

1. Niche name
- Who it is for
- Why underserved
- Unique positioning

2. Niche name
- Who it is for
- Why underserved
- Unique positioning

No fluff.
`,
      },
    ],
  });

  return Response.json({
    result: completion.choices[0].message.content,
  });
}
