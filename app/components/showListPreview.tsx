import Image from "next/image";
import Link from "next/link";

type ShowListProps = {
  popularShows: { show_id: number; name: string; img_vertical: string }[] | null;
};

export default function ShowListPreview({ popularShows }: ShowListProps) {
  return (
    <section className="relative w-full px-0 py-2 mb-6 sm:px-17 bg-background">
      <div className="flex flex-col gap-4 px-4 sm:px-0 pb-4">
        <h2 className="text-6xl tracking-tighter text-foreground/90 font-semibold"><strong className="gradient-text bg-clip-text text-white/70 font-semibold">Popular shows</strong> this week</h2>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-3">
          {popularShows?.map((show) => (
            <Link key={show.show_id} href={`/shows/${show.show_id}`} className="relative cursor-pointer w-full min-h-96 shadow-md shadow-black/30 rounded-2xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl">
              <Image priority src={show.img_vertical} width={256} height={384} alt={show.name} className="object-cover w-full h-full" />
            </Link>
          ))}
        </div>
        <Link href="/shows/all?popular=this-week" className="self-center px-6 py-3 bg-white rounded-full text-black">View All</Link>
      </div>
    </section>
  );
}

