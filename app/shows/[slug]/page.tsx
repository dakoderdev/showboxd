import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import ShowDetailAside from "../../../components/showDetailAside";
import Tab from "../../../components/tab";
import Reviews from "../../../components/reviews";
import { getShowById } from "@/utils/supabase/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: show } = await getShowById({ id: parseInt(slug), returnType: "title" });
  
  return {
    title: show?.name || "Show",
  };
}

export function StreamingSites({ streamingSites }: { streamingSites: string[] }) {
  const toFileName = (name: string) => name.toLowerCase().replace(/ /g, "_");

return (
    <article className={`${streamingSites.length > 0 ? "block" : "hidden"} self-stretch border-white/10 border-l sm:border sm:self-stretch text-white pl-2 sm:p-2 sm:rounded-2xl justify-center w-fit sm:w-full max-w-80 gap-2 flex flex-col`}>
      <p className="font-medium hidden sm:block font-inter p-1 pb-2 border-b border-white/10 opacity-60">Where to watch</p>
      <div className="flex justify-center sm:justify-start gap-1.5">
        {streamingSites.map((site, index) => (
          <Image key={index} className=" sm:rounded-lg rounded-md w-5 h-5 sm:w-10 sm:h-10" src={`/streaming_sites/${toFileName(site)}.png`} alt={`${site} Logo`} width={40} height={40} sizes="40px" />
        ))}
      </div>
    </article>
  );
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: show } = await getShowById({ id: parseInt(slug) });
  if (!show) return <div>Show not found</div>;

  const [savedRes, watchedRes, likedRes, userInteraction, userReview, usersRating] = await Promise.all([
    supabase.from("show_interaction").select("*", { count: "exact", head: true }).eq("show_id", slug).eq("saved", true),
    supabase.from("show_interaction").select("*", { count: "exact", head: true }).eq("show_id", slug).eq("watched", true),
    supabase.from("show_interaction").select("*", { count: "exact", head: true }).eq("show_id", slug).eq("liked", true),
    user ? supabase.from("show_interaction").select("saved, watched, liked").eq("show_id", slug).eq("user_id", user.id).single() : Promise.resolve({ data: null }),
    user ? supabase.from("reviews").select("rating, comment").eq("show_id", slug).eq("user_id", user.id).single() : Promise.resolve({ data: null }),
    supabase.from("show_avg_ratings").select("avg_rating").eq("show_id", slug).single(),
  ]);

  const userChoices = userInteraction.data || { saved: false, watched: false, liked: false };
  const userRating = userReview.data?.rating ?? null;
  const usersAverageRating = usersRating.data?.avg_rating ?? 0;
  const truncatedAverageRating = Math.floor((usersAverageRating / 2) * 10) / 10;

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const counts = {
    saved: formatter.format(savedRes.count || 0),
    watched: formatter.format(watchedRes.count || 0),
    liked: formatter.format(likedRes.count || 0),
  };

  return (
    <main className="flex flex-col sm:flex-row gap-4 px-8 sm:px-12  md:px-17 sm:pb-2 min-h-[200vh] font-geist">
      <section className="sm:sticky top-2 flex flex-col items-center sm:items-stretch gap-2 h-fit">
        <figure className="relative w-fit h-fit -mt-5 sm:mt-0 before:inset-0 before:absolute before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl shadow-md shadow-black/30">
          <Image className="rounded-2xl object-cover min-w-72 md:min-w-80 h-120" src={show.img_vertical} alt={show.name} width={320} height={480} sizes="320px" />
        </figure>
        <div className="flex sm:flex-col justify-between items-center sm:items-stretch gap-3 sm:gap-2 h-fit sm:w-full">
          <article className="flex gap-2 justify-center">
            <div className="flex gap-1">
              <svg className="text-white/50 transition-all inline-block" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z" />
              </svg>
              <span className="text-xs opacity-40 text-inter text-center">{counts.saved}</span>
            </div>
            <div className="flex gap-1">
              <svg className="text-white/50 transition-all inline-block" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 4c4.29 0 7.863 2.429 10.665 7.154l.22 .379l.045 .1l.03 .083l.014 .055l.014 .082l.011 .1v.11l-.014 .111a.992 .992 0 0 1 -.026 .11l-.039 .108l-.036 .075l-.016 .03c-2.764 4.836 -6.3 7.38 -10.555 7.499l-.313 .004c-4.396 0 -8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
              </svg>
              <span className="text-xs opacity-40 text-inter text-center">{counts.watched}</span>
            </div>
            <div className="flex gap-1">
              <svg className="text-white/50 transition-all inline-block" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />{" "}
              </svg>
              <span className="text-xs opacity-40 text-inter text-center">{counts.liked}</span>
            </div>
          </article>
          <StreamingSites streamingSites={show.streaming_sites} />
        </div>
      </section>
      <section>
        <article className="sm:pb-4 flex justify-center sm:justify-start items-baseline flex-wrap flex-row gap-x-4 lg:gap-x-6 sm:items-end sm:border-b border-white/10 mb-2">
          <h1 className="text-6xl text-center sm:text-start md:text-7xl font-semibold tracking-tighter text-wrap wrap-anywhere">{show.name}</h1>
          <span className="text-3xl flex gap-2 items-center pb-1">
            {truncatedAverageRating}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
          </span>
        </article>
        <article className="flex flex-col lg:flex-row justify-between gap-4 mb-12">
          <div>
            <div className="mb-6 sm:mb-4 gap-1 flex justify-center sm:justify-start">
              <span className="bg-white opacity-80 text-black rounded-full py-0.5 px-3 text-xs">
                {show.seasons} {show.season === 1 ? "Season" : "Seasons"}
              </span>
              <span className="bg-white opacity-80 text-black rounded-full py-0.5 px-3 text-xs">{show.ongoing ? "Ongoing" : "Completed"}</span>
              <span className={`${show.age_rating ? "block" : "hidden"} bg-white opacity-80 text-black rounded-full py-0.5 px-3 text-xs`}>{show.age_rating}</span>
            </div>
            <h2 className="text-wrap text-lg opacity-80">{show?.description ?? "No description"}</h2>
            <Tab show={show} />
          </div>
          <ShowDetailAside
            showId={show.show_id}
            show={{
              show_id: show.show_id,
              name: show.name,
              img_vertical: show.img_vertical,
              seasons: show.seasons,
            }}
            userChoices={userChoices}
            userRating={userRating}
            initialReview={userReview.data ?? null}
          />
        </article>
        <Reviews showId={show.show_id} />
      </section>
    </main>
  );
}
