"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  randomShows: Array<{ show_id?: string; img_vertical?: string }>;
}

export default function Header({ randomShows }: HeroSectionProps) {
  const phraseArray = ["Keep track of shows you've watched!", "Save the shows that you want to see", "Check in and interact with your friends"];
  const phraseRef = useRef<HTMLHeadingElement>(null);

  function phraseChange(opacity, y) {
    const style = phraseRef.current?.style;
    if (!style) return;
    style.opacity = opacity;
    style.transform = `translateY(${y}px)`;
  }

  function phraseInterval() {
    let currentIndex = 0;
    
    setInterval(() => {
      const el = phraseRef.current;
      if (!el) return;
      phraseChange(0, 4);

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % phraseArray.length;
        el.textContent = phraseArray[currentIndex];
        el.style.transition = "none";
        phraseChange(0, -4);
        void el.offsetHeight;
        el.style.transition = "all 0.6s ease";
        phraseChange(1, 0);
      }, 600);
    }, 8000);
  }
  useEffect(() => {
    phraseInterval();
  }, []);

  return (
    <header className="relative w-full grid lg:grid-cols-2 h-fit bg-linear-to-b from-background to-black/90 px-0 sm:px-8 md:px-16">
      <div className="self-center mb-16">
        <span className="bg-background border border-white/20  py-1 px-3 mr-2 rounded-full">+50000 users</span>
        <span className="bg-background border border-white/20  py-1 px-3 rounded-full">All your favorite shows</span>
        <h1 ref={phraseRef} className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl line-clamp-2 pt-3 pb-6 tracking-tighter font-semibold text-balance var(--font-geist-sans) transition-all duration-600">
          {phraseArray[0]}
        </h1>
        <button id="main-button" className="bg-gray-200 text-black mb-3 font-medium relative z-2 hover:bg-white py-3 px-6 rounded-full overflow-hidden transition-colors duration-300">Get Started</button>
      </div>
      <div className="relative mb-12 h-fit">
        <Link href={`/shows/${randomShows[0]?.show_id ?? "#"}`} className="z-30 absolute left-1/5 -translate-x-1/3 pointer-events-none sm:pointer-events-auto sm:-translate-x-1/4 top-12 w-64 h-96 bg-neutral-900 shadow-md shadow-black/30 rounded-2xl overflow-hidden before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl -rotate-3 hover:translate-y-0 sm:hover:-translate-y-2 delay-75 transition-transform">
          <Image src={randomShows[0]?.img_vertical ?? "/placeholder.png"} alt="Hero show image" width={256} height={384} className="w-full h-full object-cover" />
        </Link>
        <Link href={`/shows/${randomShows[1]?.show_id ?? "#"}`} className="z-40 relative block mx-auto top-4 w-64 h-96 bg-neutral-900 overflow-hidden shadow-md shadow-black/30 rounded-2xl before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl hover:translate-y-0 sm:hover:-translate-y-2 delay-75 transition-transform">
          <Image src={randomShows[1]?.img_vertical ?? "/placeholder.png"} alt="Hero show image" width={256} height={384} className="w-full h-full object-cover" />
        </Link>
        <Link href={`/shows/${randomShows[2]?.show_id ?? "#"}`} className="z-30 absolute right-1/5 translate-x-1/3 pointer-events-none sm:pointer-events-auto sm:translate-x-1/4 top-12 w-64 h-96 bg-neutral-900 overflow-hidden shadow-md shadow-black/30 rounded-2xl before:inset-0 before:absolute before:pointer-events-none before:ring-2 before:ring-inset before:ring-white/10 before:rounded-2xl rotate-3 hover:translate-y-0 sm:hover:-translate-y-2 delay-75 transition-transform">
          <Image src={randomShows[2]?.img_vertical ?? "/placeholder.png"} alt="Hero show image" width={256} height={384} className="w-full h-full object-cover" />
        </Link>
      </div>
      <div className="absolute inset-x-4 -bottom-5 h-12 gradient-rainbow opacity-85 rounded-xl blur-3xl"></div>
    </header>
  );
}
