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

  const download = () => {
    const text = `
BUSINESS LAUNCH BRIEF

Idea:
${idea}

Verdict:
${data.verdict}

Score:
${data.score}/100

Refined Idea:
${data.refined_idea}

Target Customer:
${data.ideal_customer.who}

Execution:
Day 1: ${data.execution.day1}
Week 1: ${data.execution.week1}
First Revenue: ${data.execution.first_revenue}

Launch Plan:
MVP: ${data.launch_plan.mvp}
Traffic: ${data.launch_plan.traffic}
Monetization: ${data.launch_plan.monetization}
Next 72h: ${data.launch_plan.next_72_hours}

Risks:
${data.red_flags.join("\n")}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "launch-plan.txt";
    a.click();
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
              <p className="text-5xl font-bold">{displayScore}/100</p>
              <p className="opacity-60">{data.verdict}</p>
            </div>

            <button
  onClick={() => window.print()}
  className="w-full border py-3 rounded-lg"
>
  📄 Save as PDF
</button>
          </>
        )}

      </div>
    </main>
  );
}