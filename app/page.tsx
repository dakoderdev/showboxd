import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ShowListTop10 from "./components/showListTop10";
import HeroSection from "./sections/heroSection";
import SponsorSection from "./sections/sponsorSection";

const shuffleAndSlice = (array: any[], amount: number) => {
  const shuffled = [...array]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, amount);
};

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: allShows } = await supabase.from("shows").select();

  const { data: top10Data } = await supabase
    .from('most_watched_shows')
    .select(`
      show_id,
      watch_count,
      shows!inner (
        name,
        img_vertical
      )
    `)
    .limit(10);

  const randomShows = shuffleAndSlice(allShows || [], 3);

  return (
    <>
      <HeroSection randomShows={randomShows} />
      <SponsorSection />
      
      {/* Pass the specialized Top 10 data here */}
      <ShowListTop10 bestShows={top10Data || []} />
    </>
  );
}