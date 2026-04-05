import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ShowListAll from "@/components/showListAll";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: watchedData } = await supabase.from("most_watched_shows").select("show_id, watch_count").order("watch_count", { ascending: false }).limit(4);

  const topShowIds = watchedData?.map((r) => r.show_id) ?? [];

  const { data: popularShows } = await supabase.from("shows").select("show_id, name, img_vertical").in("show_id", topShowIds);

  const sortedPopularShows = topShowIds
    .map((id) => popularShows?.find((show) => show.show_id === id))
    .filter((s): s is NonNullable<typeof s> => s != null);

  return (
    <>
      <section className="flex justify-center items-center gap-4 w-full px-0 py-4 sm:px-12  md:px-17">
        <div className="fixed -z-1 inset-x-4 top-0 -translate-y-1/2 h-7 gradient-rainbow opacity-85 rounded-xl blur-3xl"></div>
        <div className="flex w-fit py-6 px-8 gap-4 bg-neutral-900/60 backdrop-blur-sm rounded-full">
          <p>Browse By:</p>
          <select className="pl-2 w-30" name="year" defaultValue="Year">
            <option disabled hidden value="Year">
              Year
            </option>
            <option value="2020s">2020s</option>
            <option value="2010s">2010s</option>
            <option value="2000s">2000s</option>
            <option value="1990s">1990s</option>
          </select>
          <select className="pl-2 w-30" name="rating" defaultValue="Rating">
            <option disabled hidden value="Rating">
              Rating
            </option>
            <option value="Highest First">Highest First</option>
            <option value="Lowest First">Lowest First</option>
          </select>
          <select className="pl-2 w-30" name="popular" defaultValue="Popular">
            <option disabled hidden value="Popular">
              Popular
            </option>
            <option value="All Time">All Time</option>
            <option value="This Year">This Year</option>
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
        <div>
          <input type="text" placeholder="Search Show" className="py-6 px-8 rounded-full border border-white/10 bg-background/40 shadow-xs shadow-pink-400/10" />
        </div>
      </section>
      <ShowListAll popularShows={sortedPopularShows} />
    </>
  );
}
