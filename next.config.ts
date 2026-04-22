import type { NextConfig } from "next";

function supabaseStorageHostname(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return "zxitfgxtpqfnxtcnwsbv.supabase.co";
  try {
    return new URL(raw).hostname;
  } catch {
    return "zxitfgxtpqfnxtcnwsbv.supabase.co";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseStorageHostname(),
        pathname: "/storage/v1/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
