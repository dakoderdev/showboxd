"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function MainButtons({ showId, userChoices}: { showId: number; userChoices: { saved: boolean; watched: boolean; liked: boolean }}) {
  const [choices, setChoices] = useState(userChoices || { saved: false, watched: false, liked: false });
  const router = useRouter();
  const supabase = createClient();

  const handleToggle = async (label: string) => {
    const column = label.toLowerCase() === "save" ? "saved" : label.toLowerCase() === "watched" ? "watched" : "liked";

    const key = column as keyof typeof choices;
    const oldValue = choices[key];
    const newValue = !oldValue;

    setChoices((prev) => ({ ...prev, [key]: newValue }));

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Log in to track your shows!");
      setChoices((prev) => ({ ...prev, [key]: oldValue }));
      return;
    }

    const { error } = await supabase.from("show_interaction").upsert(
      {
        show_id: showId,
        user_id: user.id,
        [column]: newValue,
      },
      { onConflict: "show_id,user_id" },
    );

    if (error) {
      console.error("Supabase error:", error.message);
      setChoices((prev) => ({ ...prev, [key]: oldValue }));
    } else {
      router.refresh();
    }
  };

  return (
    <article className="place-items-center lg:w-fit h-fit p-4 pb-3 gap-3 bg-neutral-900/70 border border-white/10 rounded-2xl grid grid-cols-3 w-full max-w-80 font-inter">
      {["Save", "Watched", "Like"].map((label, index) => {
        const stateKey = label.toLowerCase() === "save" ? "saved" : label.toLowerCase() === "watched" ? "watched" : "liked";

        const isSelected = choices[stateKey as keyof typeof choices];

        return (
          <button
            key={index}
            onClick={() => handleToggle(label)}
            className={`group flex flex-col w-12 gap-0.5 items-center justify-center cursor-pointer transition-colors
              ${isSelected ? "text-indigo-300/65" : "text-white/10"}`}
          >
            <svg className={`${isSelected ? "stroke-[0.5px] stroke-indigo-400/65" : "stroke-[0.5px] stroke-white/10"} sm:group-hover:scale-105 transition-all text-inherit group-hover:active:scale-110 w-14 h-14 sm:w-[2.7rem] sm:h-[2.7rem]" width={44} height={44}`} viewBox="0 0 24 24" fill="currentColor">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              {label === "Save" && <path d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z" />}
              {label === "Watched" && <path d="M12 4c4.29 0 7.863 2.429 10.665 7.154l.22 .379l.045 .1l.03 .083l.014 .055l.014 .082l.011 .1v.11l-.014 .111a.992 .992 0 0 1 -.026 .11l-.039 .108l-.036 .075l-.016 .03c-2.764 4.836 -6.3 7.38 -10.555 7.499l-.313 .004c-4.396 0 -8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />}
              {label === "Like" && <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />}
            </svg>
            <p className="text-white/80 text-xs self-stretch text-center">{label}</p>
          </button>
        );
      })}
    </article>
  );
}

export function Ratings({ showId, userRating }: { showId: string; userRating: number | null }) {
  const router = useRouter();
  const supabase = createClient();

  const [rating, setRating] = useState(userRating || 0);
  const handleStarClick = (index: number, half: number) => async () => {
    const newRating = index * 2 + half;
    const previousRating = rating;
    setRating(newRating);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Log in to rate shows!");
      setRating(previousRating);
      return;
    }

    const { error } = await supabase.from("reviews").upsert(
      {
        show_id: showId,
        user_id: user.id,
        rating: newRating,
      },
      { onConflict: "show_id,user_id" },
    );

    if (error) {
      console.error("Supabase error:", error.message);
      setRating(previousRating);
    } else {
      router.refresh();
    }
  };
  return (
    <article className="bg-neutral-900/70 border border-white/10 p-4 rounded-2xl text-white/80 justify-center gap-2 flex w-full max-w-80 items-center">
      <span className="text-xs">Stars:</span>
      <div aria-valuenow={rating} className="flex">
        {[...Array(5)].map((_, index) => {
          const full = index * 2 + 2 <= rating;
          const half = !full && index * 2 + 1 <= rating;
          const fillPercent = full ? 100 : half ? 50 : 0;

          return (
            <div key={index} className="relative inline-block w-10 h-10 sm:w-6 sm:h-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-300/90 absolute inset-0" viewBox="0 0 24 24" fill="currentColor" style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
              </svg>
              <button onClick={handleStarClick(index, 1)} className="absolute inset-y-0 left-0 w-1/2 cursor-pointer" />
              <button onClick={handleStarClick(index, 2)} className="absolute inset-y-0 right-0 w-1/2 cursor-pointer" />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function ShowDetailAside({ showId, userChoices, userRating }: { showId: number; userChoices: { saved: boolean; watched: boolean; liked: boolean }; userRating: number | null }) {
  return (
    <aside className="shrink-0 flex flex-col items-center md:items-stretch gap-2 pt-2">
      <MainButtons showId={showId} userChoices={userChoices} />
      <Ratings showId={showId.toString()} userRating={userRating} />
      <article className="bg-neutral-900/70 border border-white/10 p-2 rounded-2xl text-white/80 justify-center flex w-full max-w-80 flex-col items-stretch">
        <button className="text-xs hover:bg-neutral-200/10 px-3 py-1 transition-colors rounded-lg text-center">Show your activity</button>
        <button className="text-xs hover:bg-neutral-200/10 px-3 py-1 transition-colors rounded-lg text-center">Review or log...</button>
        <button className="text-xs hover:bg-neutral-200/10 px-3 py-1 transition-colors rounded-lg text-center">Add to lists...</button>
        <button className="text-xs hover:bg-neutral-200/10 px-3 py-1 transition-colors rounded-lg text-center">Share</button>
      </article>
    </aside>
  );
}
