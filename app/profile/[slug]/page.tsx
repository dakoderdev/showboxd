import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Eye, Heart, MessageSquare, Star } from "lucide-react";
import { cookies } from "next/headers";
import LogoutButton from "../../../components/logOutButton";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ShowSummary = {
  show_id: number;
  name: string;
  img_vertical: string | null;
};

type InteractionRow = {
  saved: boolean | null;
  watched: boolean | null;
  liked: boolean | null;
  created_at: string;
  shows: ShowSummary | ShowSummary[] | null;
};

type ReviewRow = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  shows: ShowSummary | ShowSummary[] | null;
};

const getProfileData = cache(async (slug: string) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  const [profileRes, interactionsRes, reviewsRes] = await Promise.all([
    supabase.from("users").select("username, profile_picture, created_at").eq("user_id", slug).single(),
    supabase
      .from("show_interaction")
      .select("saved, watched, liked, created_at, shows(show_id, name, img_vertical)")
      .eq("user_id", slug)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at, shows(show_id, name, img_vertical)")
      .eq("user_id", slug)
      .filter("comment", "not.is", null)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    viewerId: viewer?.id ?? null,
    profile: profileRes.data,
    interactions: (interactionsRes.data ?? []) as InteractionRow[],
    reviews: (reviewsRes.data ?? []) as ReviewRow[],
  };
});

function firstRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function uniqueShows(rows: InteractionRow[], key: "saved" | "watched" | "liked") {
  const seen = new Set<number>();
  return rows
    .filter((row) => row[key])
    .map((row) => firstRelation(row.shows))
    .filter((show): show is ShowSummary => Boolean(show?.show_id))
    .filter((show) => {
      if (seen.has(show.show_id)) return false;
      seen.add(show.show_id);
      return true;
    });
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="border border-white/10 bg-neutral-900/35 rounded-2xl px-4 py-3 flex items-center gap-3">
      <div className="text-blue-300/90">{icon}</div>
      <div>
        <div className="text-2xl font-semibold text-white/90">{value}</div>
        <div className="text-xs text-white/45">{label}</div>
      </div>
    </div>
  );
}

function ShowPoster({ show }: { show: ShowSummary }) {
  return (
    <Link href={`/shows/${show.show_id}`} className="group min-w-28 w-28 sm:min-w-32 sm:w-32">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-sm shadow-black/50">
        {show.img_vertical ? (
          <Image src={show.img_vertical} alt={show.name} fill sizes="128px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="h-full w-full grid place-items-center px-3 text-center text-xs text-white/40">{show.name}</div>
        )}
      </div>
      <div className="text-sm text-white/70 mt-2 truncate group-hover:text-white transition-colors">{show.name}</div>
    </Link>
  );
}

function ShowShelf({ title, shows, emptyText }: { title: string; shows: ShowSummary[]; emptyText: string }) {
  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h2 className="text-2xl font-medium text-white/85">{title}</h2>
        <span className="text-sm text-white/35">{shows.length}</span>
      </div>
      {shows.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-4">
          {shows.slice(0, 12).map((show) => (
            <ShowPoster key={show.show_id} show={show} />
          ))}
        </div>
      ) : (
        <div className="text-white/45 text-sm py-6">{emptyText}</div>
      )}
    </section>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-px">
      {[...Array(5)].map((_, index) => {
        const full = index * 2 + 2 <= rating;
        const half = !full && index * 2 + 1 <= rating;
        const fillPercent = full ? 100 : half ? 50 : 0;
        return (
          <div key={index} className="relative inline-block w-4 h-4">
            <Star className="w-full h-full text-white/10 fill-current stroke-white/10" />
            <Star className="w-full h-full text-blue-300/90 fill-current absolute inset-0" style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }} />
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewRow }) {
  const show = firstRelation(review.shows);
  if (!show) return null;

  return (
    <Link href={`/shows/${show.show_id}/reviews/${review.id}`} className="border border-white/10 bg-neutral-900/35 hover:bg-neutral-900/55 rounded-2xl p-4 transition-colors flex gap-4">
      <div className="relative w-14 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-neutral-800">
        {show.img_vertical ? <Image src={show.img_vertical} alt={show.name} fill sizes="56px" className="object-cover" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="font-medium text-white/85 truncate">{show.name}</h3>
          <StarDisplay rating={review.rating} />
        </div>
        <p className="text-sm text-white/60 line-clamp-3">{review.comment}</p>
      </div>
    </Link>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { profile } = await getProfileData(slug);

  return {
    title: profile?.username ? `${profile.username}'s Profile` : "Profile",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { viewerId, profile, interactions, reviews } = await getProfileData(slug);

  if (!profile) {
    return <div className="min-h-dvh grid place-items-center text-white/70">Profile not found</div>;
  }

  const watchedShows = uniqueShows(interactions, "watched");
  const savedShows = uniqueShows(interactions, "saved");
  const likedShows = uniqueShows(interactions, "liked");
  const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const isOwnProfile = viewerId === slug;

  return (
    <main className="min-h-dvh px-5 sm:px-10 py-8 text-white">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row gap-5 sm:items-end border-b border-white/10 pb-6">
          <Image src={profile.profile_picture ?? DEFAULT_PROFILE_PICTURE} priority alt={`${profile.username} avatar`} width={128} height={128} sizes="128px" className="rounded-full w-28 h-28 sm:w-32 sm:h-32 object-cover ring ring-white/10 shadow-md shadow-black/50" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter truncate">{profile.username}</h1>
                <p className="text-white/45 mt-2">Member since {joinedDate}</p>
              </div>
              {isOwnProfile ? <LogoutButton /> : null}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Watched" value={watchedShows.length} icon={<Eye size={22} />} />
          <StatCard label="Saved" value={savedShows.length} icon={<Bookmark size={22} />} />
          <StatCard label="Liked" value={likedShows.length} icon={<Heart size={22} />} />
          <StatCard label="Reviews" value={reviews.length} icon={<MessageSquare size={22} />} />
        </section>

        <div className="grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
          <div className="flex flex-col gap-8 min-w-0">
            <ShowShelf title="Watched" shows={watchedShows} emptyText="No watched shows yet." />
            <ShowShelf title="Saved" shows={savedShows} emptyText="No saved shows yet." />
            <ShowShelf title="Liked" shows={likedShows} emptyText="No liked shows yet." />
          </div>

          <aside className="lg:sticky lg:top-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-2xl font-medium text-white/85">Recent Reviews</h2>
              <span className="text-sm text-white/35">{reviews.length}</span>
            </div>
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-3 pt-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-white/45 text-sm py-6">No reviews yet.</div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
