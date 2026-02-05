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

  const [best, setBest] = useState<BestOpportunity>({});
  const [miss, setMiss] = useState("");
  const [typedMiss, setTypedMiss] = useState("");

  const [alts, setAlts] = useState<string[]>([]);
  const [typedAlts, setTypedAlts] = useState<string[]>([]);

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
    }, 25); // 👈 langsommere

    return () => clearInterval(interval);
  }, [score]);

  /* ---------------- TYPING: MISS (SEKVENSIELL) ---------------- */
  useEffect(() => {
    if (!miss || score === null) return;

    // vent til score er ferdig + liten pause
    const delay = setTimeout(() => {
      let i = 0;
      setTypedMiss("");

      const interval = setInterval(() => {
        setTypedMiss((prev) => prev + miss[i]);
        i++;
        if (i >= miss.length) clearInterval(interval);
      }, 30); // 👈 tydelig typing

    }, 800);

    return () => clearTimeout(delay);
  }, [miss, score]);

  /* ---------------- TYPING: ALTERNATIVES (ETTER MISS) ---------------- */
  useEffect(() => {
    if (alts.length === 0 || typedMiss.length < miss.length) return;

    const delay = setTimeout(() => {
      let index = 0;
      setTypedAlts([]);

      const reveal = setInterval(() => {
        setTypedAlts((prev) => [...prev, alts[index]]);
        index++;
        if (index >= alts.length) clearInterval(reveal);
      }, 600); // 👈 én og én

    }, 600);

    return () => clearTimeout(delay);
  }, [alts, typedMiss]);

  /* ---------------- AI CALL ---------------- */
  const analyzeIdea = async () => {
    if (!idea) return;

    setLoading(true);
    setScore(null);
    setDisplayScore(0);
    setBest({});
    setMiss("");
    setTypedMiss("");
    setAlts([]);
    setTypedAlts([]);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const { result } = await res.json();

    const extract = (label: string) => {
      const m = result.match(new RegExp(`${label}:([\\s\\S]*?)(\\n-|$)`));
      return m ? m[1].trim() : undefined;
    };

    const scoreMatch = result.match(/Hidden Niche Score:\s*(\d+)/i);
    if (scoreMatch) setScore(Number(scoreMatch[1]));

    setBest({
      niche: extract("Niche"),
      targets: extract("Who it targets"),
      underserved: extract("Why underserved"),
      success: extract("Why this could realistically succeed"),
      viral: extract("Viral positioning angle"),
    });

    const missMatch = result.match(
      /Most founders miss this:([\s\S]*?)(Alternative Opportunities:)/
    );
    if (missMatch) setMiss(missMatch[1].trim());

    const altMatch = result.match(/Alternative Opportunities:([\s\S]*?)(Autopilot Ideas:|$)/);
    if (altMatch) {
      setAlts(
        altMatch[1]
          .split("\n")
          .map((s) => s.replace(/^\d+\.?\s*/, "").trim())
          .filter(Boolean)
      );
    }

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

        {/* BEST */}
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

        {/* MISS */}
        {typedMiss && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-xl">
            <h2 className="font-semibold mb-2">⚠️ Most founders miss this</h2>
            <p>{typedMiss}</p>
          </div>
        )}

        {/* ALTERNATIVES */}
        {typedAlts.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl">
            <h2 className="font-semibold mb-3">🔁 Alternative Opportunities</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {typedAlts.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}