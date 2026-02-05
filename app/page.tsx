"use client";

import { useState } from "react";

export default function Home(){

  const [idea,setIdea] = useState("");
  const [loading,setLoading] = useState(false);
  const [data,setData] = useState<any>(null);
  const [selected,setSelected] = useState<number|null>(null);

  const analyze = async () => {

    setLoading(true);

    const res = await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    setData(await res.json());

    setLoading(false);

  };

  const radar = async () => {

    setLoading(true);

    const res = await fetch("/api/analyze",{ method:"POST" });

    setData(await res.json());

    setLoading(false);

  };

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          🔥 Ultimate Niche Engine
        </h1>

        <textarea
          className="w-full p-4 bg-zinc-900 rounded-lg"
          placeholder="Enter your idea..."
          value={idea}
          onChange={(e)=>setIdea(e.target.value)}
        />

        <button
          onClick={analyze}
          className="w-full bg-white text-black py-3 rounded-lg"
        >
          Analyze Idea
        </button>

        <button
          onClick={radar}
          className="w-full border py-3 rounded-lg"
        >
          Scan Emerging Niches
        </button>

        {loading && <p>Scanning internet...</p>}

        {/* IDEA RESULT */}

        {data?.mode==="idea" && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-2">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            <p>{data.why_trending}</p>
            <p>{data.pain_signal}</p>
            <p>{data.hidden_signal}</p>
            <p>{data.monetization}</p>
            <p>{data.competition}</p>

          </div>

        )}

        {/* RADAR RESULTS */}

        {data?.mode==="radar" && data.niches.map((n:any,i:number)=>(

          <div
            key={i}
            onClick={()=>setSelected(selected===i?null:i)}
            className="bg-zinc-900 p-6 rounded-xl space-y-2 cursor-pointer transition hover:bg-zinc-800"
          >

            <h2 className="text-xl font-semibold">
              🔥 {n.name}
            </h2>

            <p>Score: {n.score}/100</p>

            <p>{n.why_trending}</p>

            {/* EXPANDED DEEP STRATEGY */}

            {selected===i && (

              <div className="mt-4 pt-4 border-t border-zinc-700 space-y-2">

                <p><strong>Pain signal:</strong> {n.pain_signal}</p>

                <p><strong>Hidden opportunity:</strong> {n.hidden_signal}</p>

                <p><strong>Monetization:</strong> {n.monetization}</p>

                <p><strong>Competition:</strong> {n.competition}</p>

                <p className="text-green-400">
                  👉 Strategy hint: Build fast MVP and test via niche communities.
                </p>

              </div>

            )}

          </div>

        ))}

      </div>

    </main>

  );

}