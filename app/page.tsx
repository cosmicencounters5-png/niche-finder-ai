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

  // 🔥 FAKE LIVE USERS
  const [liveUsers,setLiveUsers]=useState(12);

  // 🔥 RECENT FEED
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

  /* ---------- LIVE USERS COUNTER ---------- */

  useEffect(()=>{

    const interval = setInterval(()=>{

      setLiveUsers(prev => {

        const change = Math.floor(Math.random()*3)-1;
        return Math.max(8, prev + change);

      });

    },3000);

    return ()=>clearInterval(interval);

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

  const unlockBlueprint = () => {

    window.location.href = "https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

  };

  const launchReddit = () => {

    const title = encodeURIComponent(
      `I built an AI that predicts profitable niches before they trend`
    );

    const body = encodeURIComponent(
`Oracle X just scored my idea ${data.score}/100.

Curious what founders think.

${window.location.href}`
    );

    window.open(
      `https://www.reddit.com/r/startups/submit?title=${title}&text=${body}`
    );

  };

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ⚫ Oracle X
        </h1>

        {/* LIVE SOCIAL PROOF */}
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

        {loading && (

          <div className="bg-zinc-900 p-6 rounded-xl animate-pulse">
            ⚫ {scanStep}
          </div>

        )}

        {(reveal && data?.mode==="idea") && (

          <div className="bg-zinc-900 p-6 rounded-xl space-y-4 border border-green-500/20">

            <h2 className="text-green-400">🔥 {typedText}</h2>

            <p>Opportunity Score: {data.score}/100</p>

            {showBlueprint && (

              unlocked ? (

                <div className="border-t pt-4">

                  <p><strong>Product:</strong> {data.first_product}</p>
                  <p><strong>Price:</strong> {data.price}</p>
                  <p><strong>Where:</strong> {data.where_to_sell}</p>
                  <p><strong>Traffic:</strong> {data.traffic_source}</p>

                </div>

              ) : (

                <div className="space-y-3">

                  <p className="text-sm opacity-70">
                    🔒 Monetization Blueprint locked
                  </p>

                  <button
                    onClick={unlockBlueprint}
                    className="w-full bg-green-500 text-black py-3 rounded-lg"
                  >
                    Unlock Revenue Plan ⚡
                  </button>

                  <p className="text-xs text-red-400">
                    ⚠ Early access price ending soon
                  </p>

                </div>

              )

            )}

            <button onClick={launchReddit} className="w-full border py-3 rounded-lg">
              🚀 Launch this on Reddit
            </button>

          </div>

        )}

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