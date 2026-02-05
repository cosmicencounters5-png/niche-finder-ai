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
    setSelected(null);
    setDeepData(null);

    try{

      const res=await fetch("/api/analyze",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ idea })
      });

      const json = await res.json();

      console.log("ANALYZE RESULT:",json);

      setData(json);

    }catch(err){

      console.log("analyze error",err);

    }

    setLoading(false);

  };

  /* ---------- RADAR ---------- */

  const radar=async()=>{

    setLoading(true);
    setSelected(null);
    setDeepData(null);

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

        {/* ---------- IDEA RESULT ---------- */}

        {(data?.mode==="idea" || data?.name) && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-2">

            <h2 className="text-xl font-semibold">
              🔥 {data.name}
            </h2>

            <p>Score: {data.score}/100</p>

            <p>{data.why_trending}</p>

            <p><strong>Pain signal:</strong> {data.pain_signal}</p>

            <p><strong>Hidden opportunity:</strong> {data.hidden_signal}</p>

            <p><strong>Monetization:</strong> {data.monetization}</p>

            <p><strong>Competition:</strong> {data.competition}</p>

          </div>

        )}

        {/* ---------- RADAR RESULTS ---------- */}

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

                {!deepData && <p>AI diving deeper...</p>}

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