"use client";

import { useState } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);

  const [scanStep,setScanStep]=useState("");
  const [showReveal,setShowReveal]=useState(false);
  const [unlock,setUnlock]=useState(false);

  const scanMessages = [
    "Scanning Reddit signals...",
    "Tracking buyer intent...",
    "Mapping competition gaps...",
    "Detecting hidden demand...",
    "Shadow engine computing probability..."
  ];

  const runScanAnimation = () => {

    let i = 0;

    const interval = setInterval(()=>{

      setScanStep(scanMessages[i]);

      i++;

      if(i >= scanMessages.length){

        clearInterval(interval);

      }

    },700);

  };

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setShowReveal(false);
    setData(null);
    setUnlock(false);

    runScanAnimation();

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    const json=await res.json();

    setData(json);

    setTimeout(()=>{

      setShowReveal(true);
      setLoading(false);

    },800);

  };

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ⚫ Oracle Evolution X
        </h1>

        <textarea
          className="w-full p-4 bg-zinc-900 rounded-lg"
          placeholder="Describe your business idea..."
          value={idea}
          onChange={(e)=>setIdea(e.target.value)}
        />

        <button
          onClick={analyze}
          className="w-full bg-white text-black py-3 rounded-lg"
        >
          Analyze Idea
        </button>

        {loading && (

          <div className="bg-zinc-900 p-6 rounded-xl text-sm font-mono animate-pulse">

            ⚫ {scanStep || "Initializing shadow engine..."}

          </div>

        )}

        {(showReveal && data?.name) && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            <p>
              🔥 Success Probability: {data.success_probability}%
            </p>

            {data.success_probability > 65 && (

              <div className="bg-green-900/30 p-3 rounded-lg text-sm">
                ⚫ Shadow Signal detected — You are EARLY.
              </div>

            )}

            {/* HOT PRODUCTS */}

            {data.hot_products?.length > 0 && (

              <div className="space-y-3">

                <p className="font-semibold">🔥 Hot products</p>

                {data.hot_products.map((p:any,i:number)=>(

                  <div key={i} className="bg-zinc-800 p-3 rounded-lg text-sm">

                    <p className="font-semibold">{p.name}</p>
                    <p>{p.why_hot}</p>
                    <p className="opacity-60">Difficulty: {p.difficulty}</p>

                  </div>

                ))}

              </div>

            )}

            {/* LOCKED INTELLIGENCE */}

            {!unlock && (

              <div className="bg-zinc-800 p-6 rounded-xl text-center space-y-3">

                <p className="font-semibold">
                  ⚫ Deep Oracle Intelligence Locked
                </p>

                <ul className="text-sm opacity-80 space-y-1">
                  <li>✔ Exact traffic loopholes</li>
                  <li>✔ Buyer communities</li>
                  <li>✔ First $100 execution plan</li>
                  <li>✔ Hidden monetization angle</li>
                </ul>

                <button
                  onClick={()=>setUnlock(true)}
                  className="mt-3 bg-white text-black px-4 py-2 rounded-lg"
                >
                  Unlock Deep Oracle
                </button>

              </div>

            )}

            {unlock && (

              <div className="bg-zinc-800 p-4 rounded-lg text-sm space-y-1">

                <p><strong>Day 1:</strong> {data.execution?.day1}</p>
                <p><strong>Week 1:</strong> {data.execution?.week1}</p>
                <p><strong>First revenue:</strong> {data.execution?.first_revenue}</p>

              </div>

            )}

          </div>

        )}

      </div>

    </main>

  );

}