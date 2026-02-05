import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {

  const { idea } = await req.json();

  /* ---------- TREND RADAR ---------- */

  const subs = ["startups","Entrepreneur","sideproject","saas"];
  let titles: string[] = [];

  for (const sub of subs) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=8`);
      const json = await res.json();
      titles.push(
        ...json.data.children.map((p:any)=>p.data.title)
      );
    } catch {}
  }

  /* ---------- GOD MODE V2 ---------- */

  const completion = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    response_format: { type: "json_object" },

    messages: [
      {
        role: "system",
        content: `
You are GOD MODE.

Return ONLY valid JSON.
No explanations outside JSON.
`
      },
      {
        role: "user",
        content: `
USER IDEA:
${idea}

TREND SIGNALS:
${titles.join("\n")}

Return:

{
  "verdict": "Build or Do NOT build",
  "score": number,
  "pain_cluster": {
    "description": "",
    "why_now": ""
  },
  "best_opportunity": {
    "niche": "",
    "target_user": "",
    "why_underserved": "",
    "timing": "",
    "competitor_blindspot": ""
  },
  "execution": {
    "day1": "",
    "week1": "",
    "first_revenue": ""
  },
  "monetization": {
    "method": "",
    "price_range": "",
    "reason": ""
  },
  "red_flags": [],
  "trend_signals": []
}
`
      }
    ]

  });

  const data = JSON.parse(
    completion.choices[0].message.content!
  );

  return Response.json(data);

}