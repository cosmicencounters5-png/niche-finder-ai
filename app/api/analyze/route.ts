const analyze = async () => {

  if(!idea) return;

  setLoading(true);

  try{

    const res = await fetch("/api/analyze",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ idea })
    });

    const json = await res.json();

    console.log("API RESPONSE:", json);

    setData(json);

  }catch(err){

    console.log("frontend error",err);

  }

  setLoading(false);

};