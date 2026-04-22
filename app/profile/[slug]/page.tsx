import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import LogoutButton from "../../../components/logOutButton";
import Image from "next/image";
import { cookies } from "next/headers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getUser = cache(async (slug: string) => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data } = await supabase
    .from("users")
    .select("username, profile_picture")
    .eq("user_id", slug)
    .single();

  return data ?? null;
});

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const user = await getUser(slug);
  const title = user?.username || "Profile";

  return (
    <section className="flex justify-center items-center w-full px-8 py-16">
      <div className="w-full">
        <div className="flex gap-4 items-center">
          <Image src={user?.profile_picture} priority alt="User Avatar" width={100} height={100} className="rounded-full w-32 h-32 object-cover" />
          <div className="flex justify-between grow items-end border-b border-white/20 pb-3">
            <h1 className="text-5xl font-bold tracking-tight">{title}</h1>
            <LogoutButton />
          </div>
        </div>
      </div>
    </section>
  );
}