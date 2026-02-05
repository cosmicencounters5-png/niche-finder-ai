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

    /* ===============================
       ⚫ SHADOW DEEP ORACLE
    =============================== */

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

You are SHADOW ORACLE.

Analyze deeper market strategy.

Niche:

${niche}

Live signals:

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

    /* ===============================
       ⚫ ORACLE EVOLUTION X CORE
    =============================== */

    const subs = ["startups","Entrepreneur","sideproject","smallbusiness"];

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
You are ORACLE EVOLUTION X.

You think like an elite market analyst.

You identify:

- early-stage opportunities
- hidden buyer signals
- EXACT hot products to sell
- realistic execution paths

User idea:

${idea}

Live market discussions:

${titles.join("\n")}

Return STRICT JSON ONLY:

{
 "mode":"idea",

 "name":"",

 "score":0,

 "success_probability":0,
 "time_to_first_sale":"",

 "market_heat":"",
 "buyer_intent":"",

 "trend_trajectory":{
   "30_days":"",
   "90_days":""
 },

 "why_trending":"",
 "pain_signal":"",
 "hidden_signal":"",

 "hot_products":[
   {
     "name":"",
     "why_hot":"",
     "difficulty":"low/medium/high"
   }
 ],

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
You are SHADOW TREND RADAR.

Detect emerging niches BEFORE mainstream adoption.

Trending discussions:

${titles.join("\n")}

Return STRICT JSON ONLY:

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

      messages:[{ role:"user", content:prompt }]

    });

    const content = completion.choices[0].message.content;

    if(!content){

      return Response.json({ error:"empty oracle response" });

    }

    return Response.json(JSON.parse(content));

  } catch(err){

    console.log("ORACLE ERROR:", err);

    return Response.json({
      error:"oracle failed"
    });

  }

}