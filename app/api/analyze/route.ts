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

      let marketSignals:string[]=[];

      try{

        const reddit = await fetch(
          `https://www.reddit.com/search.json?q=${encodeURIComponent(niche)}&limit=10`
        );

        const json = await reddit.json();

        if(json?.data?.children){

          marketSignals = json.data.children.map(
            (p:any)=>p.data.title
          );

        }

      }catch(e){
        console.log("reddit fetch failed");
      }

      const completion = await openai.chat.completions.create({

        model:"gpt-4o-mini",

        response_format:{ type:"json_object" },

        messages:[{
          role:"user",
          content:`

Niche:

${niche}

Market signals:

${marketSignals.join("\n")}

Return ONLY JSON:

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

      const content = completion.choices[0].message.content;

      return Response.json(JSON.parse(content!));

    }

    /* ---------- NORMAL MODE ---------- */

    const subs = ["startups","Entrepreneur","sideproject"];

    let titles:string[]=[];

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

      }catch(e){
        console.log("subreddit fail:",sub);
      }

    }

    const prompt = idea
    ? `
Idea:

${idea}

Trending:

${titles.join("\n")}

Return JSON:

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

Return JSON:

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

  } catch(err){

    console.log(err);

    return Response.json({
      error:"oracle failed"
    });

  }

}