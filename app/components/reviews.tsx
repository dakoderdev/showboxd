"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function Reviews() {
 return (
    <article>
      <div className="flex justify-between items-end pb-2 mb-8 border-b border-white/10">
        <h3 className="text-3xl font-medium text-white/80">Reviews</h3>
        <button className="border border-white/10 rounded-full py-0.5 px-4 font-inter text-white/80">
          {true ? "See Less" : "See More"}
        </button>
        </div>
    </article>
  );
}
