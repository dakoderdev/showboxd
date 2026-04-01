export function MainButtons() {
  return (
    <article className='place-items-center lg:w-fit h-fit p-4 pb-3 gap-3 bg-white rounded-2xl grid grid-cols-3 font-inter'> 
      {['Save', 'Watched', 'Like'].map((label, index) => (
        <button
          key={index}
          className={`group flex flex-col w-12 gap-0.5 items-center justify-center cursor-pointer ${false ? 'text-blue-500' : 'text-black'}`}
        >
          <svg className='sm:group-hover:scale-105 transition-all text-inherit group-hover:active:scale-110 w-14 h-14 sm:w-[2.7rem] sm:h-[2.7rem]' width={44} height={44} viewBox="0 0 24 24" fill="currentColor">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            {label === 'Save' && <path d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z" />}
            {label === 'Watched' && <path d="M12 4c4.29 0 7.863 2.429 10.665 7.154l.22 .379l.045 .1l.03 .083l.014 .055l.014 .082l.011 .1v.11l-.014 .111a.992 .992 0 0 1 -.026 .11l-.039 .108l-.036 .075l-.016 .03c-2.764 4.836 -6.3 7.38 -10.555 7.499l-.313 .004c-4.396 0 -8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />}
            {label === 'Like' && <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />}
          </svg>
          <p className='text-black text-xs self-stretch'>{label}</p>
        </button>
      ))}
    </article>
  );
}

export function Ratings() {
  const ratingsValue = 4; // Example rating value
  return (
    <article className='bg-white p-4 rounded-2xl text-black justify-center gap-2 flex items-center'>
      <span className='text-xs'>Stars:</span>
      <div aria-valuenow={ratingsValue} className='flex'>
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            className={`inline-block hover:scale-105 cursor-pointer ${ratingsValue > index ? 'text-blue-500' : 'text-black'}`} // Apply class conditionally
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-6 sm:h-6 text-inherit transition-all" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" fill="currentColor"/>
            </svg>
          </button>
        ))}
      </div>
    </article>
  );
}

export default function ShowDetailAside() {
return (
<aside className='shrink-0 flex flex-col items-stretch gap-2 pt-2'> 
    <MainButtons />
    <Ratings />
    <article className="bg-white p-2 rounded-2xl text-black justify-center flex flex-col items-stretch">
    <button className="text-xs hover:bg-neutral-200/50 px-3 py-1 transition-colors rounded-lg text-center">Show your activity</button>
    <button className="text-xs hover:bg-neutral-200/50 px-3 py-1 transition-colors rounded-lg text-center">Review or log...</button>
    <button className="text-xs hover:bg-neutral-200/50 px-3 py-1 transition-colors rounded-lg text-center">Add to lists...</button>
    <button className="text-xs hover:bg-neutral-200/50 px-3 py-1 transition-colors rounded-lg text-center">Share</button>
    </article>
</aside>);
};