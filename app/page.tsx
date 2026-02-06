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

  /* ---------- AUTO UNLOCK AFTER STRIPE ---------- */

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

  /* ---------- STRIPE ---------- */

  const unlockBlueprint = () => {

    window.location.href = "https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

  };

  /* ---------- VIRAL SHARE ---------- */

  const shareTwitter = () => {

    const text = encodeURIComponent(
      `Oracle X predicted a ${data.score}/100 opportunity before it trends 🔥`
    );

    window.open(`https://twitter.com/intent/tweet?text=${text}`);

  };

  /* ---------- REDDIT DOMINATION MODE ---------- */

  const launchReddit = () => {

    const title = encodeURIComponent(
      `I built an AI that predicts profitable niches before they trend — got ${data.score}/100 score`
    );

    const body = encodeURIComponent(
`Been experimenting with Oracle X — an AI that scans market signals and predicts early opportunities.

My idea scored ${data.score}/100 with ${data.success_probability}% success probability.

Curious what you think.

👉 ${window.location.href}`
    );

    window.open(
      `https://www.reddit.com/r/startups/submit?title=${title}&text=${body}`
    );

  };

  /* ---------- UI ---------- */

  return(

    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6">

        <h1 className="text-3xl font-bold text-center">
          ⚫ Oracle X
        </h1>

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

            <p>🔥 Success Probability: {data.success_probability}%</p>

            {showBlueprint && (

              unlocked ? (

                <div className="border-t pt-4">

                  <p><strong>Product:</strong> {data.first_product}</p>
                  <p><strong>Price:</strong> {data.price}</p>
                  <p><strong>Where:</strong> {data.where_to_sell}</p>
                  <p><strong>Traffic:</strong> {data.traffic_source}</p>

                </div>

              ) : (

                <button onClick={unlockBlueprint} className="w-full bg-green-500 text-black py-3 rounded-lg">
                  Unlock Revenue Plan ⚡
                </button>

              )

            )}

            {/* 🔥 REDDIT VIRAL ENGINE */}

            <button
              onClick={launchReddit}
              className="w-full border py-3 rounded-lg hover:bg-zinc-800"
            >
              🚀 Launch this on Reddit
            </button>

            <button
              onClick={shareTwitter}
              className="w-full border py-3 rounded-lg hover:bg-zinc-800"
            >
              Share on X
            </button>

          </div>

        )}

      </div>

    </main>

  );

}