"use client";
import { useState, useRef, useEffect } from 'react';
import { MainButtons } from '@/pages/shows/[shows]';
import addOrRemove from '@/app/data/addOrRemoveEventListener';
const { addOrRemoveEventListeners } = addOrRemove;


export default function Tab({ castArray, crewArray }) {
    const [selected, setSelected] = useState(0);
    const tabRefs = useRef([]);
    const tabArray = [
        <Cast key="cast" castArray={castArray} />,
        <Crew key="crew" crewArray={crewArray} />,
    ];
    
    useEffect(() => {
      addOrRemoveEventListeners(true, tabRefs, handleClick);
      return () => {
        addOrRemoveEventListeners(false, tabRefs, handleClick);
      };
    }, []);
    
    const handleClick = (index: number) => {
      setSelected(index);
    };

    return (
      <div className="flex flex-col gap-4 pb-6 sm:pb-0">
        <div className="border-b border-white/10 pt-3 flex gap-2">
        {['Cast', 'Crew'].map((tab, index) => (
          <button 
            key={index} 
            ref={(el) => (tabRefs.current[index] = el)} 
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