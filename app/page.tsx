"use client";

import { useState } from "react";

export default function Home(){

  const [loading,setLoading] = useState(false);
  const [data,setData] = useState<any>(null);

  const scan = async () => {

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

        <button
          onClick={scan}
          className="w-full bg-white text-black py-3 rounded-lg"
        >
          {loading ? "Scanning internet..." : "Scan Live Trends"}
        </button>

        {data?.niches?.map((n:any,i:number)=>(

          <div key={i} className="bg-zinc-900 p-6 rounded-xl space-y-2">

            <h2 className="text-xl font-semibold">
              🔥 {n.name}
            </h2>

            <p className="text-lg font-bold">
              Opportunity Score: {n.score}/100
            </p>

            <p>Confidence: {n.confidence}</p>

            <p><strong>Why trending:</strong> {n.why_trending}</p>

            <p><strong>Pain signal:</strong> {n.pain_signal}</p>

            <p><strong>Hidden signal:</strong> {n.hidden_signal}</p>

            <p><strong>Competition:</strong> {n.competition}</p>

            <p><strong>Monetization:</strong> {n.monetization}</p>

            <p><strong>Speed to build:</strong> {n.speed_to_build}</p>

          </div>

        ))}

      </div>

    </main>

  );

}