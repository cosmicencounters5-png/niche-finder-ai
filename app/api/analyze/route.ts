import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req:Request){

  const body = await req.json().catch(()=>({}));

  const idea = body.idea;
  const deep = body.deep;
  const niche = body.niche;

  /* ---------- DEEP INTELLIGENCE MODE ---------- */

  if(deep){

    const completion = await openai.chat.completions.create({

      model:"gpt-4o-mini",

      response_format:{ type:"json_object" },

      messages:[{

        role:"user",
        content:`

Niche:

${niche}

Generate deep execution intelligence.

Return:

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

  /* ---------- RADAR / IDEA MODE ---------- */

  const subs = ["startups","Entrepreneur","sideproject","SaaS","ChatGPT"];

  let titles:string[]=[];

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

  const prompt = idea
  ? `
User idea:

${idea}

Trending signals:

${titles.join("\n")}

Return:

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

Return:

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