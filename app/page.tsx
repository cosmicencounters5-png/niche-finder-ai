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

  const [score, setScore] = useState<string | null>(null);
  const [best, setBest] = useState<BestOpportunity>({});
  const [miss, setMiss] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [autopilot, setAutopilot] = useState<string[]>([]);

  // INIT DARK MODE
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
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

  // AI CALL
  const analyzeIdea = async () => {
    if (!idea) return;

    setLoading(true);
    setScore(null);
    setBest({});
    setMiss(null);
    setAlternatives([]);
    setAutopilot([]);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    const { result } = await res.json();

    const extract = (label: string) => {
      const m = result.match(new RegExp(`${label}:([\\s\\S]*?)(\\n-|$)`));
      return m ? m[1].trim() : undefined;
    };

    const scoreMatch = result.match(/Hidden Niche Score:\s*(\d+)/i);
    if (scoreMatch) setScore(scoreMatch[1]);

    setBest({
      niche: extract("Niche"),
      targets: extract("Who it targets"),
      underserved: extract("Why underserved"),
      success: extract("Why this could realistically succeed"),
      viral: extract("Viral positioning angle"),
    });

    const missMatch = result.match(/Most founders miss this:([\s\S]*?)(Alternative Opportunities:)/);
    if (missMatch) setMiss(missMatch[1].trim());

    const altMatch = result.match(/Alternative Opportunities:([\s\S]*?)(Autopilot Ideas:)/);
    if (altMatch) {
      setAlternatives(
        altMatch[1]
          .split("\n")
          .map((s: string) => s.replace(/^\d+\.?\s*/, "").trim())
          .filter(Boolean)
      );
    }

    const autoMatch = result.match(/Autopilot Ideas:([\s\S]*)/);
    if (autoMatch) {
      setAutopilot(
        autoMatch[1]
          .split("\n")
          .map((s: string) => s.replace(/^\d+\.?\s*/, "").trim())
          .filter(Boolean)
      );
    }

    setLoading(false);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const Field = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</p>
        <p className="text-sm leading-relaxed">{value}</p>
      </div>
    ) : null;

  return (
    <main className="min-h-screen flex justify-center px-4 py-10 bg-gray-100 dark:bg-black text-black dark:text-white transition-colors duration-300">

      <div className="w-full max-w-xl space-y-6">

        {/* INPUT CARD */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm relative">

          <button
            onClick={toggleDark}
            className="absolute top-4 right-4 text-sm opacity-70 hover:opacity-100"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          <h1 className="text-3xl font-bold mb-2 text-center">
            Find Hidden Niches Instantly
          </h1>

          <textarea
            className="w-full p-4 border rounded-lg mb-4 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
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

        <div id="results"></div>

        {score && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl text-center">
            <p className="text-sm text-gray-500">Hidden Niche Score</p>
            <p className="text-5xl font-bold">{score}/100</p>
          </div>
        )}

        {best.niche && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl space-y-4">
            <h2 className="font-semibold text-lg">🔥 Best Opportunity</h2>

            <Field label="Niche" value={best.niche} />
            <Field label="Who it targets" value={best.targets} />
            <Field label="Why underserved" value={best.underserved} />
            <Field label="Why this works" value={best.success} />
            <Field label="Viral positioning" value={best.viral} />
          </div>
        )}

        {miss && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
            <h2 className="font-semibold mb-2">⚠️ Most founders miss this</h2>
            <p>{miss}</p>
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl">
            <h2 className="font-semibold mb-3">🔁 Alternative Opportunities</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {alternatives.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {autopilot.length > 0 && (
          <div className="bg-black text-white dark:bg-white dark:text-black p-6 rounded-xl">
            <h2 className="font-semibold mb-3">🤖 Autopilot Ideas</h2>
            <ul className="space-y-2 text-sm">
              {autopilot.map((a, i) => (
                <li key={i}>→ {a}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}