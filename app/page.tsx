import { getShows, getTop10Shows, getReviews } from "@/utils/supabase/queries";
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

export default async function Page() {
  const [heroPool, top10Data, reviews] = await Promise.all([
    getShows(HERO_RANDOM_POOL),
    getTop10Shows(),
    getReviews({ isComment: true, limit: 3, uniquePerUser: true })
  ]);

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
