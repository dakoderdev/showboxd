export function Review() {
  return (
    <article className="w-80 h-44 bg-background/80 border border-white/10 shadow-md rounded-2xl p-4 transition-colors">
      <div className="flex gap-3 items-center">
        <figure className="w-8 h-8 bg-white/50 rounded-full"></figure>
        <aside>
          <p className="text-white/60 font-semibold leading-tight">@HeyWhore</p>
          <p className="text-white/40 leading-tight">Hey Whore</p>
        </aside>
      </div>
    </article>
  );
}

export default function ReviewSection() {
  return (
    <section className="relative z-30 w-full py-16 overflow-hidden flex flex-col bg-background">
      <h2 className="text-6xl tracking-tighter opacity-90 font-semibold font-[family-name:var(--font-geist-sans)] text-center pb-8">
        <strong className="gradient-text bg-clip-text text-white/70 font-semibold">Reviews </strong>
        by Community
      </h2>
      <div className=" gap-1 pb-4">
        <div className="flex justify-center gap-4 px-12">
          <Review />
          <Review />
          <Review />
        </div>
      </div>
      <button className="self-center bg-background border border-white/10 rounded-full py-2 px-4">Join Discussion</button>
    </section>
  );
}