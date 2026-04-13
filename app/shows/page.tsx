import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import RainbowGlow from "../../components/rainbowGlow";
import ShowListPreview from "../../components/showListPreview";
import ShowsBrowseFilters from "../../components/showsBrowseFilters";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: watchedData } = await supabase.from("most_watched_shows").select("show_id, watch_count").order("watch_count", { ascending: false }).limit(4);

  const topShowIds = watchedData?.map((r) => r.show_id) ?? [];

  const { data: popularShows } = await supabase.from("shows").select("show_id, name, img_vertical").in("show_id", topShowIds);

  const sortedPopularShows = topShowIds.map((id) => popularShows?.find((show) => show.show_id === id)).filter((s): s is NonNullable<typeof s> => s != null);

  return (
    <>
      <section className="flex justify-center items-center gap-4 w-full px-0 bg-linear-to-b from-transparent from-30% to-background py-4 sm:px-12  md:px-17">
        <RainbowGlow />
        <ShowsBrowseFilters />
      </section>
      <ShowListPreview popularShows={sortedPopularShows} />
    </>
  );
}
