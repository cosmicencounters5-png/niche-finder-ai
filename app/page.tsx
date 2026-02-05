"use client";

import { useState, useEffect } from "react";

type BestOpportunity = {
  niche?: string;
  targets?: string;
  underserved?: string;
  success?: string;
  viral?: string;
};

export default function Home() {

  const [dark, setDark] = useState(false);
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const [score, setScore] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  const [verdict, setVerdict] = useState("");

  const [best, setBest] = useState<BestOpportunity>({});
  const [execution, setExecution] = useState<any>(null);
  const [monetization, setMonetization] = useState<any>(null);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [trendSignals, setTrendSignals] = useState<string[]>([]);

  /* ---------------- DARK MODE ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  /* ---------------- SCORE ANIMATION ---------------- */

  useEffect(() => {
    if (score === null) return;

    let current = 0;

    const interval = setInterval(() => {

      current += 1;
      setDisplayScore(current);

      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      }

    }, 20);

    return () => clearInterval(interval);

  }, [score]);

  /* ---------------- AI CALL (GOD MODE V2) ---------------- */

  const analyzeIdea = async () => {

    if (!idea) return;

    setLoading(true);
    setScore(null);
    setDisplayScore(0);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();

    setVerdict(data.verdict);

    setScore(data.score);

    setBest({
      niche: data.best_opportunity?.niche,
      targets: data.best_opportunity?.target_user,
      underserved: data.best_opportunity?.why_underserved,
      success: data.best_opportunity?.timing,
      viral: data.best_opportunity?.competitor_blindspot,
    });

    setExecution(data.execution);
    setMonetization(data.monetization);
    setRedFlags(data.red_flags || []);
    setTrendSignals(data.trend_signals || []);

    setLoading(false);

  };

  const Field = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</p>
        <p className="text-sm leading-relaxed">{value}</p>
      </div>
    ) : null;

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white transition-colors duration-300 px-4 py-10 flex justify-center">

      <div className="w-full max-w-xl space-y-6">

        {/* INPUT */}

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl relative">

          <button onClick={toggleDark} className="absolute top-4 right-4">
            {dark ? "☀️" : "🌙"}
          </button>

          <h1 className="text-3xl font-bold text-center mb-4">
            Find Hidden Niches Instantly
          </h1>

          <textarea
            className="w-full p-4 border rounded-lg mb-4 bg-white dark:bg-zinc-800"
            placeholder="Describe your idea..."
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <button
            onClick={analyzeIdea}
            className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Find Hidden Niches"}
          </button>

        </div>

        {/* VERDICT */}

        {verdict && (
          <div className={`p-4 rounded-xl text-center font-semibold ${
            verdict.includes("NOT") ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}>
            {verdict}
          </div>
        )}

        {/* SCORE */}

        {score !== null && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl text-center">

            <p className="text-sm text-gray-500">Hidden Niche Score</p>

            <p className="text-5xl font-bold mb-4">{displayScore}/100</p>

            <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded">
              <div
                className="h-2 bg-black dark:bg-white rounded transition-all duration-500"
                style={{ width: `${displayScore}%` }}
              />
            </div>

          </div>
        )}

        {/* BEST OPPORTUNITY */}

        {best.niche && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-4">

            <h2 className="font-semibold text-lg">🔥 Best Opportunity</h2>

            <Field label="Niche" value={best.niche} />
            <Field label="Who it targets" value={best.targets} />
            <Field label="Why underserved" value={best.underserved} />
            <Field label="Why NOW" value={best.success} />
            <Field label="Competitor blindspot" value={best.viral} />

          </div>
        )}

        {/* EXECUTION */}

        {execution && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-2">

            <h2 className="font-semibold">🚀 Execution Blueprint</h2>

            <p>Day 1: {execution.day1}</p>
            <p>Week 1: {execution.week1}</p>
            <p>First revenue: {execution.first_revenue}</p>

          </div>
        )}

        {/* MONETIZATION */}

        {monetization && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl">

            <h2 className="font-semibold mb-2">💰 Monetization</h2>

            <p>{monetization.method}</p>
            <p>{monetization.price_range}</p>

          </div>
        )}

      </div>

    </main>
  );
}