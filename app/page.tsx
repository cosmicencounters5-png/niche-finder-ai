"use client";

import { useState, useEffect } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);

  const [scanStep,setScanStep]=useState("");
  const [reveal,setReveal]=useState(false);
  const [typedText,setTypedText]=useState("");
  const [unlocked,setUnlocked]=useState(false);
  const [uses,setUses]=useState(0);

  /* ---------- INIT ---------- */

  useEffect(()=>{

    const savedUses = Number(localStorage.getItem("oraclex_uses") || 0);
    setUses(savedUses);

    const savedUnlock = localStorage.getItem("oraclex_unlock");
    if(savedUnlock==="true") setUnlocked(true);

  },[]);

  /* ---------- TYPEWRITER ---------- */

  useEffect(()=>{

    if(!data?.name) return;

    let i=0;
    setTypedText("");

    const interval=setInterval(()=>{

      setTypedText(prev=>prev+data.name[i]);
      i++;

      if(i>=data.name.length) clearInterval(interval);

    },25);

    return ()=>clearInterval(interval);

  },[data]);

  /* ---------- ANALYZE ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setReveal(false);
    setData(null);

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    const json=await res.json();
    setData(json);

    const newUses=uses+1;
    setUses(newUses);
    localStorage.setItem("oraclex_uses",String(newUses));

    setLoading(false);
    setReveal(true);

  };

  /* ---------- RADAR ---------- */

  const radar=async()=>{

    setLoading(true);
    setReveal(false);
    setData(null);

    const res=await fetch("/api/analyze",{ method:"POST" });

    const json=await res.json();

    setData(json);
    setLoading(false);
    setReveal(true);

  };

  /* ---------- PAYMENT ---------- */

  const unlockBlueprint = () => {

    window.location.href="https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

  };

  const blueprintLocked=!unlocked && uses>=3;

  /* ---------- UI ---------- */

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">⚫ Oracle X</h1>

        <p className="text-center text-xs opacity-60">
          {Math.max(0,3-uses)} free scans remaining
        </p>

        <textarea
          className="w-full p-4 bg-zinc-900 rounded-lg"
          placeholder="Describe your business idea..."
          value={idea}
          onChange={(e)=>setIdea(e.target.value)}
        />

        <button onClick={analyze} className="w-full bg-white text-black py-3 rounded-lg">
          Analyze Idea
        </button>

        <button onClick={radar} className="w-full border py-3 rounded-lg">
          Scan Emerging Niches
        </button>

        {loading && <p>Scanning...</p>}

        {(reveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-green-400">🔥 {typedText}</h2>

            {blueprintLocked ? (

              <div>

                <p>🔒 Monetization Blueprint locked</p>

                <button onClick={unlockBlueprint} className="bg-green-500 text-black w-full py-3 rounded-lg">
                  Unlock Revenue Plan ⚡
                </button>

              </div>

            ) : (

              <div>

                <p><strong>Product:</strong> {data.first_product}</p>
                <p><strong>Price:</strong> {data.price}</p>
                <p><strong>Where:</strong> {data.where_to_sell}</p>
                <p><strong>Traffic:</strong> {data.traffic_source}</p>

              </div>

            )}

          </div>

        )}

        {(reveal && data?.mode==="radar") && data.niches?.map((n:any,i:number)=>(

          <div key={i} className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-green-400">🔥 {n.name}</h2>
            <p>{n.why_trending}</p>

          </div>

        ))}

      </div>

    </main>

  );

}