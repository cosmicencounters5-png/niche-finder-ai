"use client";

import { useState, useEffect } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);
  const [deepData,setDeepData]=useState<any>(null);
  const [selected,setSelected]=useState<number|null>(null);

  const [scanStep,setScanStep]=useState("");
  const [reveal,setReveal]=useState(false);

  const [typedText,setTypedText]=useState("");

  /* ---------- GOD MODE SCAN FEED ---------- */

  const scanMessages = [
    "Initializing shadow intelligence...",
    "Scanning Reddit signals...",
    "Tracking buyer intent...",
    "Mapping competition gaps...",
    "Calculating monetization vectors...",
    "Oracle ready..."
  ];

  const runScanAnimation = () => {

    let i = 0;

    const interval = setInterval(()=>{

      setScanStep(scanMessages[i]);
      i++;

      if(i >= scanMessages.length){

        clearInterval(interval);

      }

    },600);

  };

  /* ---------- TYPEWRITER EFFECT ---------- */

  useEffect(()=>{

    if(!data?.name) return;

    let i = 0;
    setTypedText("");

    const interval = setInterval(()=>{

      setTypedText(prev => prev + data.name[i]);
      i++;

      if(i >= data.name.length){
        clearInterval(interval);
      }

    },30);

    return ()=>clearInterval(interval);

  },[data]);

  /* ---------- ANALYZE IDEA ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setReveal(false);
    setData(null);
    setSelected(null);

    runScanAnimation();

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    const json = await res.json();

    setData(json);

    setTimeout(()=>{
      setReveal(true);
      setLoading(false);
    },900);

  };

  /* ---------- RADAR ---------- */

  const radar=async()=>{

    setLoading(true);
    setReveal(false);
    setData(null);
    setSelected(null);

    runScanAnimation();

    const res=await fetch("/api/analyze",{ method:"POST" });

    const json = await res.json();

    setData(json);

    setTimeout(()=>{
      setReveal(true);
      setLoading(false);
    },900);

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

        <h1 className="text-3xl font-bold text-center tracking-wide">
          ⚫ Shadow God Engine
        </h1>

        <textarea
          className="w-full p-4 bg-zinc-900 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Describe your business idea..."
          value={idea}
          onChange={(e)=>setIdea(e.target.value)}
        />

        <button
          onClick={analyze}
          className="w-full bg-white text-black py-3 rounded-lg hover:scale-[1.02] transition"
        >
          Analyze Idea
        </button>

        <button
          onClick={radar}
          className="w-full border py-3 rounded-lg hover:bg-zinc-900 transition"
        >
          Scan Emerging Niches
        </button>

        {/* LIVE SCAN */}

        {loading && (

          <div className="bg-zinc-900 p-6 rounded-xl text-sm font-mono animate-pulse border border-green-500/20">

            ⚫ {scanStep}

          </div>

        )}

        {/* IDEA RESULT */}

        {(reveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4 shadow-lg shadow-green-900/20">

            <h2 className="text-xl font-semibold text-green-400">
              🔥 {typedText}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            <div>

              <p>🔥 Success Probability: {data.success_probability}%</p>

              <div className="w-full h-3 bg-zinc-800 rounded overflow-hidden">

                <div
                  className="h-3 bg-green-500 rounded transition-all duration-1000"
                  style={{ width:`${data.success_probability}%` }}
                />

              </div>

            </div>

            {data.success_probability > 65 && (

              <div className="bg-green-900/30 p-3 rounded-lg text-sm animate-pulse">
                ⚫ EARLY SIGNAL DETECTED — high probability entry window.
              </div>

            )}

            <p>Time to first sale: {data.time_to_first_sale}</p>

            <div className="border-t border-zinc-700 pt-4 space-y-2">

              <h3 className="font-semibold text-lg text-green-400">
                💰 First Money Blueprint
              </h3>

              <p><strong>Product:</strong> {data.first_product}</p>
              <p><strong>Price:</strong> {data.price}</p>
              <p><strong>Where:</strong> {data.where_to_sell}</p>
              <p><strong>Traffic:</strong> {data.traffic_source}</p>

            </div>

          </div>

        )}

        {/* RADAR */}

        {(reveal && data?.mode==="radar") && data.niches.map((n:any,i:number)=>(

          <div
            key={i}
            onClick={()=>deepScan(n.name,i)}
            className="bg-zinc-900 p-6 rounded-xl cursor-pointer hover:scale-[1.01] transition"
          >

            <h2 className="text-green-400">🔥 {n.name}</h2>

            <p>Score: {n.score}/100</p>

            <p>{n.why_trending}</p>

            {selected===i && (

              <div className="mt-4 border-t border-zinc-700 pt-4">

                {!deepData && <p>⚫ Oracle diving deeper...</p>}

                {deepData && (

                  <>
                    <p><strong>Execution:</strong> {deepData.execution}</p>
                    <p><strong>Users:</strong> {deepData.users}</p>
                    <p><strong>Traffic:</strong> {deepData.traffic}</p>
                    <p><strong>Monetization:</strong> {deepData.monetization}</p>
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