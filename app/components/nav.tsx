import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="z-999 backdrop-blur-md shadow-xs sm:shadow-none bg-neutral-300/20 sm:bg-transparent sm:backdrop-blur-none flex w-full px-0 sm:px-3.5 fixed font-inter top-0 sm:top-3.5 text-black ring-inset justify-between left-1/2 -translate-x-1/2 items-center">
      <Link href="/#home" className="group flex justify-center items-center h-10 w-10 sm:bg-neutral-300/20 sm:backdrop-blur-md sm:rounded-full shadow-none sm:shadow-xs sm:shadow-neutral-950/10 self-stretch text-white">
        <Image className="text-white h-7 sm:group-hover:scale-90 transition-transform" src="/logo.svg" alt="Showboxd logo, with an S in the shape of a movie popcorn holder" priority width="35" height="36" />
      </Link>
      <div className="flex h-10 gap-1 sm:gap-2">
        <ul className="flex items-stretch sm:gap-1 sm:bg-neutral-300/20 sm:backdrop-blur-md p-1 xs:p-2 sm:rounded-full shadow-none sm:shadow-xs sm:shadow-neutral-950/10">
          <li className="rounded-full w-fit hover:bg-white text-white hover:text-black target:bg-white transition-colors">
            <Link className="hidden sm:flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem]" href="/#home">
              Home
            </Link>
          </li>
          <li className="rounded-full w-fit hover:bg-white text-white hover:text-black target:bg-white transition-colors">
            <Link className="flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem]" href="#">
              Shows
            </Link>
          </li>
        </ul>
        <ul className="flex h-10 sm:gap-1 bg-white p-1 xs:p-2 rounded-l-full sm:rounded-full shadow-none sm:shadow-xs sm:shadow-neutral-950/10">
          <li className="rounded-full w-fit hover:bg-black hover:text-white transition-colors">
            <Link className="flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem] text-nowrap" href="#">
              Log-in
            </Link>
          </li>
          <li className="rounded-full w-fit bg-black text-white transition-all">
            <Link className="flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem] text-nowrap" href="#">
              Sign-up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
