"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<string | null>(null);

  const analyzeIdea = async () => {
    if (!idea) return;

    setLoading(true);
    setResult("");
    setScore(null);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();

    const text = data.result;

    const match = text.match(/Hidden Niche Score:\s*(\d+)/i);
    if (match) {
      setScore(match[1]);
    }

    setResult(text);
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">

      <div className="max-w-2xl w-full">

        <h1 className="text-4xl font-bold mb-4 text-center">
          Find Hidden Niches Instantly
        </h1>

        <p className="text-gray-500 mb-8 text-center">
          Paste your startup idea and discover overlooked niche opportunities your competitors miss.
        </p>

        <textarea
          placeholder="Describe your idea..."
          className="w-full p-4 border rounded-lg mb-4 bg-white"
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <button
          className="w-full bg-black text-white px-6 py-3 rounded-lg mb-8"
          onClick={analyzeIdea}
        >
          {loading ? "Analyzing..." : "Find Hidden Niches"}
        </button>

        {score && (
          <div className="text-center text-5xl font-bold mb-6">
            {score}/100
          </div>
        )}

        {result && (
          <div className="bg-white border rounded-xl p-6 whitespace-pre-wrap leading-relaxed">
            {result}

            <div className="flex gap-4 mt-6 text-sm">
              <button onClick={analyzeIdea} className="underline">
                Try another angle →
              </button>

              <button onClick={copyResult} className="underline">
                Copy result
              </button>
            </div>
          </div>
        )}

      </div>

    </main>
  );
}
