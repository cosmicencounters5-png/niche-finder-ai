"use client";

import { useState, useEffect } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [loading,setLoading]=useState(false);
  const [data,setData]=useState<any>(null);

  const [scanStep,setScanStep]=useState("");
  const [reveal,setReveal]=useState(false);

  const [typedText,setTypedText]=useState("");
  const [showBlueprint,setShowBlueprint]=useState(false);

  // 🔥 PAYMENT STATE
  const [unlocked,setUnlocked]=useState(false);

  /* ---------- AUTO UNLOCK AFTER STRIPE ---------- */

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search);

    if(params.get("unlock")==="true"){

      setUnlocked(true);

      localStorage.setItem("oraclex_unlock","true");

      // remove query param from url
      window.history.replaceState({},document.title,"/");

    }

    const saved = localStorage.getItem("oraclex_unlock");

    if(saved==="true"){

      setUnlocked(true);

    }

  },[]);

  /* ---------- ORACLE X SCAN FEED ---------- */

  const scanMessages = [
    "Oracle X scanning live market signals...",
    "Tracking buyer intent patterns...",
    "Mapping competition gaps...",
    "Detecting hidden profit signals...",
    "Calculating success probability...",
    "Oracle X intelligence ready."
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

  /* ---------- TYPEWRITER ---------- */

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

    },25);

    return ()=>clearInterval(interval);

  },[data]);

  /* ---------- DOPAMINE DELAY ---------- */

  useEffect(()=>{

    if(reveal){

      setTimeout(()=>{

        setShowBlueprint(true);

      },700);

    }

  },[reveal]);

  /* ---------- ANALYZE ---------- */

  const analyze=async()=>{

    if(!idea) return;

    setLoading(true);
    setReveal(false);
    setShowBlueprint(false);
    setData(null);

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
    setShowBlueprint(false);
    setData(null);

    runScanAnimation();

    const res=await fetch("/api/analyze",{ method:"POST" });

    const json = await res.json();

    setData(json);

    setTimeout(()=>{
      setReveal(true);
      setLoading(false);
    },900);

  };

  /* ---------- STRIPE PAYMENT ---------- */

  const unlockBlueprint = () => {

    window.location.href = "https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

  };

  /* ---------- UI ---------- */

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center tracking-wide">
          ⚫ Oracle X
        </h1>

        <p className="text-center text-sm opacity-60">
          Predict profitable opportunities before they trend.
        </p>

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

        {loading && (

          <div className="bg-zinc-900 p-6 rounded-xl text-sm font-mono animate-pulse border border-green-500/20">

            ⚫ {scanStep}

          </div>

        )}

        {(reveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4 border border-green-500/20 shadow-lg shadow-green-900/20">

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

            {showBlueprint && (

              unlocked ? (

                <div className="border-t border-zinc-700 pt-4 space-y-2 animate-pulse">

                  <h3 className="font-semibold text-lg text-green-400">
                    💰 First Money Blueprint
                  </h3>

                  <p><strong>Product:</strong> {data.first_product}</p>
                  <p><strong>Price:</strong> {data.price}</p>
                  <p><strong>Where:</strong> {data.where_to_sell}</p>
                  <p><strong>Traffic:</strong> {data.traffic_source}</p>

                </div>

              ) : (

                <div className="border-t border-zinc-700 pt-4 space-y-3">

                  <p className="opacity-60">
                    🔒 Monetization Blueprint locked
                  </p>

                  <button
                    onClick={unlockBlueprint}
                    className="w-full bg-green-500 text-black py-3 rounded-lg font-semibold hover:scale-[1.02] transition"
                  >
                    Unlock Revenue Plan ⚡
                  </button>

                </div>

              )

            )}

          </div>

        )}

      </div>

    </main>

  );

}