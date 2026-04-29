import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";


/*shows: {
  age_rating: string | null
  cast: Json | null
  crew: Json | null
  description: string | null
  img_vertical: string | null
  name: string
  ongoing: boolean | null
  release_year: number | null
  seasons: number | null
  show_id: number
  streaming_sites: Json | null*/

export const getShows = cache(async (limit: number = 10) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from("shows").select("show_id, img_vertical").limit(limit);
  return data ?? [];
});

type getShowById = {
  id: number;
  returnType?: "fullData" | "title";
};

export const getShowById = cache(async ({ id, returnType = "fullData" }: getShowById) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  switch (returnType) {
    case "fullData":
      return supabase.from("shows").select("*").eq("show_id", id).single();
    default:
      return supabase.from("shows").select("name").eq("show_id", id).single();
  }
});

export const getTop10Shows = cache(async () => {
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

/*reviews: 
  comment: string | null
  created_at: string
  id: number
  rating: number
  seasons_watched: number[] | null
  show_id: number
  user_id: string
  watched_at: string | null
*/

type getReview = {
  isComment: boolean;
  limit: number;
}


export const getReviews = cache(async ({isComment, limit} : getReview) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = isComment ? await supabase.from("reviews")
  .select("id, show_id, rating, comment, users(username, profile_picture), shows(name)")
  .filter("comment", "not.is", null)
  .limit(limit):
  await supabase.from("reviews")
  .select("id, show_id, rating, comment, users(username, profile_picture), shows(name)")
  .limit(limit);

  return data || [];
});