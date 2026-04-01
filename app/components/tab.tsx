"use client";
import { useState, useRef, useEffect } from 'react';

export function TabArray({ array } : { array: string[] }) {
    let newArray = array  || [];
    return (
        <div className="flex flex-wrap gap-2">
            {newArray.map((actor, index) => (
                <p className="text-xs py-1 px-2 border border-white/10 rounded-md text-white/80" key={index}>{actor}</p>
            ))}
        </div>
    )
}

export default function Tab({ show }: { show: { cast: string[]; crew: string[] } }) {
    const [selected, setSelected] = useState(0);
    const tabRefs = useRef([]);
    const tabArray = [
        <TabArray key="cast" array={show?.cast ?? []} />,
        <TabArray key="crew" array={show?.crew ?? []} />,
    ];

    return (
      <div className="flex flex-col gap-4 pb-6 sm:pb-0">
        <div className="border-b border-white/10 pt-3 flex gap-2">
        {['Cast', 'Crew'].map((tab, index) => (
          <button 
            key={index} 
            className={`${selected === index ? "bg-white text-black opacity-80" : "bg-none text-white opacity-40"} py-1 px-2 hover:opacity-80 hover:bg-white hover:text-black rounded-t-lg transition-all`}
          >
            {tab}
          </button>
        ))}
        </div>
        {tabArray.map((content, index) => (
          <div key={index} className={`${selected === index ? "block" : "hidden"}`}>
            {content}
          </div>
        ))}
      </div>
    )
}