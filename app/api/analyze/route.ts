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

You are ORACLE X DEEP MARKET ANALYST.

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

    /* ===============================
       🔥 MAIN ENGINE
    =============================== */

    const prompt = idea
    ? `Return JSON { "mode":"idea","name":"","first_product":"","price":"","where_to_sell":"","traffic_source":"" }`
    : `Return JSON {
 "mode":"radar",
 "niches":[
  { "name":"AI cold outreach automation","score":92,"why_trending":"AI automation exploding" },
  { "name":"Local AI lead gen","score":95,"why_trending":"Local business AI demand rising" }
 ]
}`;

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
      mode:"radar",
      niches:[
        { name:"Fallback niche","score":80,"why_trending":"backup data" }
      ]
    });

  }

}