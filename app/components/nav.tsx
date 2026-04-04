"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

const supabase = createClient();

export function Account() {
  const [signedIn, setSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUserProfile(userId: string) {
      const { data, error } = await supabase.from("users").select("profile_picture").eq("user_id", userId).single();

      if (!mounted) return;

      if (!error && data?.profile_picture) {
        setProfilePicture(data.profile_picture);
      } else {
        setProfilePicture(null);
      }
    }

    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (user && !error) {
        setSignedIn(true);
        await loadUserProfile(user.id);
      } else {
        setSignedIn(false);
        setProfilePicture(null);
      }
    }

    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setSignedIn(true);
        await loadUserProfile(session.user.id);
      } else {
        setSignedIn(false);
        setProfilePicture(null);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

  if (signedIn) {
    return (
      <button className="items-center h-10 w-10" onClick={handleSignOut}>
        <Image src={profilePicture ?? "https://zxitfgxtpqfnxtcnwsbv.supabase.co/storage/v1/object/public/users/default.webp"} alt="User Avatar" width={32} height={32} className="rounded-full w-full h-full object-cover" />
      </button>
    );
  }

  return (
    <ul className="flex h-10 sm:gap-1 bg-white p-1 xs:p-2 rounded-l-full sm:rounded-full shadow-none sm:shadow-xs sm:shadow-gray-950/10">
      <li className="rounded-full w-fit hover:bg-black hover:text-white transition-colors">
        <Link href="/auth/log-in" className="flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem] text-nowrap">
          Log-in
        </Link>
      </li>
      <li className="rounded-full w-fit bg-black text-white transition-all">
        <Link href="/auth/sign-up" className="flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem] text-nowrap">
          Sign-up
        </Link>
      </li>
    </ul>
  );
}

export default function Nav() {
  return (
    <nav className="z-999 backdrop-blur-sm shadow-xs sm:shadow-none bg-neutral-700/40 sm:bg-transparent sm:backdrop-blur-none flex w-full px-0 sm:px-3.5 fixed font-inter top-0 sm:top-3.5 text-black ring-inset justify-between left-1/2 -translate-x-1/2 items-center">
      <Link href="/#home" className="group flex justify-center items-center h-10 w-10 sm:bg-neutral-700/40 sm:backdrop-blur-sm sm:rounded-full shadow-none sm:shadow-xs sm:shadow-gray-950/10 self-stretch text-white">
        <Image className="text-white h-7 sm:group-hover:scale-90 transition-transform" src="/logo.svg" alt="Showboxd logo, with an S in the shape of a movie popcorn holder" priority width="35" height="36" />
      </Link>
      <div className="flex h-10 gap-1 sm:gap-2">
        <ul className="flex items-stretch sm:gap-1 sm:bg-neutral-700/40 sm:backdrop-blur-sm p-1 xs:p-2 sm:rounded-full shadow-none sm:shadow-xs sm:shadow-gray-950/10">
          <li className="rounded-full w-fit hover:bg-neutral-100/65 target:bg-neutral-100/65 text-white hover:text-black transition-colors">
            <Link className="hidden sm:flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem]" href="/#home">
              Home
            </Link>
          </li>
          <li className="rounded-full w-fit hover:bg-neutral-100/65 target:bg-neutral-100/65 text-white hover:text-black transition-colors">
            <Link className="flex items-center w-full h-full py-1 px-4 text-sm sm:text-[0.938rem]" href="/shows">
              Shows
            </Link>
          </li>
        </ul>
        <Account />
      </div>
    </nav>
  );
}
