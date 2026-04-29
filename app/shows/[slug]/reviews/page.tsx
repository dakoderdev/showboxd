import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MessageSquare } from "lucide-react";
import { cookies } from "next/headers";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";
import { getShowById } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ReviewUser = {
  username: string;
  profile_picture: string | null;
};

type ReviewItem = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  users: ReviewUser | ReviewUser[] | null;
};

function firstRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-px">
      {[...Array(5)].map((_, index) => {
        const full = index * 2 + 2 <= rating;
        const half = !full && index * 2 + 1 <= rating;
        const fillPercent = full ? 100 : half ? 50 : 0;
        return (
          <div key={index} className="relative inline-block w-5 h-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10 stroke-[0.5px] stroke-white/10" viewBox="0 0 24 24" fill="currentColor">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-300/90 absolute inset-0" viewBox="0 0 24 24" fill="currentColor" style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review, showId }: { review: ReviewItem; showId: string }) {
  const user = firstRelation(review.users) ?? { username: "Unknown User", profile_picture: null };
  const reviewDate = new Date(review.created_at).toLocaleDateString();

  return (
    <Link href={`/shows/${showId}/reviews/${review.id}`} className="flex flex-col border border-white/10 bg-neutral-900/30 hover:bg-neutral-900/50 rounded-2xl min-h-56 shadow-sm p-4 shadow-black/80 transition-colors">
      <div className="flex gap-4 items-center justify-between border-b border-white/5 pb-3 mb-3">
        <div className="flex gap-3.5 items-center min-w-0">
          <Image src={user.profile_picture ?? DEFAULT_PROFILE_PICTURE} alt="User Avatar" width={36} height={36} sizes="36px" className="rounded-full w-9 h-9 object-cover" />
          <div className="min-w-0">
            <div className="font-medium text-white/80 truncate">@{user.username}</div>
            <div className="text-xs text-white/35">{reviewDate}</div>
          </div>
        </div>
        <StarDisplay rating={review.rating} />
      </div>
      <p className="text-white/70 leading-relaxed grow">{review.comment}</p>
      <div className="flex self-end gap-3 pt-4">
        <span className="flex gap-1 items-center text-white/45">
          <MessageSquare size={14} />
          <span className="text-sm">0</span>
        </span>
        <span className="flex gap-1 items-center text-white/45">
          <Heart size={14} />
          <span className="text-sm">0</span>
        </span>
      </div>
    </Link>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: show } = await getShowById({ id: parseInt(slug), returnType: "title" });

  return {
    title: show?.name ? `${show.name} Reviews` : "Reviews",
  };
}

export default async function ShowReviewsPage({ params }: PageProps) {
  const { slug } = await params;
  const showId = parseInt(slug);
  const [{ data: show }, cookieStore] = await Promise.all([getShowById({ id: showId, returnType: "title" }), cookies()]);

  if (!show) {
    return <div className="min-h-dvh bg-neutral-950 text-white flex items-center justify-center">Show not found</div>;
  }

  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("reviews").select("id, rating, comment, created_at, users(username, profile_picture)").eq("show_id", showId).filter("comment", "not.is", null).order("created_at", { ascending: false });
  const reviews = (data ?? []) as ReviewItem[];

  return (
    <main className="min-h-dvh bg-neutral-950 text-white px-5 sm:px-10 py-6">
      <div className="mx-auto max-w-5xl">
        <Link href={`/shows/${slug}`} className="inline-flex items-center gap-2 text-white/55 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to show</span>
        </Link>

        <header className="flex flex-wrap justify-between items-end gap-4 pb-4 mb-5 border-b border-white/10">
          <div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter">{show.name}</h1>
            <p className="text-white/45 mt-2">{reviews.length} community reviews</p>
          </div>
        </header>

        {reviews.length > 0 ? (
          <section className="grid grid-cols-[repeat(auto-fill,minmax(375px,1fr))] gap-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} showId={slug} />
            ))}
          </section>
        ) : (
          <div className="text-center text-white/60 py-16 border border-white/10 rounded-2xl bg-neutral-900/20">No reviews yet.</div>
        )}
      </div>
    </main>
  );
}
