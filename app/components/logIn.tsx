"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

export default function LogIn() {
    const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    
  if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // 3. Redirect inside the handler after success
      router.push("/");
      router.refresh(); // Optional: clears the cache to show logged-in state
    }
  };

 return (
    <div className="flex flex-col items-stretch gap-8 w-full max-w-xs">
      <div className="flex flex-col w-full items-stretch gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Log In</h1>
        <p className="text-white/50 text-sm">
          Don't have an account?{" "}
          <a href="/auth/sign-up" className="text-white hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleLogIn} className="flex flex-col items-stretch w-full gap-3">
        <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
        <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
        <button disabled={loading} className="w-full bg-gray-200 hover:bg-white text-black font-medium py-2.5 px-6 rounded-full text-sm transition-colors disabled:opacity-50">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })} className="w-full py-2.5 px-4 rounded-full border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-colors">
          Continue with Google
        </button>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: window.location.origin } })} className="w-full py-2.5 px-4 rounded-full border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-colors">
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}