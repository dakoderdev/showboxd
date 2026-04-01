import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ShowListSection from "./components/showListSection";
import HeroSection from "./sections/heroSection";
import SponsorSection from "./sections/sponsorSection";

const shuffleAndSlice = (array: any[], amount: number) => {
  const shuffled = [...array]; // Copy to avoid mutating original data
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, amount);
  };

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: shows } = await supabase.from("shows").select();

  const randomShows = shuffleAndSlice(shows || [], 3);

  return (
    <>
      <HeroSection randomShows={randomShows} />
      <SponsorSection />
      <ShowListSection shows={shows}>Popular Shows</ShowListSection>
    </>
  );
}
