"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

type ShowRow = { name: string; img_vertical: string };

type ShowItem = {
  show_id: number;
  watch_count: number;
  /** Supabase may type embedded relations as an object or a one-element array. */
  shows: ShowRow | ShowRow[];
};

function resolveShow(shows: ShowRow | ShowRow[]): ShowRow {
  return Array.isArray(shows) ? shows[0]! : shows;
}

type ShowListProps = {
  bestShows: ShowItem[];
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

export default function ShowListTop10({ bestShows }: ShowListProps) {
  const groups = useMemo(() => chunkArray(bestShows, 4), [bestShows]);
  const [currentGroup, setCurrentGroup] = useState(0);

  if (!bestShows || bestShows.length === 0) return null;

  return (
    <section className="relative w-full px-0 pt-14 pb-16 sm:px-12 md:px-17 border-y border-white/10 gradient-linear-to-r from-[#01020a] to-[#050106] overflow-hidden">
      <div className="flex flex-col gap-6 px-4 sm:px-0 pb-4">
        <h2 className="text-6xl tracking-tighter text-center font-semibold text-white/90">
          <strong className="gradient-text bg-clip-text text-white/70 font-semibold">Most Popular</strong> Right Now
        </h2>

        <div className="flex flex-col gap-2 sm:hidden">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-2 gap-2">
              {group.map((item, index) => {
                const globalIndex = groupIndex * 4 + index;
                const showData = resolveShow(item.shows);
                return (
                  <Link key={item.show_id} href={`/shows/${item.show_id}`} className="group relative cursor-pointer w-full aspect-[2/3] shadow-md shadow-black/30 rounded-2xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-0 before:sm:ring-2 before:ring-inset before:ring-white/10 before:bg-linear-30 before:from-black/60 before:to-transparent before:to-70% before:rounded-2xl">
                    <Image src={showData.img_vertical} width={256} height={384} alt={showData.name} className="object-cover w-full h-full" />
                    <p className="absolute bottom-1 left-2 text-7xl font-semibold drop-shadow-sm bg-linear-to-t from-neutral-300 to-foreground bg-clip-text text-transparent group-hover:-translate-y-1 transition-transform">{globalIndex + 1}</p>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Desktop: paginated slider */}
        <div className="relative hidden sm:block">
          <button onClick={() => setCurrentGroup((g) => Math.max(0, g - 1))} disabled={currentGroup === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm shadow-sm text-white disabled:opacity-0 hover:bg-black/80 transition-colors text-2xl" aria-label="Previous">
            <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button onClick={() => setCurrentGroup((g) => Math.min(groups.length - 1, g + 1))} disabled={currentGroup === groups.length - 1} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm shadow-sm text-white disabled:opacity-0 hover:bg-black/80 transition-colors text-2xl" aria-label="Next">
            <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentGroup * 100}%)` }}>
              {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="w-full shrink-0 grid grid-cols-4 gap-2 md:gap-3">
                  {group.map((item, index) => {
                    const globalIndex = groupIndex * 4 + index;
                    const showData = resolveShow(item.shows);
                    return (
                      <Link key={item.show_id} href={`/shows/${item.show_id}`} className="group relative cursor-pointer w-full aspect-[2/3] shadow-md shadow-black/30 rounded-xl md:rounded-2xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:bg-linear-30 before:from-black/60 before:to-transparent before:to-70% before:rounded-2xl">
                        <Image src={showData.img_vertical} width={256} height={384} alt={showData.name} className="object-cover w-full h-full" />
                        <p className="absolute bottom-2 left-3.5 text-6xl sm:text-7xl md:text-8xl font-semibold drop-shadow-sm bg-linear-to-t from-neutral-300 to-foreground bg-clip-text text-transparent drop-shadow-black/40 group-hover:-translate-y-1 transition-transform">{globalIndex + 1}</p>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-4 -top-6 sm:-top-12 h-4 gradient-rainbow opacity-85 rounded-full blur-2xl"></div>
      <div className="absolute inset-x-4 -bottom-6 sm:-bottom-12 h-4 gradient-rainbow opacity-85 rounded-full blur-2xl"></div>
    </section>
  );
}