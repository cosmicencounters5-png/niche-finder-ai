"use client";

import { useState } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);
  const [deepData,setDeepData]=useState<any>(null);
  const [selected,setSelected]=useState<number|null>(null);

  const [scanStep,setScanStep]=useState("");
  const [showReveal,setShowReveal]=useState(false);
  const [unlock,setUnlock]=useState(false);

  const scanMessages=[
    "Scanning Reddit signals...",
    "Tracking buyer intent...",
    "Mapping competition gaps...",
    "Detecting hidden demand...",
    "Shadow engine computing probability..."
  ];

  const runScanAnimation=()=>{

    let i=0;

    const interval=setInterval(()=>{

      setScanStep(scanMessages[i]);
      i++;

      if(i>=scanMessages.length){
        clearInterval(interval);
      }

    },700);

  };

  /* ---------- ANALYZE IDEA ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setData(null);
    setUnlock(false);
    setSelected(null);
    setDeepData(null);
    setShowReveal(false);

    runScanAnimation();

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    setData(await res.json());

    setTimeout(()=>{
      setLoading(false);
      setShowReveal(true);
    },800);

  };

  /* ---------- RADAR MODE ---------- */

  const radar=async()=>{

    setLoading(true);
    setData(null);
    setSelected(null);
    setDeepData(null);
    setShowReveal(false);

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

        {(showReveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            <p>🔥 Success Probability: {data.success_probability}%</p>

            {data.hot_products?.map((p:any,i:number)=>(

              <div key={i} className="bg-zinc-800 p-3 rounded-lg text-sm">

                <p className="font-semibold">{p.name}</p>
                <p>{p.why_hot}</p>
                <p className="opacity-60">Difficulty: {p.difficulty}</p>

              </div>

            ))}

            {!unlock && (

              <div className="bg-zinc-800 p-6 rounded-xl text-center space-y-3">

                <p className="font-semibold">
                  ⚫ Deep Oracle Intelligence Locked
                </p>

                <button
                  onClick={()=>setUnlock(true)}
                  className="bg-white text-black px-4 py-2 rounded-lg"
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

        {/* ---------- RADAR RESULTS ---------- */}

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