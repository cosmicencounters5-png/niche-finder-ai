"use client";

import { useState, useEffect } from "react";

export default function Home() {

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const [data, setData] = useState<any>(null);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  useEffect(() => {
    if (!data?.score) return;

    let n = 0;

    const i = setInterval(() => {

      n++;
      setDisplayScore(n);

      if (n >= data.score) clearInterval(i);

    }, 20);

    return () => clearInterval(i);

  }, [data]);

  const analyze = async () => {

    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    setData(await res.json());

    setLoading(false);

  };

  /* -------- PDF via browser print -------- */

  const downloadPDF = () => {
    window.print();
  };

  return (

    <main className="min-h-screen bg-gray-100 dark:bg-black px-4 py-10 flex justify-center">

      <div className="max-w-xl w-full space-y-6 text-black dark:text-white">

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

        {data && (
          <>
            <div className="text-center">

              <p className="text-5xl font-bold">
                {displayScore}/100
              </p>

              <p className="opacity-60">
                {data.verdict}
              </p>

            </div>

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