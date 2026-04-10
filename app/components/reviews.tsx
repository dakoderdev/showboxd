"use client";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_PROFILE_PICTURE = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "")}/storage/v1/object/public/users/default.webp`;

export default function Reviews() {
 return (
    <div>
      <div className="flex justify-between items-end pb-3 mb-2 border-b border-white/10">
        <h3 className="text-3xl font-medium text-white/80">Reviews</h3>
        <button className="bg-neutral-900/70 border border-white/10 text-sm rounded-full py-1 px-4 font-inter text-white/80">
          See More
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
        <Link href={"#"} className="border border-white/10 bg-neutral-900/20 rounded-2xl w-full min-h-54 shadow-sm p-4 shadow-black/80 transition-all">
          <div className="flex gap-4 items-center justify-between border-b border-white/5 pb-3 mb-2.5">
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8">
              <Image src={DEFAULT_PROFILE_PICTURE} alt="User Avatar" width={32} height={32} className="rounded-full w-full h-full object-cover" />
            </div>
            <div className="font-medium text-white/80">ThatIsDavid</div>
            </div>
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/10 stroke-[0.5px] stroke-white/10" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-white/70">I laughed. I cried. I fanboyed. I was screaming with all the other babies in the audience. Illumination finally won me over. So many sugary treats to enjoy!.</p>
        </Link>
      </div>
    </div>
  );
}
