import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST() {

  /* -------- LIVE TREND SCAN -------- */

  const subreddits = [
    "startups",
    "Entrepreneur",
    "sideproject",
    "saas",
    "ChatGPT",
    "ArtificialInteligence"
  ];

  let titles:string[] = [];

  for (const sub of subreddits) {

    try {

      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=8`
      );

      const json = await res.json();

      titles.push(
        ...json.data.children.map((p:any)=>p.data.title)
      );

    } catch {}

  }

  /* -------- AI NICHE RADAR -------- */

  const completion = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    response_format: { type: "json_object" },

    messages: [

      {
        role: "system",
        content: `
You are an AI niche radar.

Find emerging niches before mainstream.

Avoid generic startup ideas.

Focus on:

- emerging problems
- new behaviours
- underserved users
`
      },

      {
        role: "user",
        content: `
Trending discussions:

${titles.join("\n")}

Return JSON:

{
 "niches":[
  {
   "name":"",
   "why_trending":"",
   "pain_signal":"",
   "monetization":"",
   "competition_level":"",
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