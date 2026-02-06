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
  const [showBlueprint,setShowBlueprint]=useState(false);

  const [unlocked,setUnlocked]=useState(false);
  const [liveUsers,setLiveUsers]=useState(10);

  const recentScans = [
    "AI cold email automation",
    "Faceless YouTube channels",
    "TikTok digital products",
    "Shopify micro niche tools",
    "Local lead generation AI"
  ];

  /* ---------- AUTO UNLOCK ---------- */

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search);

    if(params.get("unlock")==="true"){
      setUnlocked(true);
      localStorage.setItem("oraclex_unlock","true");
      window.history.replaceState({},document.title,"/");
    }

    if(localStorage.getItem("oraclex_unlock")==="true"){
      setUnlocked(true);
    }

  },[]);

  /* ---------- LIVE USERS ---------- */

  useEffect(()=>{

    const interval = setInterval(()=>{

      setLiveUsers(prev=>{
        const change=Math.floor(Math.random()*3)-1;
        return Math.max(8,prev+change);
      });

    },3000);

    return ()=>clearInterval(interval);

  },[]);

  /* ---------- SCAN FEED ---------- */

  const scanMessages=[
    "Oracle X scanning live market signals...",
    "Tracking buyer intent patterns...",
    "Mapping competition gaps...",
    "Detecting hidden profit signals...",
    "Calculating success probability...",
    "Oracle X intelligence ready."
  ];

  const runScanAnimation=()=>{

    let i=0;

    const interval=setInterval(()=>{

      setScanStep(scanMessages[i]);
      i++;

      if(i>=scanMessages.length){
        clearInterval(interval);
      }

    },600);

  };

  /* ---------- TYPEWRITER ---------- */

  useEffect(()=>{

    if(!data?.name) return;

    let i=0;
    setTypedText("");

    const interval=setInterval(()=>{

      setTypedText(prev=>prev+data.name[i]);
      i++;

      if(i>=data.name.length){
        clearInterval(interval);
      }

    },25);

    return()=>clearInterval(interval);

  },[data]);

  /* ---------- DOPAMINE DELAY ---------- */

  useEffect(()=>{

    if(reveal){
      setTimeout(()=>setShowBlueprint(true),700);
    }

  },[reveal]);

  /* ---------- ANALYZE IDEA ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setReveal(false);
    setShowBlueprint(false);
    setData(null);
    setSelected(null);

    runScanAnimation();

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    const json=await res.json();

    setData(json);

    setTimeout(()=>{
      setReveal(true);
      setLoading(false);
    },900);

  };

  /* ---------- RADAR SCAN (FIXED) ---------- */

  const radar=async()=>{

    setLoading(true);
    setReveal(false);
    setShowBlueprint(false);
    setData(null);
    setSelected(null);

    runScanAnimation();

    const res=await fetch("/api/analyze",{ method:"POST" });

    const json=await res.json();

    setData(json);

    setTimeout(()=>{
      setReveal(true);
      setLoading(false);
    },900);

  };

  /* ---------- DEEP SCAN ---------- */

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

  /* ---------- STRIPE ---------- */

  const unlockBlueprint=()=>{

    window.location.href="https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

  };

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ⚫ Oracle X
        </h1>

        <p className="text-center text-xs text-green-400 animate-pulse">
          🔥 {liveUsers} founders scanning opportunities right now
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

        {/* 🔥 SCAN BUTTON IS BACK */}
        <button onClick={radar} className="w-full border py-3 rounded-lg">
          Scan Emerging Niches
        </button>

        {loading && (

          <div className="bg-zinc-900 p-6 rounded-xl animate-pulse">
            ⚫ {scanStep}
          </div>

        )}

        {/* IDEA RESULT */}

        {(reveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-green-400">🔥 {typedText}</h2>

            <p>Opportunity Score: {data.score}/100</p>

            {showBlueprint && (

              unlocked ? (

                <div>

                  <p><strong>Product:</strong> {data.first_product}</p>
                  <p><strong>Price:</strong> {data.price}</p>
                  <p><strong>Where:</strong> {data.where_to_sell}</p>
                  <p><strong>Traffic:</strong> {data.traffic_source}</p>

                </div>

              ) : (

                <div>

                  <p className="opacity-60">🔒 Monetization Blueprint locked</p>

                  <button onClick={unlockBlueprint} className="w-full bg-green-500 text-black py-3 rounded-lg">
                    Unlock Revenue Plan ⚡
                  </button>

                </div>

              )

            )}

          </div>

        )}

        {/* RADAR RESULT FIXED */}

        {(reveal && data?.mode==="radar") && data.niches.map((n:any,i:number)=>(

          <div key={i}
            onClick={()=>deepScan(n.name,i)}
            className="bg-zinc-900 p-6 rounded-xl cursor-pointer">

            <h2 className="text-green-400">🔥 {n.name}</h2>
            <p>Score: {n.score}/100</p>
            <p>{n.why_trending}</p>

            {selected===i && (

              <div className="mt-4 border-t pt-4">

                {!deepData && <p>⚫ Oracle X deep analysis...</p>}

                {deepData && (

                  <>
                    <p><strong>Execution:</strong> {deepData.execution}</p>
                    <p><strong>Traffic:</strong> {deepData.traffic}</p>
                    <p><strong>Monetization:</strong> {deepData.monetization}</p>
                  </>

                )}

              </div>

            )}

          </div>

        ))}

        {/* FOMO FEED */}

        <div className="text-xs opacity-50 space-y-1">

          {recentScans.map((s,i)=>(
            <p key={i}>🔥 Someone just scanned: {s}</p>
          ))}

        </div>

      </div>

    </main>

  );

}