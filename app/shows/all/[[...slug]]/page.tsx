import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type Show = {
  show_id: number;
  name: string;
  img_vertical: string;
  release_year: number;
};

type ShowListProps = {
  shows: Show[],
  timeframe: string;
};

export function ShowListAll({ shows, timeframe = "this week" }: ShowListProps) {
  let modifiedTimeframe = timeframe?.replaceAll("-"," ") || "";
  modifiedTimeframe = modifiedTimeframe === "all time" ? "of all time" : modifiedTimeframe;
  return (
    <div className="flex flex-col w-full gap-4 px-4 sm:px-0 pb-4">
      <h2 className="text-6xl tracking-tighter text-foreground/90 font-semibold">
        <strong className="gradient-text bg-clip-text text-white/70 font-semibold">
          Popular shows
        </strong>{" "}
        {modifiedTimeframe}
      </h2>

      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2">
        {shows.map((show) => (
          <Link
            key={show.show_id}
            href={`/shows/${show.show_id}`}
            className="relative w-full min-h-64 aspect-2/3 shadow-md shadow-black/30 rounded-xl overflow-hidden before:absolute before:inset-0 before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-xl"
          >
            <Image
              src={show.img_vertical}
              width={170}
              height={255}
              alt={show.name}
              className="object-cover w-full h-full"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

type Filters = {
  q: string | null;
  year: string | null;
  rating: string | null;
  popular: string | null;
};

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getFilters(
  searchParams: Record<string, string | string[] | undefined> | undefined
): Filters {
  const get = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v ?? null;

  return {
    q: get(searchParams?.q),
    year: get(searchParams?.year),
    rating: get(searchParams?.rating),
    popular: get(searchParams?.popular),
  };
}

function getFromDate(popular: string | null) {
  if (!popular) return null;

  const map: Record<string, number> = {
    "this-week": 7,
    "this-month": 30,
    "this-year": 365,
  };

  const days = map[popular];
  if (!days) return null;

  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = getFilters(resolvedSearchParams);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const fromDate = getFromDate(filters.popular);

  const [{ data: shows }, { data: ratings }, { data: interactions }] =
    await Promise.all([
      supabase
        .from("shows")
        .select("show_id, name, img_vertical, release_year")
        .limit(48),

      supabase.from("reviews").select("show_id, rating"),

      fromDate
        ? supabase
            .from("show_interaction")
            .select("show_id, created_at")
            .eq("watched", true)
            .gte("created_at", fromDate)
        : supabase
            .from("show_interaction")
            .select("show_id, created_at")
            .eq("watched", true),
    ]);

  const ratingMap = ratings?.reduce((acc, r) => {
    const current = acc[r.show_id] ?? { sum: 0, count: 0 };
    current.sum += r.rating;
    current.count += 1;
    acc[r.show_id] = current;
    return acc;
  }, {} as Record<number, { sum: number; count: number }>);

  const popularityMap = interactions?.reduce((acc, r) => {
    acc[r.show_id] = (acc[r.show_id] ?? 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  let result = [...(shows ?? [])];

  if (filters.q) {
    const query = filters.q.toLowerCase();
    result = result.filter((s) =>
      s.name.toLowerCase().includes(query)
    );
  }

  if (filters.popular) {
    result.sort(
      (a, b) =>
        (popularityMap?.[b.show_id] ?? 0) -
        (popularityMap?.[a.show_id] ?? 0)
    );
  }

  if (filters.year) {
    const base = Number(filters.year);
    result = result.filter(
      (s) => s.release_year >= base && s.release_year < base + 10
    );
  }

  if (filters.rating) {
    const min = Number(filters.rating) * 2;
    result = result.filter((s) => {
      const r = ratingMap?.[s.show_id];
      return r && r.sum / r.count >= min;
    });
  }

  return (
    <section className="flex justify-center items-center gap-4 w-full px-0 py-4 sm:px-12 md:px-17">
      <ShowListAll shows={result} timeframe={filters.popular ?? "this week"} />
    </section>
  );
}