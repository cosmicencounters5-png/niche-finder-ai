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

    /* =====================================================
       🔥 DEEP ORACLE (CLICK NICHE FOR DETAILS)
    ===================================================== */

    if(deep){

      const completion = await openai.chat.completions.create({

        model:"gpt-4o-mini",

        // 🔥 IMPORTANT (prevents identical results)
        temperature:1.1,
        top_p:0.95,

        response_format:{ type:"json_object" },

        messages:[{
          role:"user",
          content:`

You are Oracle X Deep Analyzer.

Analyze this niche deeply and give ACTIONABLE execution.

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

    /* =====================================================
       🔥 MAIN ORACLE X ENGINE (ADDICTIVE MODE)
    ===================================================== */

    const prompt = idea
      ? `
You are ORACLE X — elite startup intelligence.

RULES:

- NEVER give generic advice.
- Provide VERY SPECIFIC monetization ideas.
- ALWAYS generate MULTIPLE angles.
- Each angle must feel DIFFERENT.
- Include clear execution steps.

User idea:

${idea}

Return STRICT JSON:

{
 "mode":"idea",

 "name":"",

 "score":85,
 "success_probability":70,

 "alternative_angles":[
   {
     "name":"",
     "difficulty":"low/medium/high",
     "execution_plan":{
       "day1":"",
       "week1":"",
       "first_money":"",
       "growth_lever":""
     },
     "hidden_opportunity":""
   },
   {
     "name":"",
     "difficulty":"low/medium/high",
     "execution_plan":{
       "day1":"",
       "week1":"",
       "first_money":"",
       "growth_lever":""
     },
     "hidden_opportunity":""
   },
   {
     "name":"",
     "difficulty":"low/medium/high",
     "execution_plan":{
       "day1":"",
       "week1":"",
       "first_money":"",
       "growth_lever":""
     },
     "hidden_opportunity":""
   }
 ],

 "hot_products":[
   { "name":"", "why_hot":"" },
   { "name":"", "why_hot":"" },
   { "name":"", "why_hot":"" }
 ],

 "first_product":"",
 "price":"",
 "where_to_sell":"",
 "traffic_source":""
}
`
      : `
You are Oracle X Trend Radar.

Return EXACTLY 6 VERY DIFFERENT emerging niches.

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
  },
  {
   "name":"",
   "score":80,
   "why_trending":"",
   "pain_signal":"",
   "hidden_signal":"",
   "monetization":"",
   "competition":""
  },
  {
   "name":"",
   "score":80,
   "why_trending":"",
   "pain_signal":"",
   "hidden_signal":"",
   "monetization":"",
   "competition":""
  },
  {
   "name":"",
   "score":80,
   "why_trending":"",
   "pain_signal":"",
   "hidden_signal":"",
   "monetization":"",
   "competition":""
  },
  {
   "name":"",
   "score":80,
   "why_trending":"",
   "pain_signal":"",
   "hidden_signal":"",
   "monetization":"",
   "competition":""
  },
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

      // 🔥 THIS FIXES SAME RESULT ISSUE
      temperature:1.1,
      top_p:0.95,

      response_format:{ type:"json_object" },

      messages:[{ role:"user", content:prompt }]

    });

    const parsed = JSON.parse(completion.choices[0].message.content!);

    // 🔥 SAFETY FIX (prevents undefined UI issues)
    parsed.name = parsed.name || idea || "Opportunity";

    return Response.json(parsed);

  } catch(err){

    console.log("ORACLE ERROR:", err);

    return Response.json({ error:"oracle failed" });

  }

}