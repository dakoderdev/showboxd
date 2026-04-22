"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
interface HeroSectionProps {
  randomShows: Array<{ show_id?: string; img_vertical?: string }>;
}

const HERO_PHRASES = ["Keep track of shows you've watched!", "Save the shows that you want to see", "Check in and interact with your friends"] as const;

export default function Header({ randomShows }: HeroSectionProps) {
  const phraseRef = useRef<HTMLHeadingElement>(null);
  const [getStartedLink, setGetStartedLink] = useState("/auth/signup");
  const supabase = createClient();

  useEffect(() => {
    const phraseChange = (opacity: number, y: number) => {
      const style = phraseRef.current?.style;
      if (!style) return;
      style.opacity = opacity.toString();
      style.transform = `translateY(${y}px)`;
    };

    let currentIndex = 0;
    let pendingPhraseTimeout: ReturnType<typeof setTimeout> | undefined;

    const intervalId = setInterval(() => {
      const el = phraseRef.current;
      if (!el) return;
      phraseChange(0, 4);

      if (pendingPhraseTimeout) clearTimeout(pendingPhraseTimeout);
      pendingPhraseTimeout = setTimeout(() => {
        currentIndex = (currentIndex + 1) % HERO_PHRASES.length;
        el.textContent = HERO_PHRASES[currentIndex];
        el.style.transition = "none";
        phraseChange(0, -4);
        void el.offsetHeight;
        el.style.transition = "all 0.6s ease";
        phraseChange(1, 0);
      }, 560);
      84;
    }, 8000);

    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setGetStartedLink("/shows");
      } else {
        setGetStartedLink("/auth/signup");
      }
    };

    checkUser();

    return () => {
      clearInterval(intervalId);
      if (pendingPhraseTimeout) clearTimeout(pendingPhraseTimeout);
    };
  }, []);

  return (
    <header className="relative w-full grid lg:grid-cols-2 h-fit bg-linear-to-b from-background to-black/90 sm:px-16">
      <div className="flex flex-col items-center sm:items-start self-center mb-5 lg:mb-16">
        <div className="hidden sm:flex gap-2">
          <span className="bg-background border border-white/20 shadow-xs shadow-pink-400/15  py-1 px-3 rounded-full">+50000 users</span>
          <span className="bg-background border border-white/20 shadow-xs shadow-pink-400/15  py-1 px-3 rounded-full">All your favorite shows</span>
        </div>
        <h1 ref={phraseRef} className="text-6xl text-center sm:text-start pt-7 px-3 md:px-0 sm:pt-3 pb-3 md:pb-6 tracking-tighter font-semibold text-balance var(--font-geist-sans) transition-all duration-560">
          {HERO_PHRASES[0]}
        </h1>
        <Link href={getStartedLink} id="main-button" className="bg-gray-200 text-black mb-3 font-medium relative z-2 hover:bg-white py-3 px-6 rounded-full overflow-hidden transition-colors duration-300">
          Get Started
        </Link>
      </div>
      <div className="relative mb-12 h-fit">
        <Link href={`/shows/${randomShows[0]?.show_id ?? "#"}`} className="z-30 absolute left-1/3 sm:left-1/5 -translate-x-1/3 pointer-events-none sm:pointer-events-auto sm:-translate-x-1/4 top-12 w-56 h-84 md:w-64 md:h-96 aspect-2/3 bg-neutral-900 shadow-md shadow-black/30 rounded-2xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl -rotate-3 hover:translate-y-0 sm:hover:-translate-y-2 delay-75 transition-transform">
          <Image priority src={randomShows[0]?.img_vertical ?? "/placeholder.png"} alt="Hero show image" width={256} height={384} className="w-full h-full object-cover" />
        </Link>
        <Link href={`/shows/${randomShows[1]?.show_id ?? "#"}`} className="z-40 relative block mx-auto top-4 w-56 h-84 md:w-64 md:h-96 bg-neutral-900 overflow-hidden shadow-md shadow-black/30 rounded-2xl before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl hover:translate-y-0 sm:hover:-translate-y-2 delay-75 transition-transform">
          <Image priority src={randomShows[1]?.img_vertical ?? "/placeholder.png"} alt="Hero show image" width={256} height={384} className="w-full h-full object-cover" />
        </Link>
        <Link href={`/shows/${randomShows[2]?.show_id ?? "#"}`} className="z-30 absolute right-1/3 sm:right-1/5 translate-x-1/3 pointer-events-none sm:pointer-events-auto sm:translate-x-1/4 top-12 w-56 h-84 md:w-64 md:h-96 bg-neutral-900 overflow-hidden shadow-md shadow-black/30 rounded-2xl before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl rotate-3 hover:translate-y-0 sm:hover:-translate-y-2 delay-75 transition-transform">
          <Image priority src={randomShows[2]?.img_vertical ?? "/placeholder.png"} alt="Hero show image" width={256} height={384} className="w-full h-full object-cover" />
        </Link>
      </div>
      <div className="absolute inset-x-4 bottom-0 sm:-bottom-5 h-12 gradient-rainbow opacity-85 md:rounded-xl blur-3xl"></div>
    </header>
  );
}
