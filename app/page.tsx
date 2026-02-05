"use client";

import { useState } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setData(null);

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    setData(await res.json());
    setLoading(false);
  };

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ⚫ Shadow Monetization Engine
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
          <div className="bg-zinc-900 p-6 rounded-xl animate-pulse text-sm">
            ⚫ Shadow engine calculating fastest money path...
          </div>
        )}

        {/* RESULT */}

        {data?.mode==="idea" && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            {/* SUCCESS BAR */}

            <div>
              <p>🔥 Success Probability: {data.success_probability}%</p>

              <div className="w-full h-3 bg-zinc-800 rounded">
                <div
                  className="h-3 bg-green-500 rounded transition-all duration-700"
                  style={{ width:`${data.success_probability}%` }}
                />
              </div>
            </div>

            <p>Time to first sale: {data.time_to_first_sale}</p>
            <p>Market heat: {data.market_heat}</p>
            <p>Buyer intent: {data.buyer_intent}</p>

            {/* 🔥 MONEY MACHINE SECTION */}

            <div className="border-t border-zinc-700 pt-4 space-y-2">

              <h3 className="font-semibold text-lg">
                💰 First Money Blueprint
              </h3>

              <p><strong>First Product:</strong> {data.first_product}</p>
              <p><strong>Suggested Price:</strong> {data.price}</p>
              <p><strong>Where to Sell:</strong> {data.where_to_sell}</p>
              <p><strong>Traffic Source:</strong> {data.traffic_source}</p>

            </div>

            {/* HOT PRODUCTS */}

            {data.hot_products && (

              <div className="border-t border-zinc-700 pt-4">

                <h3 className="font-semibold mb-2">
                  🔥 Hot Products Inside This Niche
                </h3>

                {data.hot_products.map((p:any,i:number)=>(

                  <div key={i} className="mb-3">

                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm opacity-70">{p.why_hot}</p>
                    <p className="text-xs opacity-50">Difficulty: {p.difficulty}</p>

                  </div>

                ))}

              </div>

            )}

            {/* EXECUTION */}

            <div className="border-t border-zinc-700 pt-4">

              <h3 className="font-semibold mb-2">
                ⚡ Execution Plan
              </h3>

              <p>Day 1: {data.execution?.day1}</p>
              <p>Week 1: {data.execution?.week1}</p>
              <p>First Revenue: {data.execution?.first_revenue}</p>

            </div>

          </div>

        )}

      </div>

    </main>

  );

}