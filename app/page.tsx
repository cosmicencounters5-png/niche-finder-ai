"use client";

import { useState, useEffect } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);
  const [deepData,setDeepData]=useState<any>(null);
  const [selected,setSelected]=useState<number|null>(null);

  const [scanStep,setScanStep]=useState("");
  const [showReveal,setShowReveal]=useState(false);

  /* ---------- WAR MODE SCANNING ---------- */

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

  /* ---------- ANALYZE IDEA ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setShowReveal(false);
    setSelected(null);
    setDeepData(null);
    setData(null);

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

  /* ---------- RADAR ---------- */

  const radar=async()=>{

    setLoading(true);
    setShowReveal(false);
    setSelected(null);
    setDeepData(null);

    runScanAnimation();

    const res=await fetch("/api/analyze",{ method:"POST" });

    setData(await res.json());

    setTimeout(()=>{

      setLoading(false);
      setShowReveal(true);

    },800);

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

        <button
          onClick={radar}
          className="w-full border py-3 rounded-lg"
        >
          Scan Emerging Niches
        </button>

        {loading && (

          <div className="bg-zinc-900 p-6 rounded-xl text-sm font-mono animate-pulse">

            ⚫ {scanStep || "Initializing shadow engine..."}

          </div>

        )}

        {/* ---------- IDEA RESULT ---------- */}

        {(showReveal && (data?.mode==="idea" || data?.name)) && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            {/* SUCCESS METER */}

            <div>

              <p className="mb-1">
                🔥 Success Probability: {data.success_probability}%
              </p>

              <div className="w-full h-3 bg-zinc-800 rounded">

                <div
                  className="h-3 bg-green-500 rounded transition-all duration-700"
                  style={{ width:`${data.success_probability}%` }}
                />

              </div>

            </div>

            {data.success_probability > 65 && (

              <div className="bg-green-900/30 p-3 rounded-lg text-sm">

                ⚫ Shadow Signal detected — You are EARLY in this niche.

              </div>

            )}

            <p>Time to first sale: {data.time_to_first_sale}</p>

            <p>Market heat: {data.market_heat}</p>
            <p>Buyer intent: {data.buyer_intent}</p>

            <p>{data.why_trending}</p>

            <p><strong>Pain:</strong> {data.pain_signal}</p>

            <p><strong>Hidden opportunity:</strong> {data.hidden_signal}</p>

            <div className="border-t border-zinc-700 pt-3 space-y-1">

              <p className="font-semibold">Execution Plan</p>

              <p>Day 1: {data.execution?.day1}</p>
              <p>Week 1: {data.execution?.week1}</p>
              <p>First revenue: {data.execution?.first_revenue}</p>

            </div>

            <p><strong>Monetization:</strong> {data.monetization}</p>
            <p><strong>Competition:</strong> {data.competition}</p>

          </div>

        )}

        {/* ---------- RADAR ---------- */}

        {(showReveal && data?.mode==="radar") && data.niches.map((n:any,i:number)=>(

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

                {!deepData && <p>⚫ Shadow Oracle diving deeper...</p>}

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