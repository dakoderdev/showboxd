import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constants";

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

export default async function Reviews({ showId }: { showId: number }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: reviews } = await supabase.from("reviews").select("id, rating, comment, users(username, profile_picture)").eq("show_id", showId).limit(4).order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-end pb-3 mb-2 border-b border-white/10">
        <h3 className="text-3xl font-medium text-white/80">Reviews</h3>
        <Link href={`/shows/${showId}/reviews`} className="bg-neutral-900/70 border border-white/10 text-sm rounded-full py-1 px-4 font-inter text-white/80 hover:bg-neutral-800/80 transition-colors">
          See More
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
        {(() => {
          const filteredReviews = reviews?.filter((r) => r.comment) || [];
          return filteredReviews.length > 0 ? (
            filteredReviews.map((review) => {
              const user = Array.isArray(review.users) ? review.users[0] : review.users;
              return (
                <Link key={review.id} href={`/shows/${showId}/reviews/${review.id}`} className="flex flex-col border border-white/10 bg-neutral-900/20 hover:bg-neutral-900/30 rounded-2xl w-full min-h-54 shadow-sm p-4 shadow-black/80 transition-colors">
                  <div className="flex gap-4 items-center justify-between border-b border-white/5 pb-3 mb-2.5">
                    <div className="flex gap-3.5 items-center">
                      <div className="w-8 h-8">
                        <Image src={user?.profile_picture ?? DEFAULT_PROFILE_PICTURE} alt="User Avatar" width={32} height={32} sizes="32px" className="rounded-full w-full h-full object-cover" />
                      </div>
                      <div className="font-medium text-white/80">@{user?.username}</div>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                  <div className="flex flex-col justify-between grow">
                    <p className="text-white/70 pb-4">{review.comment}</p>
                    <div className="flex self-end gap-2">
                      <span className="flex gap-1 items-center px-0.5 text-white/50 hover:text-white/80 transition-colors">
                        <MessageSquare size={14} />
                        <span className="text-sm">0</span>
                      </span>
                      <span className="flex gap-1 items-center px-0.5 text-white/50 hover:text-white/80 transition-colors">
                        <Heart size={14} />
                        <span className="text-sm">0</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center text-white/70 py-8">No reviews yet.</div>
          );
        })()}
      </div>
    </div>
  );
}
