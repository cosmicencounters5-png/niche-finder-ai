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

You think like:
- indie hackers
- early adopters
- product-market fit experts.

Give insights that feel like insider intelligence.
Avoid generic startup advice.

`,
      },
      {
        role: "user",
        content: `
Startup idea:
${idea}

Return EXACT format:

Hidden Niche Score: (1-100)

Best Opportunity:
- Niche:
- Who it targets:
- Why underserved:
- Why this could realistically succeed:
- Viral positioning angle:

Most founders miss this:
- One unexpected insight or warning related to the idea.

Alternative Opportunities:
1.
2.

Be bold and specific.
`,
      },
    ],
  });

  return Response.json({
    result: completion.choices[0].message.content,
  });
}
