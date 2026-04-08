import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const usernameForUserId = cache(async (slug: string) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("users").select("username").eq("user_id", slug).single();
  return data?.username ?? null;
});

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const username = await usernameForUserId(slug);
  return {
    title: username || "Profile",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const username = await usernameForUserId(slug);
  const title = username || "Profile";

  return (
    <section className="flex justify-center items-center w-full px-8 py-16">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </section>
  );
}
