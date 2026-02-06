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
       🔥 DEEP ORACLE
    =============================== */

    if(deep){

      const completion = await openai.chat.completions.create({

        model:"gpt-4o-mini",
        response_format:{ type:"json_object" },

        messages:[{
          role:"user",
          content:`

You are ORACLE X DEEP MARKET ANALYZER.

Niche:

${niche}

Return STRICT JSON:

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
       🔥 ORACLE X MAIN ENGINE
    =============================== */

    const prompt = idea
      ? `
You are ORACLE X.

You identify HIGHLY profitable opportunities.

User idea:

${idea}

Return STRICT JSON:

{
 "mode":"idea",
 "name":"",
 "score":85,
 "success_probability":70,

 "hot_products":[
   {
     "name":"",
     "why_hot":"",
     "difficulty":"low/medium/high"
   },
   {
     "name":"",
     "why_hot":"",
     "difficulty":"low/medium/high"
   },
   {
     "name":"",
     "why_hot":"",
     "difficulty":"low/medium/high"
   }
 ],

 "first_product":"",
 "price":"",
 "where_to_sell":"",
 "traffic_source":""
}

`
      : `
You are ORACLE X TREND RADAR.

Return EXACTLY 6 HIGHLY DIFFERENT emerging niches.

Each niche must target a DIFFERENT audience or problem.

Return STRICT JSON:

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