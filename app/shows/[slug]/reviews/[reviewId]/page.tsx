import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, MoreHorizontal, ThumbsUp } from "lucide-react";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";


const mockUser = {
  username: "cinephile_alex",
  profile_picture: DEFAULT_PROFILE_PICTURE,
};

// Hardcoded comments
const mockComments = [
  {
    id: 1,
    user: {
      username: "tv_fanatic",
      profile_picture: DEFAULT_PROFILE_PICTURE,
    },
    content: "Completely agree! The first season is untouchable. That synth score still gives me chills.",
    likes: 24,
    createdAt: "2024-03-16",
  },
  {
    id: 2,
    user: {
      username: "retro_watcher",
      profile_picture: DEFAULT_PROFILE_PICTURE,
    },
    content: "The casting of the kids was perfect. Millie Bobby Brown especially - she carried so much of the emotional weight with barely any dialogue.",
    likes: 18,
    createdAt: "2024-03-17",
  },
  {
    id: 3,
    user: {
      username: "horror_buff_88",
      profile_picture: DEFAULT_PROFILE_PICTURE,
    },
    content: "Great review! Though I think Season 4 gave Season 1 a run for its money. The Vecna storyline was incredible.",
    likes: 12,
    createdAt: "2024-03-18",
  },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, index) => {
        const full = index * 2 + 2 <= rating;
        const half = !full && index * 2 + 1 <= rating;
        const fillPercent = full ? 100 : half ? 50 : 0;
        return (
          <div key={index} className="relative inline-block w-5 h-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-white/10 stroke-[0.5px] stroke-white/10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-blue-300/90 absolute inset-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

function Comment({
  comment,
}: {
  comment: {
    id: number;
    user: { username: string; profile_picture: string };
    content: string;
    likes: number;
    createdAt: string;
  };
}) {
  return (
    <div className="flex gap-3 py-4 border-b border-white/5 last:border-0">
      <div className="shrink-0">
        <Image
          src={comment.user.profile_picture}
          alt={comment.user.username}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/80 font-medium text-sm">@{comment.user.username}</span>
          <span className="text-white/30 text-xs">{comment.createdAt}</span>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-4 mt-2">
          <button className="flex items-center gap-1.5 text-white/40 hover:text-blue-300 transition-colors text-xs">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{comment.likes}</span>
          </button>
          <button className="text-white/40 hover:text-white/60 transition-colors text-xs">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

type PageProps = {
  params: Promise<{
    slug: string;
    reviewId: string;
  }>;
};

export default async function ReviewPage({ params }: PageProps) {
  const { slug, reviewId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: review } = await supabase
  .from("reviews")
  .select(`
    id,
    rating,
    comment,
    created_at,
    users:user_id (
      username,
      profile_picture
    ),
    shows:show_id (
      show_id,
      name,
      img_vertical,
      release_year
    )
  `)
  .eq("id", reviewId)
  .single();

  if (!review) {
    return (
      <div className="min-h-dvh bg-neutral-950 text-white flex items-center justify-center">
        Review not found
      </div>
    );
  }

  const user = Array.isArray(review.users) ? review.users[0] : review.users;
  const show = Array.isArray(review.shows) ? review.shows[0] : review.shows;

  const reviewDate = new Date(review.created_at).toLocaleDateString(); 

  const comments = mockComments;

  return (
    <div className="min-h-dvh bg-neutral-950">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/shows/${slug}`}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to show</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Show context card */}
        <div
          className="flex gap-4 pl-1 transition-colors mb-3 group"
        >
          <div className="relative w-10 aspect-2/3 rounded-md overflow-hidden shrink-0">
            <Image
              src={show.img_vertical}
              alt={show.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-white font-semibold text-lg transition-colors">
              {show.name}
            </h2>
            <p className="text-white/40 text-sm">{show.release_year}</p>
          </div>
        </div>

        {/* Review card */}
        <article className="bg-neutral-900/70 rounded-2xl border border-white/10 overflow-hidden">
          {/* Review header */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 items-center">
                <Image
                  src={user.profile_picture}
                  alt={user.username}
                  width={44}
                  height={44}
                  className="rounded-full object-cover ring ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">@{user.username}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <StarDisplay rating={review.rating} />
                    <span className="text-white/30 text-xs">{reviewDate}</span>
                  </div>
                </div>
              </div>
              <button className="text-white/40 hover:text-white/60 transition-colors p-1">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Review content */}
          <div className="p-5">
            <p className="text-white/70 text-base leading-relaxed">{review.comment}</p>
          </div>

          {/* Review actions */}
          <div className="px-5 py-4 border-t border-white/5 flex items-center gap-6">
            <button className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center gap-2 text-white/40 hover:text-blue-300 transition-colors group">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{comments.length} Comments</span>
            </button>
          </div>
        </article>

        {/* Comments section */}
        <section className="mt-6">
          <h3 className="text-white/80 font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Comments
          </h3>
          <div className="flex gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-full bg-neutral-800 shrink-0" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all"
              />
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-0">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
