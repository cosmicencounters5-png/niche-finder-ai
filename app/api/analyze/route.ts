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

    /* ---------- DEEP ORACLE ---------- */

    if(deep){

      const completion = await openai.chat.completions.create({

        model:"gpt-4o-mini",
        response_format:{ type:"json_object" },

        messages:[{
          role:"user",
          content:`

You are Oracle X Deep Analyzer.

Niche:

${niche}

Return JSON:

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

    /* ---------- MAIN ORACLE ---------- */

    const prompt = idea
      ? `
You are Oracle X addictive business analyzer.

User idea:

${idea}

Return MULTIPLE opportunities.

Return STRICT JSON:

{
 "mode":"idea",

 "name":"",

 "score":85,
 "success_probability":70,

 "alternative_angles":[
   { "name":"", "difficulty":"low/medium/high" },
   { "name":"", "difficulty":"low/medium/high" },
   { "name":"", "difficulty":"low/medium/high" }
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

Return EXACTLY 6 VERY DIFFERENT niches.

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

    console.log("ORACLE ERROR:", err);

    return Response.json({ error:"oracle failed" });

  }

}