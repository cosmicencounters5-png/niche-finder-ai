import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { idea } = await req.json();

  const subs = ["startups", "Entrepreneur", "sideproject", "saas"];
  let titles: string[] = [];

  for (const sub of subs) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=6`);
      const json = await res.json();
      titles.push(...json.data.children.map((p: any) => p.data.title));
    } catch {}
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are GOD MODE. Return only valid JSON."
      },
      {
        role: "user",
        content: `
USER IDEA:
${idea}

TREND SIGNALS:
${titles.join("\n")}

Return JSON:

{
  "verdict": "",
  "score": 0,
  "refined_idea": "",
  "ideal_customer": {
    "who": "",
    "where": "",
    "trigger": ""
  },
  "best_opportunity": {
    "niche": "",
    "why_now": "",
    "blindspot": ""
  },
  "execution": {
    "day1": "",
    "week1": "",
    "first_revenue": ""
  },
  "launch_plan": {
    "mvp": "",
    "traffic": "",
    "monetization": "",
    "next_72_hours": ""
  },
  "red_flags": [],
  "trend_signals": []
}
`
      }
    ]
  });

  return Response.json(
    JSON.parse(completion.choices[0].message.content!)
  );
}