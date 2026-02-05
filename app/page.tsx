"use client";

import { useState } from "react";

type BestOpportunity = {
  niche?: string;
  targets?: string;
  underserved?: string;
  success?: string;
  viral?: string;
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const [score, setScore] = useState<string | null>(null);
  const [best, setBest] = useState<BestOpportunity>({});
  const [miss, setMiss] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [autopilot, setAutopilot] = useState<string[]>([]);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const { result } = await res.json();

    // SCORE
    const scoreMatch = result.match(/Hidden Niche Score:\s*(\d+)/i);
    if (scoreMatch) setScore(scoreMatch[1]);

    // BEST OPPORTUNITY FIELDS
    const extract = (label: string) => {
      const m = result.match(new RegExp(`${label}:([\\s\\S]*?)(\\n-|$)`));
      return m ? m[1].trim() : undefined;
    };

    setBest({
      niche: extract("Niche"),
      targets: extract("Who it targets"),
      underserved: extract("Why underserved"),
      success: extract("Why this could realistically succeed"),
      viral: extract("Viral positioning angle"),
    });

    // MISS
    const missMatch = result.match(/Most founders miss this:([\s\S]*?)(Alternative Opportunities:)/);
    if (missMatch) setMiss(missMatch[1].trim());

    // ALTERNATIVES
    const altMatch = result.match(/Alternative Opportunities:([\s\S]*?)(Autopilot Ideas:)/);
    if (altMatch) {
      setAlternatives(
        altMatch[1]
          .split("\n")
          .map(s => s.replace(/^\d+\.?\s*/, "").trim())
          .filter(Boolean)
      );
    }

    // AUTOPILOT
    const autoMatch = result.match(/Autopilot Ideas:([\s\S]*)/);
    if (autoMatch) {
      setAutopilot(
        autoMatch[1]
          .split("\n")
          .map(s => s.replace(/^\d+\.?\s*/, "").trim())
          .filter(Boolean)
      );
    }

    setLoading(false);

    // scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const Field = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</p>
        <p className="text-sm leading-relaxed break-words">{value}</p>
      </div>
    ) : null;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl space-y-6">

        {/* INPUT */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Find Hidden Niches Instantly
          </h1>

          <p className="text-gray-500 text-center mb-4">
            Paste your startup idea and discover overlooked opportunities.
          </p>

          <textarea
            className="w-full p-4 border rounded-lg mb-4 resize-none"
            placeholder="Describe your idea..."
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <button
            onClick={analyzeIdea}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Find Hidden Niches"}
          </button>
        </div>

        <div id="results" />

        {/* SCORE */}
        {score && (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-1">Hidden Niche Score</p>
            <p className="text-5xl font-bold">{score}/100</p>
            <p className="text-xs text-gray-400 mt-1">
              {Number(score) >= 70 ? "🔥 Strong potential" : "⚠️ Medium potential"}
            </p>
          </div>
        )}

        {/* BEST OPPORTUNITY */}
        {best.niche && (
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="font-semibold text-lg">🔥 Best Opportunity</h2>

            <Field label="Niche" value={best.niche} />
            <Field label="Who it targets" value={best.targets} />
            <Field label="Why underserved" value={best.underserved} />
            <Field label="Why this works" value={best.success} />
            <Field label="Viral positioning" value={best.viral} />
          </div>
        )}

        {/* MISS */}
        {miss && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
            <h2 className="font-semibold mb-2">⚠️ Most founders miss this</h2>
            <p className="text-sm leading-relaxed break-words">{miss}</p>
          </div>
        )}

        {/* ALTERNATIVES */}
        {alternatives.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">🔁 Alternative Opportunities</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {alternatives.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {/* AUTOPILOT */}
        {autopilot.length > 0 && (
          <div className="bg-black text-white p-6 rounded-xl">
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