import Image from "next/image"

interface ImageContainerProps {
    source: string;
    alt: string;
}

export function ImageContainer({source, alt}: ImageContainerProps) {
    return (
        <Image src={source} alt={alt}
            width={180} height={80}
            className="my-auto inline-block mx-6 text-white w-max h-9 sm:h-9 max-w-44"/>
    )
}
import { ReactNode } from "react";

export function MarqueeContainer({ children }: { children: ReactNode[] }) {
    return (
        <div className="whitespace-nowrap overflow-hidden inline-block animate-slide">
            {children}
        </div>
    )
}

export function MarqueeGroup() {
    const images = {
        netflix: ["logo_netflix.svg", "Logo of Netflix"],
        disney: ["logo_disney+.svg", "Logo of Disney Plus"],
        max: ["logo_hbomax.svg", "Logo of HBO Max"],
        hulu: ["logo_hulu.svg", "Logo of Hulu"],
        amazon: ["logo_amazonprimevideo.svg", "Logo of Amazon Prime Video"],
        apple: ["logo_appletv.svg", "Logo of Apple TV"],
    }

    const imageKeys = Object.keys(images);
    
    return (
        <MarqueeContainer>
            {imageKeys.map((key, index) => (
                <ImageContainer key={index} source={`/marquee_logos/${images[key][0]}`} alt={images[key][1]} />
            ))}
            {imageKeys.map((key, index) => (
                <ImageContainer key={index + imageKeys.length} source={`/marquee_logos/${images[key][0]}`} alt={images[key][1]} />
            ))}
        </MarqueeContainer>
    )
}

export default function SponsorSection() {
    return (
        <section className='relative z-35 w-full py-10 sm:py-16 -mt-12 bg-background border-t border-white/10 whitespace-nowrap before:absolute before:inset-0 before:pointer-events-none before:bg-linear-to-r before:from-background before:via-transparent before:to-background before:z-40 overflow-hidden'>
            <MarqueeGroup />
            <MarqueeGroup />
        </section>
    )
} 