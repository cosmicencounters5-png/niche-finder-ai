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
        .map((s: string) => s.replace(/^\d+\.?\s*/, "").trim())
        .filter(Boolean);
      setAlternatives(items);
    }

    // AUTOPILOT
    const autoMatch = result.match(/Autopilot Ideas:([\s\S]*)/);
    if (autoMatch) {
      const items = autoMatch[1]
        .split("\n")
        .map((s: string) => s.replace(/^\d+\.?\s*/, "").trim())
        .filter(Boolean);
      setAutopilot(items);
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

        {score && (
          <div className="text-center mb-10 animate-[fadeIn_.4s_ease-out]">
            <div className="text-sm text-gray-500 mb-1">Hidden Niche Score</div>
            <div className="text-6xl font-bold">{score}/100</div>
          </div>
        )}

        {best && (
          <div className="bg-white border rounded-xl p-6 mb-6 animate-[fadeIn_.5s_ease-out]">
            <h2 className="text-xl font-semibold mb-3">🔥 Best Opportunity</h2>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{best}</pre>
          </div>
        )}

        {miss && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 animate-[fadeIn_.6s_ease-out]">
            <h2 className="text-xl font-semibold mb-2">⚠️ Most founders miss this</h2>
            <p className="text-sm leading-relaxed">{miss}</p>
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="bg-white border rounded-xl p-6 mb-6 animate-[fadeIn_.7s_ease-out]">
            <h2 className="text-xl font-semibold mb-4">🔁 Alternative Opportunities</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {alternatives.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {autopilot.length > 0 && (
          <div className="bg-black text-white rounded-xl p-6 animate-[fadeIn_.8s_ease-out]">
            <h2 className="text-xl font-semibold mb-4">🤖 Autopilot Ideas</h2>
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