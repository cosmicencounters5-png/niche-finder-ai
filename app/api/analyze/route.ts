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

Your job is to find UNDERSERVED and OVERLOOKED niche opportunities.
Avoid generic ideas.
Be specific, opinionated, and actionable.

Think like someone who studies Reddit, indie hackers, and early adopters.
`,
      },
      {
        role: "user",
        content: `
Startup idea:
${idea}

Return the result in this exact structure:

Hidden Niche Opportunities:
1. Niche name
   - Who it is for
   - Why this niche is underserved
   - The unique angle that would work

2. Niche name
   - Who it is for
   - Why this niche is underserved
   - The unique angle that would work

Go deep. No fluff.
`,
      },
    ],
  });

  return Response.json({
    result: completion.choices[0].message.content,
  });
}
