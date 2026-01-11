'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SonicButton from '@/components/ui/SonicButton';
import { Locale } from '@/i18n-config';

gsap.registerPlugin(ScrollTrigger);

interface BookingClientProps {
    content: any;
    lang: Locale;
}

export default function BookingClient({ content, lang }: BookingClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero
            gsap.fromTo('.hero-wrap',
                { scale: 1.1, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2, ease: 'expo.out' }
            );

            // Text Stagger
            gsap.fromTo('.hero-line',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'power4.out', delay: 0.5 }
            );

            // Infinite Marquee
            // Responsive Speed:
            // Mobile: 6s for one full loop of the group (4 items) -> High Energy
            // Desktop: 30s for one full loop -> Elegant / Slow
            const isMobile = window.innerWidth < 768;
            const duration = isMobile ? 8 : 35;

            gsap.to('.marquee-text', {
                xPercent: -50,
                repeat: -1,
                duration: duration,
                ease: 'linear'
            });

            // Cards / Services List
            gsap.fromTo('.artist-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.services-list-container', // Trigger on the list container itself
                        start: 'top 85%',
                    }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, [content]);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-[#A855F7] selection:text-white font-sans overflow-x-hidden">

            {/* HERO - AMETHYST THEME */}
            <section className="relative h-screen flex items-center justify-center px-6 clip-path-slant bg-[#080508]">
                <div className="hero-wrap absolute inset-0 z-0">
                    <Image
                        src="/images/booking.webp"
                        alt="Booking"
                        fill
                        className="object-cover opacity-50 contrast-125"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-purple-900/20 to-[#050505]/80" />
                </div>

                <div className="relative z-10 text-center max-w-5xl">
                    <h1 className="text-5xl sm:text-7xl md:text-[9rem] lg:text-[10rem] font-display font-bold uppercase tracking-tighter leading-[0.9] md:leading-[0.85] hero-line mb-8">
                        {content.hero_title}
                    </h1>
                    <div className="h-[2px] w-16 md:w-24 bg-[#A855F7] mx-auto mb-8 hero-line" />
                    <p className="hero-line text-xl md:text-3xl text-purple-200/80 font-serif italic">
                        {content.hero_subtitle}
                    </p>
                </div>
            </section>

            {/* ARTIST SCROLL / ROSTER */}
            <section className="py-10 bg-black overflow-hidden border-y border-white/10">
                {/* 
                    SEAMLESS LOOP STRUCTURE:
                    Two identical groups. 
                    Padding-right (pr-6/12) matches the gap (gap-6/12).
                    This ensures total width is exactly 2x content width, preventing jumps at -50%.
                    Force LTR (dir="ltr") because content is English and we want standard LTR scrolling
                    regardless of site language (Hebrew).
                */}
                <div className="w-full overflow-hidden" dir="ltr">
                    <div className="flex whitespace-nowrap marquee-text w-max" style={{ direction: 'ltr' }}>
                        {[1, 2].map((group) => (
                            <div key={group} className="flex items-center">
                                {content.marquee?.map((word: string, idx: number) => {
                                    const isPurple = idx === 1;
                                    const isWhite = idx === 3;
                                    const isOutline = !isPurple && !isWhite;

                                    return (
                                        <span
                                            key={idx}
                                            className={`text-6xl md:text-8xl font-display uppercase pe-6 md:pe-12 ${isOutline ? "text-transparent stroke-white" : ""} ${isPurple ? "text-[#A855F7]" : ""} ${isWhite ? "text-white" : ""}`}
                                            style={isOutline ? { WebkitTextStroke: '1px rgba(255,255,255,0.5)' } : {}}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE CONTENT */}
            <section className="py-20 md:py-32 px-6 md:px-20 container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="services-list-container">
                        <h2 className="text-3xl md:text-4xl font-display uppercase mb-8 md:mb-12 relative inline-block">
                            {content.points_title}
                            <span className="absolute -end-8 md:-end-12 top-0 text-[#A855F7] text-4xl md:text-6xl">*</span>
                        </h2>
                        <ul className="space-y-6 md:space-y-8">
                            {content.points.map((point: string, i: number) => (
                                <li key={i} className="artist-card text-xl md:text-4xl font-light border-s-2 border-white/10 ps-6 hover:border-[#A855F7] hover:ps-10 transition-all duration-500 cursor-default">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="roster-section">
                        <p className="text-lg md:text-xl leading-loose font-serif text-white/70 italic border p-8 md:p-12 border-white/5 bg-white/[0.02]">
                            "{content.core_text}"
                        </p>
                    </div>
                </div>
            </section>

            {/* WOW - SIGNATURE */}
            <section className="py-24 md:py-40 relative flex items-center justify-center bg-gradient-to-b from-[#050505] to-purple-950/20">
                <div className="text-center max-w-4xl px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-display uppercase leading-tight tracking-tight">
                        {content.wow_fact}
                    </h2>
                    <div className="mt-16">
                        <SonicButton href={`/${lang}/contact?type=booking`} variant="booking" className="border border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white px-10 py-5 uppercase tracking-widest font-bold text-sm transition-colors">
                            {content.book_btn}
                        </SonicButton>
                    </div>
                </div>
                <div className="absolute inset-0 bg-[url('/images/logo.webp')] opacity-10 mix-blend-overlay" />
            </section>

        </main>
    );
}
