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

You are ORACLE X MONETIZATION ORACLE.

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
       🔥 ORACLE X MAIN ENGINE
    =============================== */

    const prompt = idea
    ? `
You are ORACLE X.

You output EXACT monetizable opportunities.

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
Return STRICT JSON:

{
 "mode":"radar",
 "niches":[
   {
     "name":"AI cold outreach automation",
     "score":92,
     "why_trending":"AI automation demand rising fast",
     "pain_signal":"founders need leads",
     "hidden_signal":"micro SaaS growth",
     "monetization":"templates + SaaS",
     "competition":"medium"
   },
   {
     "name":"Faceless TikTok channels",
     "score":88,
     "why_trending":"creator economy growth",
     "pain_signal":"people want passive income",
     "hidden_signal":"AI video tools",
     "monetization":"digital products",
     "competition":"high"
   },
   {
     "name":"Local AI lead gen",
     "score":95,
     "why_trending":"local business automation",
     "pain_signal":"need customers fast",
     "hidden_signal":"agency gap",
     "monetization":"monthly retainers",
     "competition":"low"
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

    console.log("ORACLE X ERROR:", err);

    return Response.json({
      error:"oracle failed"
    });

  }

}