"use client";

import { useState, useEffect } from "react";

export default function Home() {

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
    <main className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white flex items-center justify-center">

      <button
        onClick={toggleDark}
        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg"
      >
        Toggle theme
      </button>

    </main>
  );
}