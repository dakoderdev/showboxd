import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";
import ShowListTop10 from "../components/showListTop10";
import HeroSection from "./sections/heroSection";
import SponsorSection from "./sections/sponsorSection";
import ReviewSection from "../components/reviewsSection";

const HERO_RANDOM_POOL = 24;

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

const shuffleAndSlice = <T,>(array: T[], amount: number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, amount);
};

// Cache the data fetching functions
const getHeroPool = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("shows").select("show_id, img_vertical").limit(HERO_RANDOM_POOL);
  return data || [];
});

const getTop10Data = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("most_watched_shows")
    .select(
      `
    show_id,
    watch_count,
    shows!inner (
      name,
      img_vertical
    )
  `,
    )
    .limit(10);
  return data || [];
});

const getReviews = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("reviews").select("id, show_id, rating, comment, users(username, profile_picture), shows(name)").filter("comment", "not.is", null).limit(3);
  return data || [];
});

export default async function Page() {
  const [heroPool, top10Data, reviews] = await Promise.all([getHeroPool(), getTop10Data(), getReviews()]);

  const randomShows = shuffleAndSlice(heroPool, 3);

  return (
    <>
      <HeroSection randomShows={randomShows} />
      <SponsorSection />
      <ShowListTop10 bestShows={top10Data || []} />
      <ReviewSection reviews={reviews || []} />
    </>
  );
}
