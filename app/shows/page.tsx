import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ShowListAll from "@/components/showListAll";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: shows } = await supabase.from("shows").select();
  return (
    <>
      <section className="flex justify-center items-center gap-4 w-full px-0 py-4 sm:px-17">
        <div className="fixed -z-1 inset-x-4 top-0 -translate-y-1/2 h-7 gradient-rainbow opacity-85 rounded-xl blur-3xl"></div>
        <div className="flex w-fit py-6 px-8 gap-4 bg-neutral-900/60 backdrop-blur-sm rounded-full">
          <p>Browse By:</p>
          <select className="pl-2 w-30" name="year" defaultValue="Year" >
            <option value="" disabled selected hidden>Year</option>
            <option value="2020s">2020s</option>
            <option value="2010s">2010s</option>
            <option value="2000s">2000s</option>
            <option value="1990s">1990s</option>
          </select>
          <select className="pl-2 w-30" name="year" defaultValue="Rating" >
            <option value="" disabled selected hidden>Rating</option>
            <option>Highest First</option>
            <option>Lowest First</option>
          </select>
          <select className="pl-2 w-30" name="year" defaultValue="Popular" >
            <option disabled selected hidden>Popular</option>
            <option>All Time</option>
            <option>This Year</option>
            <option>This Month</option>
            <option>This Week</option>
          </select>
        </div>
        <div>
          <input type="text" placeholder="Search Show" className="py-6 px-8 rounded-full border border-white/10 bg-background/40 shadow-md shadow-black/30" />
        </div>
      </section>
      <ShowListAll shows={shows}>Popular Shows</ShowListAll>
    </>
  );
}
