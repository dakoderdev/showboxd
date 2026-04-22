"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) setError(error.message);
    else setSuccess(true);

    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center justify-center">
        <div className="border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-3 max-w-xs w-full text-center">
          <p className="text-white text-sm">Check your email to confirm your account.</p>
          <p className="text-white/40 text-xs">{email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-8 w-full max-w-xs">
      <div className="flex flex-col w-full items-stretch gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="text-white/50 text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-white hover:underline">
            Log in
          </a>
        </p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleSignUp} className="flex flex-col items-stretch w-full gap-3">
        <input type="text" placeholder="Username" value={username} required onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
        <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
        <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors" />
        <button disabled={loading} className="w-full bg-gray-200 hover:bg-white text-black font-medium py-2.5 px-6 rounded-full text-sm transition-colors disabled:opacity-50">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })} className="w-full py-2.5 flex gap-2 items-center justify-center px-4 rounded-full border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-colors">
          <svg className="w-2.75 h-2.75 text-inherit" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
            <path
              fill="currentColor"
              d="M32.582 370.734C15.127 336.291 5.12 297.425 5.12 256c0-41.426 10.007-80.291 27.462-114.735C74.705 57.484 161.047 0 261.12 0c69.12 0 126.836 25.367 171.287 66.793l-73.31 73.309c-26.763-25.135-60.276-38.168-97.977-38.168-66.56 0-123.113 44.917-143.36 105.426-5.12 15.36-8.146 31.65-8.146 48.64 0 16.989 3.026 33.28 8.146 48.64l-.303.232h.303c20.247 60.51 76.8 105.426 143.36 105.426 34.443 0 63.534-9.31 86.341-24.67 27.23-18.152 45.382-45.148 51.433-77.032H261.12v-99.142h241.105c3.025 16.757 4.654 34.211 4.654 52.364 0 77.963-27.927 143.592-76.334 188.276-42.356 39.098-100.305 61.905-169.425 61.905-100.073 0-186.415-57.483-228.538-141.032v-.233z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
