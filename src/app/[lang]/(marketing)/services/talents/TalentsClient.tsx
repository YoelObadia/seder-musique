'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react';
import SonicButton from '@/components/ui/SonicButton';
import { Locale } from '@/i18n-config';
import Turntable from '@/components/3d/Turntable';
import ArtistCard from '@/components/talents/ArtistCard';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';


interface TalentsClientProps {
    content: any;
    lang: Locale;
    initialViewMode?: string;
}

type CardType = 'graines' | 'artistes' | null;

export default function TalentsClient({ content, lang, initialViewMode }: TalentsClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize state from Prop (server) or URL param (client fallback)
    const initialView = (initialViewMode || searchParams.get('view')) as CardType;
    // Validate it's a valid type, otherwise null
    const validView = (initialView === 'graines' || initialView === 'artistes') ? initialView : null;

    const [selectedCard, setSelectedCard] = useState<CardType>(validView);
    const cardsSectionRef = useRef<HTMLDivElement>(null);

    const isRTL = lang === 'he';

    // Initial reveal animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Split Reveal
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Direction aware animations
            const heroLeftX = isRTL ? 100 : -100;
            const heroRightX = isRTL ? -50 : 50;

            tl.fromTo('.hero-left',
                { xPercent: heroLeftX },
                { xPercent: 0, duration: 1.5, ease: 'power4.out' }
            )
                .fromTo('.hero-right-content > *',
                    { opacity: 0, x: heroRightX },
                    { opacity: 1, x: 0, duration: 1, stagger: 0.1 },
                    '-=1'
                )


            // Cards Reveal on Scroll
            gsap.fromTo('.interactive-card',
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.cards-section',
                        start: 'top 80%'
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, [isRTL]);

    // Selection Animation
    const handleCardSelect = (type: CardType) => {
        if (selectedCard === type) return;

        // Update URL to reflect state (shallow update)
        const newParams = new URLSearchParams(searchParams.toString());
        if (type) {
            newParams.set('view', type);
        } else {
            newParams.delete('view');
        }
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });

        const ctx = gsap.context(() => {
            if (type === null) {
                // Reset View
                const tl = gsap.timeline({
                    onComplete: () => {
                        // Critical: Reset state AFTER animation to avoid flicker
                        setSelectedCard(null);
                        // Clear props after React render cycle to ensure clean state
                        setTimeout(() => {
                            gsap.set('.interactive-card', { clearProps: 'all' });
                            gsap.set('.card-container', { clearProps: 'all' });
                        }, 50);
                    }
                });

                // Hide Details & Artists
                tl.to('.artist-card-entry', { opacity: 0, y: 20, duration: 0.2 })
                    .to('.card-details', {
                        opacity: 0,
                        height: 0,
                        duration: 0.5,
                        ease: 'power2.in'
                    })
                    // Restore Cards
                    .set('.interactive-card', { display: 'flex' }) // Ensure they are visible for calculation
                    .to(`.card-container`, {
                        width: '100%',
                        flex: '1 1 0%', // Reset flex grow
                        duration: 0.8,
                        ease: 'power2.inOut',
                        clearProps: 'all' // Vital: Remove GSAP inline styles to let CSS responsiveness take over
                    })
                    // Restore Visibility of sibling (if we hid it, we need to show it back)
                    .to('.interactive-card', {
                        width: 'auto', // Allow flex to control width again
                        flex: '1 1 0%',
                        opacity: 1,
                        duration: 0.6
                    }, '<') // Run concurrently with container reset
                    .to('.card-content-initial', {
                        opacity: 1,
                        height: 'auto',
                        duration: 0.5
                    }, '-=0.3')
                    .to('.back-button', { autoAlpha: 0, duration: 0.3 }, '<');

            } else {
                // Expand Selected
                const otherType = type === 'graines' ? 'artistes' : 'graines';
                const tl = gsap.timeline({
                    onComplete: () => setSelectedCard(type)
                });

                // 1. Hide Other Card
                tl.to(`.card-${otherType}`, {
                    opacity: 0,
                    width: 0,
                    height: 0, // Fix mobile vertical gap
                    padding: 0,
                    margin: 0,
                    borderWidth: 0, // Ensure borders don't take space
                    flex: 0,
                    display: 'none', // Critical: Remove from flow to kill gap
                    duration: 0.6,
                    ease: 'power2.inOut'
                })

                    // 2. Hide Initial Content of Selected
                    .to(`.card-${type} .card-content-initial`, {
                        opacity: 0,
                        height: 0,
                        duration: 0.4
                    }, '-=0.6')

                    // 3. Reveal Details
                    .to(`.card-${type} .card-details`, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.6,
                    })

                    // 4. Reveal Artists (Stagger)
                    .to(`.card-${type} .artist-card-entry`, {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }, '-=0.2')

                    // 5. Show Back Button
                    .to('.back-button', {
                        autoAlpha: 1,
                        duration: 0.3
                    }, '-=0.3');
            }
        }, cardsSectionRef);
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#3B82F6] selection:text-white overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* HERO SPLIT SCREEN */}
            <section className="flex flex-col lg:flex-row min-h-screen relative">

                {/* LEFT: 3D VINYL */}
                {/* Desktop: Full height minus header | Mobile: 45vh to show content below */}
                <div className="hero-left relative w-full lg:w-5/12 h-[45vh] lg:h-[calc(100vh-var(--header-height))] bg-[#111] overflow-hidden order-1 mt-[var(--header-height)]">
                    <div className="w-full h-full absolute inset-0 touch-none"> {/* touch-none to prevent scroll locking if canvas captures it, but handled in Turntable mostly */}
                        <Turntable className="w-full h-full object-cover pointer-events-auto" />
                    </div>
                    {/* Overlay for cinematic feel + Mobile Bottom Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#050505]/50 pointer-events-none" />
                </div>

                {/* RIGHT: CONTENT */}
                <div className="lg:w-7/12 flex flex-col justify-center px-6 md:px-12 lg:ps-24 lg:pe-12 order-2 bg-[#050505] lg:mt-[var(--header-height)] relative z-10 py-12 lg:py-0">
                    <div className="hero-right-content max-w-2xl">
                        <span className="inline-block text-[#3B82F6] font-mono tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
                            {content.tag}
                        </span>

                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-bold uppercase leading-[0.9] mb-8 text-white tracking-tighter">
                            {content.title}
                        </h1>

                        <div className="space-y-6 text-white/70 font-serif text-lg md:text-xl leading-relaxed">
                            {/* <p className="border-s-2 border-[#FFD700] ps-6 italic text-[#FFD700]">{content.subtitle}</p> */}
                            <p>{content.intro.p1}</p>
                            <p>{content.intro.p2}</p>
                            <p>{content.intro.p3}</p>
                            <p className="font-bold text-white">{content.intro.welcome}</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* INTERACTIVE CARDS SECTION (DOUBLE PARCOURS) */}
            <section ref={cardsSectionRef} className="cards-section relative min-h-screen flex flex-col justify-center py-20 px-4 md:px-12 lg:px-24 bg-[#050505]">

                {/* Back Button - Sticky/Fixed on Mobile */}
                <button
                    onClick={() => handleCardSelect(null)}
                    className={`back-button fixed lg:absolute top-20 lg:top-12 end-4 lg:end-auto lg:start-24 z-50 flex items-center justify-center lg:justify-start gap-2 text-white hover:text-[#3B82F6] transition-colors bg-black/50 backdrop-blur-md p-3 rounded-full lg:bg-transparent lg:p-0 border border-white/10 lg:border-none
                    ${selectedCard ? 'visible opacity-100' : 'invisible opacity-0'}`}
                    aria-label="Retour"
                >
                    {isRTL ? <ArrowLeft className="w-6 h-6 rotate-180" /> : <ArrowLeft className="w-6 h-6" />}
                    <span className="uppercase tracking-widest text-sm font-mono hidden lg:inline">Back</span>
                </button>

                <div className="card-container flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto h-auto min-h-[50vh] lg:min-h-[60vh]">

                    {/* CARD: GRAINES DE TALENT */}
                    <div
                        onClick={() => !selectedCard && handleCardSelect('graines')}
                        className={`interactive-card card-graines relative bg-[#0a0a0a] border border-white/10 hover:border-[#3B82F6]/50 transition-colors cursor-pointer overflow-hidden flex flex-col
                        ${selectedCard === 'graines' ? 'w-full cursor-default border-[#3B82F6]' : selectedCard === 'artistes' ? 'w-0 h-0 flex-none overflow-hidden opacity-0' : 'flex-1 h-[350px] lg:h-auto'}
                        `}
                    >
                        {/* Background Visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-between">
                            {/* Initial Content */}
                            <div className={`card-content-initial ${selectedCard === 'graines' ? 'opacity-0 h-0 overflow-hidden' : ''}`}>
                                <span className="text-[#3B82F6] font-mono text-sm tracking-widest mb-4 block">01</span>
                                <h3 className="text-3xl md:text-5xl font-display uppercase mb-4 md:mb-6">{content.cards.graines.title}</h3>
                                <p className="text-white/60 text-base md:text-xl serif italic max-w-md">
                                    {content.cards.graines.desc}
                                </p>
                                <div className="mt-6 md:mt-8">
                                    <div className="inline-flex items-center gap-2 text-[#3B82F6] uppercase tracking-wider text-sm font-bold group">
                                        Explorer
                                        {isRTL ?
                                            <ChevronRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" /> :
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Content (Hidden initially) */}
                            <div className={`card-details ${selectedCard === 'graines' ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                                <div className="max-w-6xl mx-auto pt-24 md:pt-12">
                                    <h2 className="text-3xl md:text-7xl font-display uppercase text-white mb-6 md:mb-8 leading-none">
                                        {content.cards.graines.title}
                                    </h2>

                                    {/* Original Content Block */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
                                        <div className="space-y-6">
                                            <p className="text-lg md:text-2xl text-white/90 leading-relaxed font-serif">
                                                {content.cards.graines.full_text}
                                            </p>
                                            <SonicButton
                                                href={`/${lang}${content.cards.graines.link}?type=talents`}
                                                variant="talents"
                                                className="inline-block border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-black px-8 py-4 uppercase tracking-widest text-sm transition-colors mt-8 w-full md:w-auto text-center"
                                            >
                                                {content.cards.graines.cta}
                                            </SonicButton>
                                        </div>
                                        <ul className="space-y-4 border-s border-white/10 ps-8 grid grid-cols-1 gap-y-4">
                                            {content.cards.graines.bullets.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4 text-white/70">
                                                    <span className="text-[#3B82F6] shrink-0">✦</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* DYNAMIC ARTIST GRID */}
                                    {/* Only show if list exists and has items */}
                                    {content.cards.graines.list && content.cards.graines.list.length > 0 && (
                                        <div className="mt-12 border-t border-white/10 pt-12">
                                            <h3 className="text-[#3B82F6] font-mono uppercase tracking-widest text-sm mb-8">Nos Graines de Talents</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                                {content.cards.graines.list.map((artist: any, i: number) => (
                                                    <div key={i} className={`artist-card-entry ${selectedCard === 'graines' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                                        <ArtistCard
                                                            name={artist.name}
                                                            role={artist.role}
                                                            image={artist.image}
                                                            slug={artist.slug}
                                                            lang={lang}
                                                            variant="graines"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD: ARTISTES & ÉVÉNEMENTS */}
                    <div
                        onClick={() => !selectedCard && handleCardSelect('artistes')}
                        className={`interactive-card card-artistes relative bg-[#0a0a0a] border border-white/10 hover:border-[#FFD700]/50 transition-colors cursor-pointer overflow-hidden flex flex-col
                        ${selectedCard === 'artistes' ? 'w-full cursor-default border-[#FFD700]' : selectedCard === 'graines' ? 'w-0 h-0 flex-none overflow-hidden opacity-0' : 'flex-1 h-[350px] lg:h-auto'}
                        `}
                    >
                        {/* Background Visual */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-[#FFD700]/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-between">
                            {/* Initial Content */}
                            <div className={`card-content-initial text-start lg:text-end ${selectedCard === 'artistes' ? 'opacity-0 h-0 overflow-hidden' : ''}`}>
                                <span className="text-[#FFD700] font-mono text-sm tracking-widest mb-4 block">02</span>
                                <h3 className="text-4xl md:text-5xl font-display uppercase mb-6">{content.cards.artistes.title}</h3>
                                <p className="text-white/60 text-lg md:text-xl serif italic max-w-md lg:ms-auto">
                                    {content.cards.artistes.desc}
                                </p>
                                <div className="mt-8 flex justify-start lg:justify-end">
                                    <div className="inline-flex items-center gap-2 text-[#FFD700] uppercase tracking-wider text-sm font-bold group flex-row lg:flex-row-reverse">
                                        Explorer
                                        {isRTL ?
                                            <ChevronRight className="w-4 h-4 group-hover:-translate-x-1 lg:group-hover:translate-x-1 transition-transform rotate-180" /> :
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 lg:group-hover:-translate-x-1 lg:rotate-180 transition-transform" />
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Content */}
                            <div className={`card-details ${selectedCard === 'artistes' ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                                <div className="max-w-6xl mx-auto pt-24 md:pt-12">
                                    <h2 className="text-3xl md:text-7xl font-display uppercase text-white mb-8 leading-none">
                                        {content.cards.artistes.title}
                                    </h2>

                                    {/* Original Content Block */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                                        <div className="space-y-6">
                                            <p className="text-lg md:text-2xl text-white/90 leading-relaxed font-serif">
                                                {content.cards.artistes.full_text}
                                            </p>
                                            <SonicButton
                                                href={`/${lang}${content.cards.artistes.link}?type=management`}
                                                variant="production"
                                                className="inline-block border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-8 py-4 uppercase tracking-widest text-sm transition-colors mt-8 w-full md:w-auto text-center"
                                            >
                                                {content.cards.artistes.cta}
                                            </SonicButton>
                                        </div>
                                        <ul className="space-y-4 border-s border-white/10 ps-8 grid grid-cols-1 gap-y-4">
                                            {content.cards.artistes.bullets.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4 text-white/70">
                                                    <span className="text-[#FFD700] shrink-0">✦</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* DYNAMIC ARTIST GRID */}
                                    {/* Only show if list exists and has items */}
                                    {content.cards.artistes.list && content.cards.artistes.list.length > 0 && (
                                        <div className="mt-12 border-t border-white/10 pt-12">
                                            <h3 className="text-[#FFD700] font-mono uppercase tracking-widest text-sm mb-8">Nos Artistes</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                                {content.cards.artistes.list.map((artist: any, i: number) => (
                                                    <div key={i} className={`artist-card-entry ${selectedCard === 'artistes' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                                        <ArtistCard
                                                            name={artist.name}
                                                            role={artist.role}
                                                            image={artist.image}
                                                            slug={artist.slug}
                                                            lang={lang}
                                                            variant="artistes"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
