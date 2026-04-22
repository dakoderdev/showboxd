"use client";

import { createClient } from "@/utils/supabase/client"; 
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <button 
      onClick={handleLogOut}
      className="mt-4 px-4 py-1 border border-white/10 rounded-full"
    >
      Log Out
    </button>
  );
}