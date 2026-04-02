import Image from "next/image";
import Link from "next/link";

type ShowListProps = { shows: { show_id: number; name: string; img_vertical: string }[] | null };

const generateRandomViewsTest = ({shows, amount}: { shows: ShowListProps["shows"]; amount:number }) => {
  if (shows === null) return [];
  const showsWithViews = shows.map((show) => ({
    ...show,
    views: Math.floor(Math.random() * 10000000),
  }));
  return showsWithViews.sort((a, b) => b.views - a.views).slice(0, amount);
};

export default function ShowListAll({ shows }: ShowListProps) {
  const bestShows = generateRandomViewsTest({ shows, amount: 4 });
  return (
    <section className="relative w-full px-0 py-2 mb-6 sm:px-17">
      <div className="flex flex-col gap-4 px-4 sm:px-0 pb-4">
        <h2 className="text-6xl tracking-tighter text-foreground/90 font-semibold"><strong className="gradient-text bg-clip-text text-white/70 font-semibold">Popular shows</strong> this week</h2>
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(256px,1fr))] gap-3">
          {bestShows.map((show, index ) => (
            <Link key={index} href={`/shows/${show.show_id}`} className="relative cursor-pointer w-full min-h-96 shadow-md shadow-black/30 rounded-2xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl">
              <Image key={show.show_id} src={show.img_vertical} width={256} height={384} alt={show.name} className="object-cover w-full h-full" />
            </Link>
          ))}
        </div>
        <Link href="/shows/all" className="self-center px-6 py-3 bg-white rounded-full text-black">View All</Link>
      </div>
    </section>
  );
}
