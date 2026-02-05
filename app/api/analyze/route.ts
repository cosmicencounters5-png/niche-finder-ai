import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req:Request){

  const body = await req.json().catch(()=>({}));
  const idea = body?.idea;

  /* ---------- TREND FETCH ---------- */

  const subs = [
    "startups",
    "Entrepreneur",
    "sideproject",
    "SaaS",
    "ChatGPT"
  ];

  let titles:string[] = [];

  for(const sub of subs){

    try{

      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=8`
      );

      const json = await res.json();

      titles.push(
        ...json.data.children.map((p:any)=>p.data.title)
      );

    }catch{}

  }

  /* ---------- PROMPT ---------- */

  const prompt = idea
  ? `
User idea:

${idea}

Trending signals:

${titles.join("\n")}

Analyse the idea and find best niche angle.

Return JSON:

{
 "mode":"idea",
 "name":"",
 "score":0,
 "why_trending":"",
 "pain_signal":"",
 "hidden_signal":"",
 "monetization":"",
 "competition":""
}
`
  : `
Trending discussions:

${titles.join("\n")}

Find 3 emerging niches.

Return JSON:

{
 "mode":"radar",
 "niches":[
   {
    "name":"",
    "score":0,
    "why_trending":"",
    "pain_signal":"",
    "hidden_signal":"",
    "monetization":"",
    "competition":""
   }
 ]
}
`;

  const completion = await openai.chat.completions.create({

    model:"gpt-4o-mini",
    response_format:{ type:"json_object" },
    messages:[{role:"user",content:prompt}]

  });

  return Response.json(
    JSON.parse(completion.choices[0].message.content!)
  );

}