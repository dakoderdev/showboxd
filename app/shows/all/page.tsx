import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type ShowListProps = {
  popularShows: { show_id: number; name: string; img_vertical: string }[] | null;
};

export function ShowListAll({ popularShows }: ShowListProps) {
  return (
    <div className="flex flex-col w-full gap-4 px-4 sm:px-0 pb-4">
      <h2 className="text-6xl tracking-tighter text-foreground/90 font-semibold">
        <strong className="gradient-text bg-clip-text text-white/70 font-semibold">Popular shows</strong> this week
      </h2>
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
        {popularShows?.map((show) => (
          <Link key={show.show_id} href={`/shows/${show.show_id}`} className="relative cursor-pointer w-full min-h-64 shadow-md shadow-black/30 rounded-xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl">
            <Image src={show.img_vertical} width={170} height={255} alt={show.name} className="object-cover w-full h-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: watchedData } = await supabase.from("most_watched_shows").select("show_id, watch_count").order("watch_count", { ascending: false });

  const { data: allShows } = await supabase.from("shows").select("show_id, name, img_vertical");

  const watchedIds = watchedData?.map((r) => r.show_id) ?? [];

  const watchedInOrder = watchedIds
    .map((id) => allShows?.find((s) => s.show_id === id))
    .filter((s): s is NonNullable<typeof s> => s != null);
  const rest = allShows?.filter((s) => !watchedIds.includes(s.show_id)) ?? [];
  const sortedShows = [...watchedInOrder, ...rest];
  
  return (
    <section className="flex justify-center items-center gap-4 w-full px-0 py-4 sm:px-12  md:px-17">
      <ShowListAll popularShows={sortedShows} />
    </section>
  );
}
