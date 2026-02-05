"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">

      <h1 className="text-4xl font-bold mb-4">
        Find Hidden Niches Instantly
      </h1>

      <p className="text-gray-500 mb-8 max-w-md">
        Paste your startup idea and discover overlooked niche opportunities your competitors miss.
      </p>

      <textarea
        placeholder="Describe your idea..."
        className="w-full max-w-xl p-4 border rounded-lg mb-4"
        rows={5}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />

      <button
        className="bg-black text-white px-6 py-3 rounded-lg"
        onClick={() => {
          setResult(`Analyzing idea: "${idea}"`);
        }}
      >
        Find Hidden Niches
      </button>

      {result && (
        <div className="mt-8 p-4 border rounded-lg max-w-xl">
          <p className="font-medium">{result}</p>
        </div>
      )}

    </main>
  );
}