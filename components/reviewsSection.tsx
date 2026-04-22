import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { MessageSquare, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_PROFILE_PICTURE = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "")}/storage/v1/object/public/users/def.webp`;

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

export function Review({ review }: { review: any }) {
  const user = review.users?.[0] || review.users; 
console.log("Current user object:", user);
  console.log(user?.profile_picture);
  return (
    <Link key={review.id} href={"#"} className="flex flex-col border border-white/10 bg-neutral-900/20 hover:bg-neutral-900/30 rounded-2xl w-full min-h-54 shadow-sm p-4 shadow-black/80 transition-colors">
      <div className="flex gap-4 items-center justify-between border-b border-white/5 pb-3 mb-2.5">
        <div className="flex gap-3.5 items-center">
          <div className="w-8 h-8">
            <Image src={user?.profile_picture ?? DEFAULT_PROFILE_PICTURE} alt="User Avatar" width={32} height={32} className="rounded-full w-full h-full object-cover" />
          </div>
          <div className="font-medium text-white/80">@{user?.username}</div>
        </div>
        <StarDisplay rating={review.rating} />
      </div>
      <div className="flex flex-col justify-between grow">
        <p className="text-white/70 pb-4">{review.comment}</p>
        <span className="flex w-full justify-center gap-2 text-white/40 text-sm italic">- {review.shows.name} -</span>
      </div>
    </Link>
  );
}

export default async function ReviewSection() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: reviews } = await supabase.from("reviews").select("id, show_id, rating, comment, users(username, profile_picture), shows(name)");
  return (
    <section className="relative z-30 w-full py-16 overflow-hidden flex flex-col bg-background">
      <h2 className="text-6xl tracking-tighter opacity-90 font-semibold text-center pb-8">
        <strong className="gradient-text bg-clip-text text-white/70 font-semibold">Reviews </strong>
        by Community
      </h2>
      <div className=" gap-1 pb-4">
        <div className="grid grid-cols-3 justify-center gap-4 px-12">
          {reviews
            ?.filter((r) => r.comment)
            .slice(0, 3)
            .map((review) => {
              return <Review key={review.id} review={review} />;
            })}
        </div>
      </div>
    </section>
  );
}
