import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type PageProps = {
    params: Promise<{ slug: string }>;
  };
  
  export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
  
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: user } = await supabase.from("users").select("username").eq("user_id", slug).single();

  
    return {
      title: user?.username || "Profile",
    };
  }

export default async function Page({ params }: PageProps) {
    const { slug } = await params;

    console.log(slug);
    return (
        <section className="flex justify-center items-center w-full px-8 py-16">
            <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>
        </section>
    );
}