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
       🔥 DEEP ORACLE MODE
    =============================== */

    if(deep){

      const completion = await openai.chat.completions.create({

        model:"gpt-4o-mini",

        response_format:{ type:"json_object" },

        messages:[{
          role:"user",
          content:`

You are SHADOW MONETIZATION ORACLE.

Niche:

${niche}

Return STRICT JSON:

{
 "execution":"",
 "users":"",
 "traffic":"",
 "monetization":"",
 "first_product":"",
 "price":"",
 "where_to_sell":"",
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
       🔥 ORACLE EVOLUTION X + MONEY ENGINE
    =============================== */

    const prompt = idea
      ? `
You are SHADOW MONETIZATION ENGINE.

You do NOT give theory.

You output EXACT things to sell.

User idea:

${idea}

Return STRICT JSON:

{
 "mode":"idea",

 "name":"",
 "score":85,

 "success_probability":70,
 "time_to_first_sale":"7-14 days",

 "market_heat":"explosive",
 "buyer_intent":"high",

 "hot_products":[
   {
     "name":"",
     "why_hot":"",
     "difficulty":"low/medium/high"
   }
 ],

 "first_product":"",
 "price":"",
 "where_to_sell":"",
 "traffic_source":"",

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
You are Niche Radar AI.

Return JSON:

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

    console.log("SHADOW ENGINE ERROR:", err);

    return Response.json({
      error:"oracle failed"
    });

  }

}