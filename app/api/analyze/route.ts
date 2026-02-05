import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {

  try {

    const body = await req.json().catch(()=>({}));

    const idea = body.idea;
    const deep = body.deep;
    const niche = body.niche;

    /* ---------- DEEP ORACLE MODE ---------- */

    if (deep) {

      let marketSignals:string[] = [];

      try {

        const reddit = await fetch(
          `https://www.reddit.com/search.json?q=${encodeURIComponent(niche)}&limit=10`
        );

        const json = await reddit.json();

        if (json?.data?.children) {

          marketSignals = json.data.children.map(
            (p:any)=>p.data.title
          );

        }

      } catch {}

      const completion = await openai.chat.completions.create({

        model:"gpt-4o-mini",

        response_format:{ type:"json_object" },

        messages:[{
          role:"user",
          content:`

You are an elite market oracle.

Niche:

${niche}

Real market signals:

${marketSignals.join("\n")}

Return STRICT JSON ONLY:

{
 "execution":"",
 "users":"",
 "traffic":"",
 "monetization":"",
 "hidden_angle":"",
 "risk":""
}

`
        }]

      });

      return Response.json(
        JSON.parse(completion.choices[0].message.content!)
      );

    }

    /* ---------- NORMAL MODE (IDEA + RADAR) ---------- */

    const subs = ["startups","Entrepreneur","sideproject"];

    let titles:string[] = [];

    for(const sub of subs){

      try{

        const reddit = await fetch(
          `https://www.reddit.com/r/${sub}/hot.json?limit=6`
        );

        const json = await reddit.json();

        if(json?.data?.children){

          titles.push(
            ...json.data.children.map((p:any)=>p.data.title)
          );

        }

      }catch{}

    }

    const prompt = idea
      ? `
You are an elite startup oracle.

User idea:

${idea}

Trending discussions:

${titles.join("\n")}

Return STRICT JSON ONLY:

{
 "mode":"idea",
 "name":"",
 "score":85,

 "market_heat":"rising / stable / explosive",
 "buyer_intent":"low / medium / high",

 "why_trending":"",
 "pain_signal":"",
 "hidden_signal":"",

 "execution":{
   "day1":"",
   "week1":"",
   "first_revenue":""
 },

 "monetization":"",
 "competition":""
}
`
      : `
You are a niche radar AI.

Trending discussions:

${titles.join("\n")}

Return STRICT JSON ONLY:

{
 "mode":"radar",
 "niches":[
  {
   "name":"",
   "score":80,
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

      messages:[{ role:"user", content:prompt }]

    });

    return Response.json(
      JSON.parse(completion.choices[0].message.content!)
    );

  } catch(err){

    console.log("ORACLE ERROR:", err);

    return Response.json({
      error:"oracle failed"
    });

  }

}