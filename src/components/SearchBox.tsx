"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = q.trim();
        if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }}
      role="search"
      className="flex gap-2"
    >
      <label className="sr-only" htmlFor="sidebar-search">
        Search coloring pages
      </label>
      <input
        id="sidebar-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search coloring pages..."
        className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange"
      />
      <button
        type="submit"
        className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Search
      </button>
    </form>
  );
}
