'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import SonicButton from '@/components/ui/SonicButton';
import { Locale } from '@/i18n-config';
import MagneticButton from '@/components/ui/MagneticButton';
import Turntable from '@/components/3d/Turntable';

gsap.registerPlugin(ScrollTrigger);

interface TalentsClientProps {
    content: any;
    lang: Locale;
}

export default function TalentsClient({ content, lang }: TalentsClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split layout reveal
            gsap.fromTo('.left-panel',
                { xPercent: -100 },
                { xPercent: 0, duration: 1.5, ease: 'power4.out' }
            );

            gsap.fromTo('.right-content > *:not(.scroll-indicator)',
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 1.5, delay: 0.5, ease: 'power3.out', stagger: 0.1 }
            );

            // Content Sections Reveal
            gsap.fromTo('.talent-col',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.talent-section',
                        start: 'top 75%'
                    }
                }
            );

            // Scroll Indication
            gsap.fromTo('.scroll-indicator',
                { opacity: 0 },
                { opacity: 1, duration: 1, delay: 1.5 }
            );
            gsap.to('.scroll-indicator-icon', {
                y: 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                duration: 1.5
            });

            // Footer Reveal
            gsap.fromTo('.who-section',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.who-section',
                        start: 'top 85%'
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, [content]);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-[#3B82F6] selection:text-white font-sans overflow-x-hidden">

            {/* ASYMMETRIC HERO */}
            <section className="flex flex-col lg:flex-row min-h-screen">
                <div className="left-panel lg:w-5/12 relative flex flex-col justify-start items-start bg-[#1a1a1a] overflow-hidden mt-24 h-[calc(100vh-6rem)] w-full">
                    <div className="w-full h-full">
                        <Turntable className="w-full h-full" />
                    </div>
                    <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply pointer-events-none" />
                </div>

                <div className="right-content lg:w-7/12 flex flex-col justify-center px-6 py-16 md:px-16 lg:px-24">
                    <span className="text-[#3B82F6] font-mono tracking-widest uppercase mb-4 md:mb-6 text-xs md:text-sm">{content.tag}</span>
                    <h1 className="text-[10vw] md:text-[5vw] lg:text-[4vw] font-display font-bold uppercase leading-[0.9] mb-6 md:mb-8 text-white">
                        {content.title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-white/60 font-serif leading-relaxed italic border-l-4 border-[#3B82F6] pl-4 md:pl-6">
                        {content.subtitle}
                    </p>

                    {/* SCROLL INDICATOR */}
                    <button
                        onClick={() => {
                            const nextSection = document.querySelector('.talent-section');
                            nextSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="scroll-indicator mt-16 md:mt-24 opacity-0 cursor-pointer hover:scale-110 transition-transform duration-300"
                    >
                        <ChevronDown className="scroll-indicator-icon w-8 h-8 text-[#3B82F6]" strokeWidth={1.5} />
                    </button>
                </div>
            </section>

            {/* INCUBATION & PRODUCTION SECTIONS */}
            <section className="talent-section py-20 md:py-32 px-6 md:px-24 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Incubation */}
                    <div className="talent-col space-y-8 flex flex-col h-full">
                        <h2 className="text-3xl md:text-4xl font-display uppercase text-white">{content.sections.incubation.title}</h2>
                        <p className="text-white/70 text-lg leading-relaxed">{content.sections.incubation.text}</p>
                        <ul className="space-y-4">
                            {content.sections.incubation.bullets.map((bullet: string, i: number) => (
                                <li key={i} className="flex items-start gap-4 text-white/80">
                                    <span className="text-[#3B82F6] mt-1">✦</span>
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-8 mt-auto">
                            <SonicButton href={`/${lang}/contact?type=talents`} variant="talents" className="border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-4 uppercase tracking-widest text-xs md:text-sm transition-colors w-full md:w-auto text-center">
                                {content.audition_btn}
                            </SonicButton>
                        </div>
                    </div>

                    {/* Production */}
                    <div className="talent-col space-y-8 flex flex-col h-full">
                        <h2 className="text-3xl md:text-4xl font-display uppercase text-white">{content.sections.production.title}</h2>
                        <p className="text-white/70 text-lg leading-relaxed">{content.sections.production.text}</p>
                        <ul className="space-y-4">
                            {content.sections.production.bullets.map((bullet: string, i: number) => (
                                <li key={i} className="flex items-start gap-4 text-white/80">
                                    <span className="text-[#FFD700] mt-1">✦</span>
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-8 mt-auto">
                            <SonicButton href={`/${lang}/contact?type=booking_rd`} variant="production" className="border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-8 py-4 uppercase tracking-widest text-xs md:text-sm transition-colors w-full md:w-auto text-center">
                                {content.booking_btn}
                            </SonicButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHO / FOOTER */}
            <section className="who-section py-24 md:py-40 text-center px-6 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-mono uppercase tracking-widest text-[#3B82F6] mb-6">{content.sections.who.title}</h2>
                    <p className="text-3xl md:text-4xl lg:text-5xl font-display uppercase leading-tight text-white">
                        {content.sections.who.text}
                    </p>
                </div>
            </section>

        </main>
    );
}
