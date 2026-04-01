import Image from "next/image";
import Link from "next/link";

type ShowProps = { show: { show_id: number; name: string; img_horizontal: string }; };

export function ShowHorizontal({ show }: ShowProps) {
    return (
      <Link href={`/shows/${encodeURIComponent(show.show_id.toString())}`} className="h-38 aspect-video outline-offset-0 rounded-lg snap-center sm:snap-start">
        <Image src={show.img_horizontal} alt={show.name} width={300} height={168.75} className="h-full w-full rounded-lg object-cover"/>
      </Link>
    );
}

type ShowListProps = { shows: { show_id: number; name: string; img_horizontal: string }[] | null; };
export function ShowList({ shows }: ShowListProps) {
  return (
    <div className="flex gap-3 sm:snap-x whitespace-nowrap overflow-x-scroll h-38 no-scrollbar sm:rounded-lg px-16 sm:pl-0 sm:pr-10">
      {shows?.map((show, index) => (
        <ShowHorizontal key={show.show_id ?? index} show={show} />
      ))}
    </div>
  );
}
export default function ShowListSection({ shows, children }: ShowListProps & { children: React.ReactNode }) {
  return (
      <section className="relative w-full px-0 py-10 sm:py-16 mb-6 sm:px-16 bg-background border-t border-white/10">
        <div className="flex flex-col gap-2 px-4 sm:px-0 sm:flex-row justify-between pb-4">
          <h2 className="text-5xl tracking-tight font-semibold">{ children }</h2>
          <Link href="#" className="w-fit flex flex-col self-end justify-end">
              <div className="flex items-center rounded-full border border-white/25 py-1 px-2 sm:py-2 sm:px-3 opacity-50 hover:opacity-80 transition-opacity">
                  <span className="px-1 sm:px-2 text-xs sm:text-base">See more</span>
                  <svg  xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-6 sm:h-6" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
              </div>
          </Link>
        </div>
      <ShowList shows={shows} />
    </section>
  )
}