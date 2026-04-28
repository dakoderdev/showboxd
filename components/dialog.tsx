"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export type ShowLogSummary = {
  show_id: string | number;
  name: string;
  img_vertical: string;
  seasons: number;
};

function StarRating({ rating, setRating }: { rating: number; setRating: (r: number) => void }) {
  const handleStarClick = (index: number, half: number) => () => {
    const newRating = index * 2 + half;
    setRating(newRating === rating ? 0 : newRating);
  };

  return (
    <div aria-valuenow={rating} className="flex" role="slider" aria-valuemin={0} aria-valuemax={10} aria-label="Rating">
      {[...Array(5)].map((_, index) => {
        const full = index * 2 + 2 <= rating;
        const halfStar = !full && index * 2 + 1 <= rating;
        const fillPercent = full ? 100 : halfStar ? 50 : 0;

        return (
          <div key={index} className="relative inline-block w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/10 stroke-[0.5px] stroke-white/10" viewBox="0 0 24 24" fill="currentColor">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-300/90 absolute inset-0" viewBox="0 0 24 24" fill="currentColor" style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
            </svg>
            <button type="button" onClick={handleStarClick(index, 1)} className="absolute inset-y-0 left-0 w-1/2 cursor-pointer" aria-label={`${index + 1} stars half`} />
            <button type="button" onClick={handleStarClick(index, 2)} className="absolute inset-y-0 right-0 w-1/2 cursor-pointer" aria-label={`${index + 1} stars full`} />
          </div>
        );
      })}
    </div>
  );
}

function LikeButton({ liked, setLiked }: { liked: boolean; setLiked: (l: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => setLiked(!liked)}
      className={`group flex flex-col w-12 h-12 items-center justify-center cursor-pointer transition-colors
        ${liked ? "text-blue-300" : "text-white/10"}`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg className={`${liked ? "" : "stroke-[0.5px] stroke-white/10"} group-hover:scale-105 transition-all group-active:scale-110 w-6 h-6`} viewBox="0 0 24 24" fill="currentColor">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
      </svg>
    </button>
  );
}

type UserChoices = { saved: boolean; watched: boolean; liked: boolean };

type InitialReview = { rating: number | null; comment: string | null } | null;

export default function LogShowDialog({ open, onClose, show, userChoices, initialReview }: { open: boolean; onClose: () => void; show: ShowLogSummary; userChoices: UserChoices; initialReview: InitialReview }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const seasonCount = Math.min(Math.max(Number(show.seasons) || 1, 1), 24);

  const [saving, setSaving] = useState(false);

  // Use useMemo to compute initial state based on props
  const initialFormState = useMemo(
    () => ({
      mode: "date" as "date" | "before",
      watchedDate: new Date().toISOString().split("T")[0],
      finished: true,
      seasons: Array(seasonCount).fill(false),
      rating: initialReview?.rating ?? 0,
      liked: !!userChoices.liked,
      thoughts: initialReview?.comment?.trim() ?? "",
    }),
    [seasonCount, initialReview?.rating, initialReview?.comment, userChoices.liked],
  );

  const [formState, setFormState] = useState(initialFormState);


  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onDialogClose = () => onClose();
    el.addEventListener("close", onDialogClose);
    return () => el.removeEventListener("close", onDialogClose);
  }, [onClose]);

  const toggleSeason = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      seasons: prev.seasons.map((s, i) => (i === index ? !s : s)),
    }));
  };

  const requestClose = () => {
    dialogRef.current?.close();
  };

  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();
    if (saving) return;

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Log in to log your watch!");
      setSaving(false);
      return;
    }

    const showId = show.show_id;

    const { error: interactionError } = await supabase.from("show_interaction").upsert(
      {
        show_id: showId,
        user_id: user.id,
        watched: true,
        liked: formState.liked,
        saved: userChoices.saved,
      },
      { onConflict: "show_id,user_id" },
    );

    if (interactionError) {
      console.error("Supabase error:", interactionError.message);
      alert("Could not save your watch status.");
      setSaving(false);
      return;
    }

    const comment = formState.thoughts.trim() || null;
    const today = new Date().toISOString().split("T")[0];

    if (formState.rating > 0 || comment !== null) {
      console.log("attempting review upsert");
      const { error: reviewError } = await supabase.from("reviews").upsert(
        {
          show_id: showId,
          user_id: user.id,
          rating: formState.rating > 0 ? formState.rating : 0,
          comment: comment,
          watched_at: formState.mode === "date" ? (formState.watchedDate === today ? new Date().toISOString() : new Date(formState.watchedDate).toISOString()) : null,
          seasons_watched: formState.finished ? Array.from({ length: seasonCount }, (_, i) => i + 1) : formState.seasons.some(Boolean) ? formState.seasons.map((s, i) => (s ? i + 1 : null)).filter((n): n is number => n !== null) : null,
        },
        { onConflict: "show_id,user_id" },
      );
      console.log("review result:", reviewError);

      if (reviewError) {
        console.error("Supabase error:", reviewError.message);
        setSaving(false);
        alert("Watch saved, but the review could not be saved.");
        return;
      }
    }

    setSaving(false);
    router.refresh();
    requestClose();
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) requestClose();
      }}
      className="fixed flex justify-center items-center bg-transparent w-full max-w-[100vw] top-1/2 left-1/2 -translate-1/2 outline-0 backdrop:bg-background/80 backdrop:backdrop-blur-xs open:flex"
    >
      <div className="p-4 z-2 rounded-2xl w-full max-w-xl bg-background border border-white/20 shadow-sm shadow-black/70 text-white relative">
        <button type="button" onClick={requestClose} className="absolute top-3 right-3 text-white/40 hover:text-white text-sm">
          ✕
        </button>
        <p className="text-lg font-medium pb-2 mb-6 border-b border-white/10 w-full">I watched…</p>
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-sm text-white/80 @container">
          <section className="flex flex-wrap gap-4 justify-between px-4 @lg:px-8">
            <label className="flex flex-wrap items-center gap-2">
              <input type="radio" name="watch-mode" className="accent-blue-300" checked={formState.mode === "date"} onChange={() => setFormState((prev) => ({ ...prev, mode: "date" }))} />
              Watched on
              <input type="date" value={formState.watchedDate} onChange={(ev) => setFormState((prev) => ({ ...prev, watchedDate: ev.target.value }))} disabled={formState.mode !== "date"} className="ml-2 bg-neutral-800 border border-white/10 rounded px-2 py-1 text-xs disabled:opacity-40" />
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="watch-mode" className="accent-blue-300" checked={formState.mode === "before"} onChange={() => setFormState((prev) => ({ ...prev, mode: "before" }))} />
              I&apos;ve watched this before
            </label>
            <div className="flex flex-col @md:flex-row w-full gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-300" checked={formState.finished} onChange={() => setFormState((prev) => ({ ...prev, finished: !prev.finished }))} />I finished the show
              </label>
              {!formState.finished && (
                <div className="flex flex-col grow gap-1">
                  <span className="text-xs text-white/60">Seasons watched:</span>
                  <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(73px,1fr))]">
                    {formState.seasons.map((s, i) => (
                      <label key={i} className="flex items-center gap-2 text-xs">
                        <input type="checkbox" className="text-nowrap" checked={s} onChange={() => toggleSeason(i)} />
                        Season {i + 1}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          <textarea value={formState.thoughts} onChange={(ev) => setFormState((prev) => ({ ...prev, thoughts: ev.target.value }))} placeholder="Write your thoughts…" className="min-h-[140px] resize-none bg-neutral-800 border border-white/10 rounded-lg p-2" />
          <section className="flex gap-3 items-center flex-wrap">
            <div className="flex-1 min-w-0 h-12 flex items-center justify-left gap-2">
              <StarRating rating={formState.rating} setRating={(rating) => setFormState((prev) => ({ ...prev, rating }))} />
            </div>
            <LikeButton liked={formState.liked} setLiked={(liked) => setFormState((prev) => ({ ...prev, liked }))} />
            <button type="submit" disabled={saving} className="relative w-24 py-3 px-2 bg-gray-200 text-black font-medium hover:bg-white cursor-pointer transition-colors overflow-hidden rounded-full flex items-center justify-center z-2 save disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? "…" : "Save"}
            </button>
          </section>
        </form>
      </div>
      <figure className="relative hidden lg:block w-fit h-fit -ml-6 before:inset-0 before:absolute -translate-x-1/8 rotate-3 before:ring-2 before:ring-inset before:ring-white/10 before:rounded-xl shadow-md shadow-black/30">
        <Image className="rounded-xl object-cover" src={show.img_vertical} alt={show.name} width={200} height={300} sizes="200px" />
      </figure>
    </dialog>
  );
}
