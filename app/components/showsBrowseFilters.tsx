"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ShowsBrowseFilters() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [popular, setPopular] = useState("");

  function applyFilters() {
    const sp = new URLSearchParams();

    if (searchQuery) sp.set("q", searchQuery);
    if (year) sp.set("year", year);
    if (rating) sp.set("rating", rating);
    if (popular) sp.set("popular", popular);

    const query = sp.toString();
    router.push(query ? `/shows/all?${query}` : "/shows/all");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      applyFilters();
    }
  }

  const hasActiveFilters = year || rating || popular;

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl">
      <div className="relative flex items-center">
        <div className="z-10 absolute left-4 text-neutral-500">
          <Search size={20} />
        </div>
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search shows..." className="w-full py-4 pl-12 pr-32 rounded-full border border-white/10 bg-neutral-900/60 backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/25 transition-colors" />
        <button type="button" onClick={applyFilters} className="absolute right-2 px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
          Search
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 px-2">
        <span className="text-sm text-white/60">Filters:</span>

        <select className="px-3 py-1.5 text-sm rounded-full bg-neutral-900/60 backdrop-blur-sm border border-white/10 text-white/80 focus:outline-none focus:border-white/25 transition-colors" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          <option value="2020">2020s</option>
          <option value="2010">2010s</option>
          <option value="2000">2000s</option>
          <option value="1990">1990s</option>
        </select>

        <select className="px-3 py-1.5 text-sm rounded-full bg-neutral-900/60 backdrop-blur-sm border border-white/10 text-white/80 focus:outline-none focus:border-white/25 transition-colors" value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Rating</option>
          <option value="5">5 (avg)</option>
          <option value="4">4+ (avg)</option>
          <option value="3">3+ (avg)</option>
        </select>

        <select className="px-3 py-1.5 text-sm rounded-full bg-neutral-900/60 backdrop-blur-sm border border-white/10 text-white/80 focus:outline-none focus:border-white/25 transition-colors" value={popular} onChange={(e) => setPopular(e.target.value)}>
          <option value="">Popular</option>
          <option value="all-time">All Time</option>
          <option value="this-year">This Year</option>
          <option value="this-month">This Month</option>
          <option value="this-week">This Week</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setYear("");
              setRating("");
              setPopular("");
            }}
            className="px-3 py-1.5 text-sm rounded-full text-white/60 hover:text-white/80 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
