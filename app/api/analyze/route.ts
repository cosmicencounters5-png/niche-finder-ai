import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { idea } = await req.json();

  /* ---------- TREND RADAR (REDDIT) ---------- */
  const subreddits = ["startups", "Entrepreneur", "sideproject", "saas"];
  let titles: string[] = [];

  for (const sub of subreddits) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=8`);
      const json = await res.json();
      const extracted = json.data.children.map((p: any) => p.data.title);
      titles.push(...extracted);
    } catch {}
  }

  /* ---------- GOD MODE AI ---------- */
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are GOD MODE.

You do not brainstorm.
You decide.

You combine:
- live internet pain signals
- market timing
- execution realism

You are allowed to say:
- "do not build this"
- "this is a rare opportunity"
- "this will fail for 90% of people"

Be brutally honest.
Avoid fluff.
`
      },
      {
        role: "user",
        content: `
USER IDEA:
${idea}

LIVE TREND SIGNALS (Reddit):
${titles.join("\n")}

TASK:

1. Detect emerging pain clusters.
2. Combine with the user idea.
3. Decide if this is worth building.

Return EXACT format:

Verdict:
(Build / Do NOT build)

Hidden Niche Score: (1-100)

Core Pain Cluster:
- Description
- Why it's getting worse now

Best Opportunity:
- Niche:
- Target user:
- Why underserved:
- Why NOW (timing):
- Why competitors are blind:

Execution Blueprint:
Step 1 (Day 1):
Step 2 (Week 1):
Step 3 (First revenue):

Fastest Monetization Path:
- Method
- Price range
- Why this works

Red Flags (Read this carefully):
- bullet list

If Verdict is "Do NOT build", explain exactly why.
`
      }
    ]
  });

  return Response.json({
    result: completion.choices[0].message.content
  });
}