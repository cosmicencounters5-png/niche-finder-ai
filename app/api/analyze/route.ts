import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {

  /* ---------- LIVE TREND SCAN ---------- */

  const subs = [
    "startups",
    "Entrepreneur",
    "sideproject",
    "SaaS",
    "ChatGPT",
    "ArtificialInteligence"
  ];

  let titles:string[] = [];

  for (const sub of subs) {

    try {

      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`
      );

      const json = await res.json();

      titles.push(
        ...json.data.children.map((p:any)=>p.data.title)
      );

    } catch {}

  }

  /* ---------- AI ULTIMATE ENGINE ---------- */

  const completion = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    response_format:{ type:"json_object" },

    messages:[

      {
        role:"system",
        content:`
You are an elite AI niche detection engine.

Detect emerging opportunities BEFORE mainstream.

Score based on:

- trend velocity
- unmet demand
- competition saturation
- monetization clarity
- speed to build

Avoid generic ideas.
`
      },

      {
        role:"user",
        content:`
Trending discussions:

${titles.join("\n")}

Return:

{
 "niches":[
   {
    "name":"",
    "score":0,
    "confidence":"",
    "why_trending":"",
    "pain_signal":"",
    "hidden_signal":"",
    "competition":"",
    "monetization":"",
    "speed_to_build":""
   }
 ]
}
`
      }

    ]

  });

  return Response.json(
    JSON.parse(completion.choices[0].message.content!)
  );

}