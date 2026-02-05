import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {

  const { idea } = await req.json();

  /* ---------------- REDDIT TREND SCAN ---------------- */

  const subreddits = [
    "startups",
    "Entrepreneur",
    "sideproject",
    "saas"
  ];

  let titles: string[] = [];

  for (const sub of subreddits) {

    try {

      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`
      );

      const json = await res.json();

      const extracted = json.data.children.map(
        (p: any) => p.data.title
      );

      titles = [...titles, ...extracted];

    } catch (e) {
      console.log("Reddit fetch failed", e);
    }
  }

  /* ---------------- AI ENGINE ---------------- */

  const completion = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    messages: [

      {
        role: "system",
        content: `
You are an elite niche discovery AI.

You detect:

- emerging trends
- hidden frustrations
- monetizable gaps
- underserved audiences.

Avoid generic startup advice.
Be specific and bold.
`
      },

      {
        role: "user",
        content: `
User idea:

${idea}

Trending discussions from Reddit:

${titles.join("\n")}

STEP 1:
Identify recurring pain signals from trends.

STEP 2:
Combine pain signals with user idea.

Return EXACT format:

Hidden Niche Score: (1-100)

Best Opportunity:
- Niche:
- Who it targets:
- Why underserved:
- Why this could realistically succeed:
- Viral positioning angle:

Live Trend Signals:
- bullet list

Most founders miss this:

Alternative Opportunities:
1.
2.
3.

Autopilot Ideas:
1.
2.
`
      }

    ]

  });

  return Response.json({
    result: completion.choices[0].message.content
  });

}