"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const [score, setScore] = useState<string | null>(null);
  const [best, setBest] = useState<string | null>(null);
  const [miss, setMiss] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [autopilot, setAutopilot] = useState<string[]>([]);

  const analyzeIdea = async () => {
    if (!idea) return;

    setLoading(true);
    setScore(null);
    setBest(null);
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

    // BEST
    const bestMatch = result.match(
      /Best Opportunity:([\s\S]*?)(Most founders miss this:|Alternative Opportunities:)/
    );
    if (bestMatch) setBest(bestMatch[1].trim());

    // MISS
    const missMatch = result.match(
      /Most founders miss this:([\s\S]*?)(Alternative Opportunities:)/
    );
    if (missMatch) setMiss(missMatch[1].trim());

    // ALTERNATIVES
    const altMatch = result.match(/Alternative Opportunities:([\s\S]*?)(Autopilot Ideas:)/);
    if (altMatch) {
      const items = altMatch[1]
        .split("\n")
        .map((s) => s.replace(/^\d+\.?\s*/, "").trim())
        .filter(Boolean);
      setAlternatives(items);
    }

    // AUTOPILOT
    const autoMatch = result.match(/Autopilot Ideas:([\s\S]*)/);
    if (autoMatch) {
      const items = autoMatch[1]
        .split("\n")
        .map((s) => s.replace(/^\d+\.?\s*/, "").trim())
        .filter(Boolean);
      setAutopilot(items);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-xl space-y-6">

        {/* INPUT CARD */}
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

        {/* SCORE */}
        {score && (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-sm text-gray-500">Hidden Niche Score</p>
            <p className="text-5xl font-bold">{score}/100</p>
          </div>
        )}

        {/* BEST */}
        {best && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-3">🔥 Best Opportunity</h2>
            <p className="text-sm leading-relaxed break-words whitespace-pre-line">
              {best}
            </p>
          </div>
        )}

        {/* MISS */}
        {miss && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
            <h2 className="font-semibold mb-2">⚠️ Most founders miss this</h2>
            <p className="text-sm leading-relaxed break-words">
              {miss}
            </p>
          </div>
        )}

        {/* ALTERNATIVES */}
        {alternatives.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">🔁 Alternative Opportunities</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm break-words">
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
            <ul className="space-y-2 text-sm break-words">
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