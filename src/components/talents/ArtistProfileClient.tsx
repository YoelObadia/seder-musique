'use client';

import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Instagram, Globe, Mail } from 'lucide-react';
import SonicButton from '@/components/ui/SonicButton';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import ScrollReset from '@/components/utils/ScrollReset';
import BackButton from '@/components/ui/BackButton';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Extended interface for the full profile
export interface ArtistProfileData {
    name: string;
    role: string;
    image: string;
    slug: string;
    type: 'graine' | 'artiste'; // To control accent color (blue vs gold)
    bio: string[]; // Multiple paragraphs
    stats?: { label: string; value: string }[];
    gallery: string[]; // Array of image paths
    socials?: { platform: string; url: string }[];
}

interface ArtistProfileClientProps {
    artist: ArtistProfileData;
    lang: Locale;
    labels: {
        back: string;
        book: string;
        biography: string;
        gallery: string;
    };
}

export default function ArtistProfileClient({ artist, lang, labels }: ArtistProfileClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);

    const isRTL = lang === 'he';
    const accentColor = artist.type === 'graine' ? '#3B82F6' : '#FFD700';
    const accentClass = artist.type === 'graine' ? 'text-blue-500' : 'text-[#FFD700]';
    const borderClass = artist.type === 'graine' ? 'border-blue-500' : 'border-[#FFD700]';

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 1. Image Reveal (Scale + Opacity)
            tl.fromTo(heroImageRef.current,
                { scale: 1.1, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.5 }
            )
                // 2. Text Content Reveal (Fade Up)
                .fromTo('.animate-text',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
                    '-=1'
                )
                // 3. Stats/Gallery Stagger
                .fromTo('.animate-section',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
                    '-=0.5'
                );
        });

        // Simplified mobile animation
        mm.add("(max-width: 767px)", () => {
            gsap.fromTo('.animate-text',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2 }
            );
        });

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-white/20 pt-[var(--header-height)]" dir={isRTL ? 'rtl' : 'ltr'}>
            <ScrollReset />

            {/* Back Button - Standardized */}
            <BackButton href={`/${lang}/services/talents`} lang={lang} isRTL={isRTL} />

            {/* HERO SECTION - EDITORIAL SPLIT UPDATE */}
            <section className="relative min-h-[90vh] flex flex-col lg:grid lg:grid-cols-12 w-full bg-[#050505] pt-0">

                {/* 1. IMAGE SIDE (Mobile: Top, Desktop: Right 7 cols) -> Changed to Order 2 on Mobile? No, Image first is good context. */}
                {/* Using order-1 on mobile (image first) and order-last on desktop */}
                <div className="relative h-[50vh] lg:h-auto lg:col-span-7 lg:col-start-6 lg:row-start-1 w-full overflow-hidden order-1 lg:order-2">
                    <div ref={heroImageRef} className="absolute inset-0 w-full h-full">
                        <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover object-center"
                            priority
                            sizes="(max-width: 768px) 100vw, 60vw"
                        />
                        {/* Gradient Overlay for seamless blend on Desktop left edge and Mobile bottom edge */}
                        <div className="absolute inset-0 bg-gradient-to-t ltr:lg:bg-gradient-to-r rtl:lg:bg-gradient-to-l from-[#050505] via-transparent to-transparent opacity-90 lg:opacity-100" />
                    </div>
                </div>

                {/* 2. TEXT SIDE (Left 5 cols) */}
                <div className="relative z-10 lg:col-span-5 lg:col-start-1 lg:row-start-1 flex flex-col justify-center px-6 md:px-12 lg:ps-24 lg:pe-12 py-12 lg:py-0 order-2 lg:order-1 lg:h-auto -mt-12 md:-mt-24 lg:mt-0">
                    <div className="space-y-6 md:space-y-8 text-start max-w-xl">
                        <span className={`animate-text inline-block font-mono text-xs md:text-sm tracking-[0.2em] uppercase ${accentClass} bg-black/50 backdrop-blur-md px-3 py-1 rounded lg:bg-transparent lg:px-0`}>
                            {artist.role} — {artist.type === 'graine' ? 'R&D Talent' : 'R&D Artist'}
                        </span>

                        <h1 className="animate-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold uppercase leading-[0.9] tracking-tighter text-white drop-shadow-xl lg:drop-shadow-none">
                            {artist.name}
                        </h1>

                        {/* CTA */}
                        <div className="animate-text pt-4 md:pt-8 flex flex-col items-start gap-6">
                            <SonicButton
                                href={`/${lang}/contact`}
                                variant={artist.type === 'graine' ? 'talents' : 'production'}
                                className={`inline-block border ${borderClass} ${accentClass} hover:bg-white hover:text-black hover:border-white px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 text-center min-w-[200px]`}
                            >
                                {labels.book}
                            </SonicButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* BIO & CONTENT SECTION */}
            <section className="relative z-10 bg-[#050505] px-6 md:px-12 lg:px-24 pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24">

                    {/* Left: Stats / Info - Stacks on mobile */}
                    <div className="lg:col-span-4 space-y-12 animate-section order-2 lg:order-1">
                        {artist.stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 border-t border-white/10 pt-8">
                                {artist.stats.map((stat, i) => (
                                    <div key={i}>
                                        <h4 className="text-white/40 font-mono text-xs uppercase tracking-wider mb-2">{stat.label}</h4>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-display uppercase break-words hyphens-auto leading-none">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-white/10 pt-8">
                            <h4 className="text-white/40 font-mono text-xs uppercase tracking-wider mb-6">{labels.gallery}</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {artist.gallery.slice(0, 4).map((img, i) => (
                                    <div key={i} className="relative aspect-[4/5] bg-white/5 overflow-hidden group">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${i}`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Biography - Top on mobile */}
                    <div className="lg:col-span-8 animate-section order-1 lg:order-2">
                        <h3 className={`text-2xl font-display uppercase mb-12 ${accentClass} text-start`}>
                            {labels.biography}
                        </h3>
                        <div className="space-y-8 text-lg md:text-xl leading-relaxed text-white/80 font-serif max-w-3xl text-start">
                            {artist.bio.map((paragraph, i) => (
                                <p key={i} className={i === 0 ? `first-letter:text-5xl first-letter:font-display ltr:first-letter:float-left ltr:first-letter:mr-3 rtl:first-letter:float-right rtl:first-letter:ml-3 first-letter:mt-[-10px]` : ""}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
