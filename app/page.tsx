"use client";

import { useState } from "react";

export default function Home(){

  const [idea,setIdea]=useState("");
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(false);

  const [selected,setSelected]=useState<number|null>(null);
  const [deepData,setDeepData]=useState<any>(null);

  const analyze=async()=>{

    setLoading(true);

    const res=await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    setData(await res.json());
    setLoading(false);

  };

  const radar=async()=>{

    setLoading(true);

    const res=await fetch("/api/analyze",{ method:"POST" });

    setData(await res.json());
    setLoading(false);

  };

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

  return(

    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl text-center">⚫ Oracle X</h1>

      <textarea value={idea} onChange={(e)=>setIdea(e.target.value)} />

      <button onClick={analyze}>Analyze Idea</button>

      <button onClick={radar}>Scan Emerging Niches</button>

      {loading && <p>Scanning...</p>}

      {data?.mode==="radar" && data.niches.map((n:any,i:number)=>(

        <div key={i} onClick={()=>deepScan(n.name,i)}>

          <h2>{n.name}</h2>

          {selected===i && (

            <div>

              {!deepData && <p>Deep scanning...</p>}

              {deepData && (

                <>
                  <p>Execution: {deepData.execution}</p>
                  <p>Users: {deepData.users}</p>
                  <p>Traffic: {deepData.traffic}</p>
                  <p>Monetization: {deepData.monetization}</p>
                </>

              )}

            </div>

          )}

        </div>

      ))}

    </main>

  );

}