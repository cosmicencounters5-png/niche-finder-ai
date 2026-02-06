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

  const [unlocked,setUnlocked]=useState(false);

  // 🔥 FREE ATTEMPTS
  const [uses,setUses]=useState(0);

  /* ---------- INIT ---------- */

  useEffect(()=>{

    const savedUses = Number(localStorage.getItem("oraclex_uses") || 0);
    setUses(savedUses);

    const savedUnlock = localStorage.getItem("oraclex_unlock");

    if(savedUnlock==="true"){
      setUnlocked(true);
    }

    const params = new URLSearchParams(window.location.search);

    if(params.get("unlock")==="true"){

      setUnlocked(true);
      localStorage.setItem("oraclex_unlock","true");

      window.history.replaceState({},document.title,"/");
    }

  },[]);

  /* ---------- SCAN FEED ---------- */

  const scanMessages = [
    "Oracle X scanning live market signals...",
    "Tracking buyer intent patterns...",
    "Mapping competition gaps...",
    "Detecting hidden profit signals...",
    "Calculating success probability...",
    "Oracle X intelligence ready."
  ];

  const runScanAnimation = () => {

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

    // 🔥 increase usage count
    const newUses = uses + 1;
    setUses(newUses);
    localStorage.setItem("oraclex_uses",String(newUses));

    setTimeout(()=>{
      setReveal(true);
      setLoading(false);
    },900);

  };

  /* ---------- STRIPE ---------- */

  const unlockBlueprint = () => {

    window.location.href="https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

  };

  const blueprintLocked = !unlocked && uses >= 3;

  /* ---------- UI ---------- */

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ⚫ Oracle X
        </h1>

        <p className="text-center text-xs opacity-60">
          {Math.max(0,3-uses)} free scans remaining
        </p>

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

          <div className="bg-zinc-900 p-6 rounded-xl animate-pulse">

            ⚫ {scanStep}

          </div>

        )}

        {(reveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="text-green-400">
              🔥 {typedText}
            </h2>

            <p>Opportunity Score: {data.score}/100</p>

            {showBlueprint && (

              blueprintLocked ? (

                <div>

                  <p className="opacity-60">
                    🔒 Monetization Blueprint locked — upgrade required
                  </p>

                  <button
                    onClick={unlockBlueprint}
                    className="w-full bg-green-500 text-black py-3 rounded-lg"
                  >
                    Unlock Revenue Plan ⚡
                  </button>

                </div>

              ) : (

                <div>

                  <h3 className="text-green-400 font-semibold">
                    💰 First Money Blueprint
                  </h3>

                  <p><strong>Product:</strong> {data.first_product}</p>
                  <p><strong>Price:</strong> {data.price}</p>
                  <p><strong>Where:</strong> {data.where_to_sell}</p>
                  <p><strong>Traffic:</strong> {data.traffic_source}</p>

                </div>

              )

            )}

          </div>

        )}

      </div>

    </main>

  );

}