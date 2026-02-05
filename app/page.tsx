"use client";

import { useState, useEffect } from "react";

export default function Home() {

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const [data, setData] = useState<any>(null);
  const [displayScore, setDisplayScore] = useState(0);

  /* ---------------- DARK MODE ---------------- */

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  /* ---------------- SCORE ANIMATION ---------------- */

  useEffect(() => {

    if (!data?.score) return;

    let n = 0;

    const interval = setInterval(() => {

      n++;
      setDisplayScore(n);

      if (n >= data.score) {
        clearInterval(interval);
      }

    }, 20);

    return () => clearInterval(interval);

  }, [data]);

  /* ---------------- ANALYZE ---------------- */

  const analyze = async () => {

    if (!idea) return;

    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const result = await res.json();

    setData(result);

    setLoading(false);

  };

  /* ---------------- PDF DOWNLOAD ---------------- */

  const downloadPDF = () => {
    window.print();
  };

  /* ---------------- UI ---------------- */

  return (

    <main className="min-h-screen bg-gray-100 dark:bg-black px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6 text-black dark:text-white">

        {/* INPUT */}

        <textarea
          className="w-full p-4 rounded-lg bg-white dark:bg-zinc-900"
          rows={4}
          placeholder="Describe your idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <button
          onClick={analyze}
          className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Launch my idea"}
        </button>

        {/* RESULTS */}

        {data && (

          <>

            {/* SCORE */}

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl text-center">

              <p className="text-sm opacity-60">Hidden Niche Score</p>

              <p className="text-5xl font-bold">
                {displayScore}/100
              </p>

              <p className="opacity-70 mt-2">
                {data.verdict}
              </p>

            </div>

            {/* REFINED IDEA */}

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-2">

              <h2 className="font-semibold text-lg">🔥 Refined Idea</h2>

              <p>{data.refined_idea}</p>

            </div>

            {/* IDEAL CUSTOMER */}

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-2">

              <h2 className="font-semibold text-lg">👤 Ideal Customer</h2>

              <p><strong>Who:</strong> {data.ideal_customer?.who}</p>
              <p><strong>Where:</strong> {data.ideal_customer?.where}</p>
              <p><strong>Trigger:</strong> {data.ideal_customer?.trigger}</p>

            </div>

            {/* EXECUTION */}

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-2">

              <h2 className="font-semibold text-lg">🚀 Execution Blueprint</h2>

              <p>Day 1: {data.execution?.day1}</p>
              <p>Week 1: {data.execution?.week1}</p>
              <p>First Revenue: {data.execution?.first_revenue}</p>

            </div>

            {/* LAUNCH PLAN */}

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-2">

              <h2 className="font-semibold text-lg">📈 Launch Plan</h2>

              <p><strong>MVP:</strong> {data.launch_plan?.mvp}</p>
              <p><strong>Traffic:</strong> {data.launch_plan?.traffic}</p>
              <p><strong>Monetization:</strong> {data.launch_plan?.monetization}</p>
              <p><strong>Next 72h:</strong> {data.launch_plan?.next_72_hours}</p>

            </div>

            {/* DOWNLOAD */}

            <button
              onClick={downloadPDF}
              className="w-full border py-3 rounded-lg"
            >
              📄 Save Launch Plan as PDF
            </button>

          </>

        )}

      </div>

    </main>

  );

}