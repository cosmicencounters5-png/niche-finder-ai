"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const [score, setScore] = useState<string | null>(null);
  const [best, setBest] = useState<string | null>(null);
  const [miss, setMiss] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);

  const analyzeIdea = async () => {
    if (!idea) return;

    setLoading(true);
    setScore(null);
    setBest(null);
    setMiss(null);
    setAlternatives([]);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });

    const { result } = await res.json();

    // ---- PARSING ----
    const scoreMatch = result.match(/Hidden Niche Score:\s*(\d+)/i);
    if (scoreMatch) setScore(scoreMatch[1]);

    const bestMatch = result.match(/Best Opportunity:(.*?)(Most founders miss this:|Alternative Opportunities:)/s);
    if (bestMatch) setBest(bestMatch[1].trim());

    const missMatch = result.match(/Most founders miss this:(.*?)(Alternative Opportunities:)/s);
    if (missMatch) setMiss(missMatch[1].trim());

    const altMatch = result.match(/Alternative Opportunities:(.*)/s);
    if (altMatch) {
      const items = altMatch[1]
        .split("\n")
        .map((s: string) => s.replace(/^\d+\.?\s*/, "").trim())
        .filter(Boolean);
      setAlternatives(items);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 flex justify-center">
      <div className="w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center mb-4">
          Find Hidden Niches Instantly
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Paste your startup idea and discover overlooked niche opportunities your competitors miss.
        </p>

        <textarea
          className="w-full p-4 border rounded-lg mb-4 bg-white"
          placeholder="Describe your idea..."
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <button
          onClick={analyzeIdea}
          className="w-full bg-black text-white py-3 rounded-lg mb-10"
        >
          {loading ? "Analyzing..." : "Find Hidden Niches"}
        </button>

        {/* SCORE */}
        {score && (
          <div className="text-center mb-10">
            <div className="text-sm text-gray-500 mb-1">Hidden Niche Score</div>
            <div className="text-6xl font-bold">{score}/100</div>
          </div>
        )}

        {/* BEST OPPORTUNITY */}
        {best && (
          <div className="bg-white border rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">🔥 Best Opportunity</h2>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {best}
            </pre>
          </div>
        )}

        {/* WARNING */}
        {miss && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">⚠️ Most founders miss this</h2>
            <p className="text-sm leading-relaxed">{miss}</p>
          </div>
        )}

        {/* ALTERNATIVES */}
        {alternatives.length > 0 && (
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🔁 Alternative Opportunities</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {alternatives.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
