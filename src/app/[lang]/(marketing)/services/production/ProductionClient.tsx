'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SonicButton from '@/components/ui/SonicButton';
import { Locale } from '@/i18n-config';
import { ArrowDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProductionClientProps {
    content: any;
    lang: Locale;
}

export default function ProductionClient({ content, lang }: ProductionClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // HERO: Typographic transition (Art -> Engineering)
            const tl = gsap.timeline();

            // 1. Initial State: Screen black, text hidden

            // 2. Reveal "The Engineering"
            tl.fromTo('.hero-title-main',
                { y: 100, opacity: 0, scale: 1.1 },
                { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out', delay: 0.5 }
            );

            // 3. Reveal Subtitle
            tl.fromTo('.hero-subtitle',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                '-=0.5'
            );

            // ECOSYSTEM / SYNERGY
            // Animate pillars entering
            gsap.fromTo('.pillar-card',
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 1.2,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.synergy-section',
                        start: 'top 70%'
                    }
                }
            );

            // Connected Lines Animation
            gsap.fromTo('.connector-line',
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.5,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: '.synergy-section',
                        start: 'top 60%'
                    }
                }
            );

            // UHNWI Parallax
            gsap.fromTo('.uhnwi-img',
                { y: -50 },
                {
                    y: 50,
                    scrollTrigger: {
                        trigger: '.uhnwi-section',
                        scrub: true
                    }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, [content]);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#FFD700] selection:text-black">

            {/* HERO SECTION - THE IMPACT */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/production.webp"
                        alt="Engineering of Emotion"
                        fill
                        className="object-cover opacity-50 brightness-[0.6]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50" />

                </div>

                <div className="relative z-10 max-w-6xl">
                    <span className="block text-[#FFD700] font-mono text-xs uppercase tracking-[0.5em] mb-8 animate-pulse">
                        Seder MUSIC
                    </span>
                    <h1 className="hero-title-main text-5xl md:text-8xl lg:text-9xl font-display font-bold uppercase tracking-tighter leading-none mb-8">
                        {content.hero_title}
                    </h1>
                    <p className="hero-subtitle text-xl md:text-3xl font-serif italic text-white/80 max-w-3xl mx-auto leading-relaxed">
                        {content.hero_subtitle}
                    </p>
                </div>

                <div className="absolute bottom-12 animate-bounce text-white/30">
                    <ArrowDown className="w-6 h-6" />
                </div>
            </section>

            {/* SYNERGY SECTION - THE POWER OF THE GROUP */}
            <section className="synergy-section py-32 px-6 md:px-20 container mx-auto relative overflow-hidden">
                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-display uppercase mb-6">{content.synergy_title}</h2>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                        {content.synergy_text}
                    </p>
                </div>

                {/* VISUAL ECOSYSTEM */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Line */}
                    <div className="connector-line absolute top-1/2 start-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent -translate-y-1/2 hidden md:block" />

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {/* Music Pillar */}
                        <div className="pillar-card group bg-[#111] border border-white/5 p-12 text-center hover:border-[#FFD700] transition-colors duration-500 relative">
                            <div className="text-5xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">🎵</div>
                            <h3 className="text-2xl font-display uppercase tracking-widest mb-4 group-hover:text-[#FFD700] transition-colors">
                                {content.pillars?.music || "Music"}
                            </h3>
                            <p className="text-sm text-white/50">{content.pillars_details?.music_sub}</p>
                        </div>

                        {/* Central Hub (Project) */}
                        <div className="pillar-card group relative p-12 text-center transform scale-105 border border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.2)] overflow-hidden">
                            <VideoWithLazyLoad src="/videos/projet.webm" />

                            {/* Overlay subtil pour garder la lisibilité sans tuer la vidéo */}
                            <div className="absolute inset-0 bg-black/20 z-0" />

                            <div className="relative z-10 text-white">
                                <div className="text-5xl mb-6 drop-shadow-md">✨</div>
                                <h3 className="text-3xl font-display uppercase tracking-widest mb-4 font-bold drop-shadow-md">
                                    {content.pillars_details?.project_title}
                                </h3>
                                <p className="text-sm text-white/90 font-bold drop-shadow-sm">{content.pillars_details?.project_sub}</p>
                            </div>
                        </div>

                        {/* Event Pillar */}
                        <div className="pillar-card group bg-[#111] border border-white/5 p-12 text-center hover:border-[#FFD700] transition-colors duration-500">
                            <div className="text-5xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">🏛️</div>
                            <h3 className="text-2xl font-display uppercase tracking-widest mb-4 group-hover:text-[#FFD700] transition-colors">
                                {content.pillars?.event || "Event"}
                            </h3>
                            <p className="text-sm text-white/50">{content.pillars_details?.event_sub}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* UHNWI STANDARD */}
            <section className="uhnwi-section py-40 px-6 relative flex items-center justify-center bg-[#080808] border-y border-white/5 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Abstract architectural image background */}
                    <Image
                        src="/images/uhnwi.webp"
                        alt="Background"
                        fill
                        className="uhnwi-img object-cover opacity-20 scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative z-10 text-center max-w-4xl border border-[#FFD700]/30 p-12 md:p-24 bg-black/40 backdrop-blur-md">
                    <h3 className="text-[#FFD700] font-serif italic text-3xl mb-8">
                        {content.uhnwi_title}
                    </h3>
                    <p className="text-2xl md:text-4xl font-light leading-relaxed font-display text-white/90">
                        &ldquo;{content.uhnwi_text}&rdquo;
                    </p>
                </div>
            </section>

            {/* SIGNATURE & CTA */}
            <section className="py-32 px-6 text-center">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-medium uppercase tracking-tight text-white/20 hover:text-white transition-colors duration-1000 cursor-default">
                    {content.signature.split(':')[0]}
                </h2>
                <p className="mt-8 text-xl text-[#FFD700] font-mono tracking-widest uppercase">
                    {content.signature.split(':')[1]}
                </p>
                <div className="mt-16">
                    <SonicButton href={`/${lang}/contact?type=production`} variant="production" className="border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-10 py-5 uppercase tracking-widest font-bold text-sm transition-colors">
                        {content.concierge_btn}
                    </SonicButton>
                </div>
            </section>

        </main>
    );
}

const VideoWithLazyLoad = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && videoRef.current) {
                        videoRef.current.src = src;
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [src]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-0">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
            />
        </div>
    );
};
