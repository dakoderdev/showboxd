import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: shows } = await supabase.from("shows").select();

  return (
    <ul>
      {shows?.map((show, index) => (
        <li key={show.id ?? `${show.name}-${index}`}>
          <h2>{show.name}</h2>
          <Image src={show.img_vertical} alt={show.name} width={200} height={300} />
        </li>
      ))}
    </ul>
  );
}
