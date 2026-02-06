"use client";

import { useState, useEffect } from "react";

export default function Home(){

const [idea,setIdea]=useState("");
const [data,setData]=useState<any>(null);
const [deepData,setDeepData]=useState<any>(null);
const [selected,setSelected]=useState<number|null>(null);

const [loading,setLoading]=useState(false);
const [reveal,setReveal]=useState(false);
const [typedText,setTypedText]=useState("");

const [unlocked,setUnlocked]=useState(false);
const [uses,setUses]=useState(0);

const [scanStep,setScanStep]=useState("");

/* 🔥 OWNER MODE (UNLIMITED FOR YOU) */

const [ownerMode,setOwnerMode]=useState(false);

/* 🔥 ADDICTIVE STATES */

const [liveUsers,setLiveUsers]=useState(12);
const [liveFeed,setLiveFeed]=useState<string[]>([]);

const trendingSearches = [
"AI cold email automation",
"Faceless TikTok channels",
"Shopify micro niche tools",
"Local lead generation AI",
"Digital product bundles",
"AI freelancers",
"Notion templates selling now"
];

/* ---------- INIT ---------- */

useEffect(()=>{

// OWNER CHECK (URL ?owner=1)
const params = new URLSearchParams(window.location.search);
if(params.get("owner")==="1"){
setOwnerMode(true);
}

const savedUses = Number(localStorage.getItem("oraclex_uses")||0);
setUses(savedUses);

if(localStorage.getItem("oraclex_unlock")==="true"){
setUnlocked(true);
}

// fake live users
setInterval(()=>{
setLiveUsers(8 + Math.floor(Math.random()*15));
},4000);

// live feed
setInterval(()=>{

const random = trendingSearches[
Math.floor(Math.random()*trendingSearches.length)
];

setLiveFeed(prev=>[random,...prev.slice(0,4)]);

},2500);

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

/* ---------- SCAN ANIMATION ---------- */

const scanMessages=[
"Oracle X scanning live signals...",
"Tracking buyer intent...",
"Detecting hidden opportunities...",
"Calculating monetization..."
];

const runScanAnimation=()=>{

let i=0;

const interval=setInterval(()=>{

setScanStep(scanMessages[i]);
i++;

if(i>=scanMessages.length) clearInterval(interval);

},600);

};

/* ---------- ANALYZE ---------- */

const analyze=async()=>{

if(!idea) return;

setLoading(true);
setReveal(false);
setData(null);

runScanAnimation();

const res=await fetch("/api/analyze",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ idea })
});

const json=await res.json();
setData(json);

// owner gets unlimited (no count)
if(!ownerMode){

const newUses=uses+1;
setUses(newUses);
localStorage.setItem("oraclex_uses",String(newUses));

}

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
body:JSON.stringify({ deep:true,niche })
});

setDeepData(await res.json());

};

/* ---------- PAYMENT ---------- */

const unlockBlueprint=()=>{

window.location.href="https://buy.stripe.com/cNi6oAga10QI2Z3fVg8k802";

};

const blueprintLocked=!ownerMode && !unlocked && uses>=3;

/* ---------- UI ---------- */

return(

<main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">

<div className="max-w-xl w-full space-y-6">

<h1 className="text-3xl font-bold text-center">⚫ Oracle X</h1>

<p className="text-center text-green-400 text-sm">
🔥 {liveUsers} founders scanning opportunities right now
</p>

{/* owner hides limit */}
{!ownerMode && (

<p className="text-center text-xs opacity-60">
{Math.max(0,3-uses)} free scans remaining
</p>

)}

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

<div className="text-xs opacity-70 space-y-1">
{liveFeed.map((f,i)=>(<p key={i}>🔥 Someone just scanned: {f}</p>))}
</div>

{loading && (
<div className="bg-zinc-900 p-6 rounded-xl animate-pulse">
⚫ {scanStep}
</div>
)}

{(reveal && data?.mode==="idea") && (

<div className="bg-zinc-900 p-6 rounded-xl space-y-4 border border-green-500/20">

<h2 className="text-green-400">🔥 {typedText}</h2>

<p>Opportunity Score: {data.score}/100</p>

<div>
<p>🔥 Profitability Index</p>
<div className="w-full h-3 bg-zinc-800 rounded">
<div className="h-3 bg-green-500"
style={{width:`${data.success_probability}%`}}/>
</div>
</div>

{data.alternative_angles?.map((a:any,i:number)=>(

<div key={i} className="bg-black/40 p-3 rounded">
<p className="text-green-400">{a.name}</p>
<p className="text-xs opacity-60">Difficulty: {a.difficulty}</p>
</div>

))}

{blueprintLocked ? (

<div>

<p className="opacity-60">🔒 Monetization Blueprint locked</p>

<button onClick={unlockBlueprint}
className="w-full bg-green-500 text-black py-3 rounded-lg">
Unlock Revenue Plan ⚡
</button>

</div>

):( 

<div>

<h3 className="text-green-400 font-semibold">💰 First Money Blueprint</h3>

<p>{data.first_product}</p>
<p>{data.price}</p>
<p>{data.where_to_sell}</p>
<p>{data.traffic_source}</p>

</div>

)}

</div>

)}

</div>

</main>

);

}