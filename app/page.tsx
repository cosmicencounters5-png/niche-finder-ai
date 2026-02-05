"use client";

import { useState, useEffect } from "react";

export default function Home() {

  const [dark, setDark] = useState(false);

  // INIT DARK MODE
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // fallback til system preference
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        document.documentElement.classList.add("dark");
        setDark(true);
      }
    }
  }, []);

  // TOGGLE
  const toggleDark = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black text-black dark:text-white transition-colors duration-300">

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg text-center space-y-6">

        <h1 className="text-2xl font-bold">
          Dark Mode Test
        </h1>

        <button
          onClick={toggleDark}
          className="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black transition"
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

      </div>

    </main>
  );
}