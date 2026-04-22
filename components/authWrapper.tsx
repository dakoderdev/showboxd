import Image from "next/image";

export default function AuthWrapper({children,}: {children: React.ReactNode}) {
    return(
        <section className="absolute top-0 grid md:grid-cols-2 w-full h-dvh">
            <div className="flex justify-center items-center w-full px-8 py-16">
                {children}
            </div>
            <Image  className="hidden md:block w-full h-full object-cover object-center opacity-70"  src="/authImages/severance.jpg" alt="Britt Lower and Adam Scott looking mysteriously in an office, Severance" height={1080} width={1080}/>
        </section>
    );
}