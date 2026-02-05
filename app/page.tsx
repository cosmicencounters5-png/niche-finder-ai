"use client";

import { useState } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);
  const [deepData,setDeepData]=useState<any>(null);
  const [selected,setSelected]=useState<number|null>(null);

  /* ---------- ANALYZE IDEA ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setData(null);
    setSelected(null);

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    setData(await res.json());
    setLoading(false);
  };

  /* ---------- SCAN RADAR ---------- */

  const radar=async()=>{

    setLoading(true);
    setData(null);
    setSelected(null);

    const res=await fetch("/api/analyze",{ method:"POST" });

    setData(await res.json());
    setLoading(false);
  };

  /* ---------- DEEP ORACLE ---------- */

  const deepScan=async(niche:string,index:number)=>{

    setSelected(index);
    setDeepData(null);

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        deep:true,
        niche
      })
    });

    setDeepData(await res.json());
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

        {/* ✅ SCAN KNAPP ER TILBAKE */}
        <button
          onClick={radar}
          className="w-full border py-3 rounded-lg"
        >
          Scan Emerging Niches
        </button>

        {loading && (
          <div className="bg-zinc-900 p-6 rounded-xl animate-pulse text-sm">
            ⚫ Shadow engine scanning live markets...
          </div>
        )}

        {/* ======================
           IDEA RESULT
        ====================== */}

        {data?.mode==="idea" && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            <div>
              <p>🔥 Success Probability: {data.success_probability}%</p>
              <div className="w-full h-3 bg-zinc-800 rounded">
                <div
                  className="h-3 bg-green-500 rounded"
                  style={{ width:`${data.success_probability}%` }}
                />
              </div>
            </div>

            <p>Time to first sale: {data.time_to_first_sale}</p>
            <p>Market heat: {data.market_heat}</p>
            <p>Buyer intent: {data.buyer_intent}</p>

            {/* MONEY SECTION */}

            <div className="border-t border-zinc-700 pt-4 space-y-2">

              <h3 className="font-semibold">💰 First Money Blueprint</h3>

              <p><strong>First Product:</strong> {data.first_product}</p>
              <p><strong>Price:</strong> {data.price}</p>
              <p><strong>Where to sell:</strong> {data.where_to_sell}</p>
              <p><strong>Traffic source:</strong> {data.traffic_source}</p>

            </div>

            {/* HOT PRODUCTS */}

            {data.hot_products && (

              <div className="border-t border-zinc-700 pt-4">

                <h3 className="font-semibold">🔥 Hot Products</h3>

                {data.hot_products.map((p:any,i:number)=>(

                  <div key={i} className="mb-3">

                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm opacity-70">{p.why_hot}</p>
                    <p className="text-xs opacity-50">Difficulty: {p.difficulty}</p>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}

        {/* ======================
           RADAR RESULT
        ====================== */}

        {data?.mode==="radar" && data.niches.map((n:any,i:number)=>(

          <div
            key={i}
            onClick={()=>deepScan(n.name,i)}
            className="bg-zinc-900 p-6 rounded-xl space-y-2 cursor-pointer hover:bg-zinc-800"
          >

            <h2>🔥 {n.name}</h2>

            <p>Score: {n.score}/100</p>

            <p>{n.why_trending}</p>

            {selected===i && (

              <div className="mt-4 border-t border-zinc-700 pt-4 space-y-2">

                {!deepData && <p>⚫ Deep oracle scanning...</p>}

                {deepData && (

                  <>
                    <p><strong>Execution:</strong> {deepData.execution}</p>
                    <p><strong>Users:</strong> {deepData.users}</p>
                    <p><strong>Traffic:</strong> {deepData.traffic}</p>
                    <p><strong>Monetization:</strong> {deepData.monetization}</p>
                    <p><strong>Hidden angle:</strong> {deepData.hidden_angle}</p>
                    <p><strong>Risk:</strong> {deepData.risk}</p>
                  </>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

    </main>

  );

}