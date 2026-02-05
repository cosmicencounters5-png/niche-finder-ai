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
       🔥 DEEP ORACLE (CLICK NICHES)
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

You are ORACLE MARKET GOD.

Niche:

${niche}

Live market signals:

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
       🔥 ORACLE EVOLUTION X ENGINE
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

You DO NOT give generic advice.

You identify EXACT profitable sub-niches and hot products.

User idea:

${idea}

Live market discussions:

${titles.join("\n")}

VERY IMPORTANT:

Break down WHAT TO SELL specifically.

Return STRICT JSON ONLY:

{
 "mode":"idea",

 "name":"",

 "score":85,

 "success_probability":70,
 "time_to_first_sale":"7-14 days",

 "market_heat":"explosive",
 "buyer_intent":"high",

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
You are ORACLE TREND RADAR.

Find hidden niches from trending discussions.

Trending:

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