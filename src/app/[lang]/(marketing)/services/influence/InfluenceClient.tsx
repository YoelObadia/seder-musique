'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SonicButton from '@/components/ui/SonicButton';
import { Locale } from '@/i18n-config';
import { ArrowDownLeft, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface InfluenceClientProps {
    content: any;
    lang: Locale;
}

export default function InfluenceClient({ content, lang }: InfluenceClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const isRTL = lang === 'he';

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // --- ANIMATION BANDE ROSE ---
            // --- ANIMATION BANDE ROSE ---
            // Use clip-path instead of width to prevent text reflow issues on multi-line
            const startClip = isRTL ? 'inset(0 0% 0 100%)' : 'inset(0 100% 0 0%)';
            const endClip = 'inset(0 0% 0 0%)';

            tl.fromTo('.hero-title-mask',
                { clipPath: startClip },
                {
                    clipPath: endClip,
                    duration: 1.5,
                    ease: 'power4.inOut'
                }
            );

            tl.fromTo('.hero-content',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                '-=0.2'
            );

            // ANIMATIONS STANDARDS
            gsap.fromTo('.what-we-do-item',
                { opacity: 0, x: isRTL ? 30 : -30 },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.2,
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.what-we-do-section',
                        start: 'top 70%'
                    }
                }
            );

            const steps = gsap.utils.toArray('.timeline-step');
            steps.forEach((step: any, i) => {
                gsap.fromTo(step,
                    { opacity: 0.2, x: isRTL ? 20 : -20 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 60%',
                            end: 'bottom 40%',
                            toggleActions: 'play reverse play reverse'
                        }
                    }
                );
            });

            gsap.fromTo('.format-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.formats-section',
                        start: 'top 80%'
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, [content, isRTL]);

    if (!content.sections) return null;

    const { whatWeDo, ourApproach, whatYouGet, formats, forWho, cta } = content.sections;

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#FF2E93] selection:text-black">

            {/* HERO */}
            <section className="relative h-screen flex flex-col justify-center px-6 md:px-20 overflow-hidden bg-[#050505]">

                {/* 0. BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-marketing.webp"
                        alt="Influence Marketing"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505]" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* 1. AMBIANCE : Glow d'arrière-plan */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#FF2E93] opacity-10 blur-[100px] rounded-full pointer-events-none z-0" />

                <div className="relative z-10 mt-[-10vh] w-full text-center md:text-start">

                    <div className="relative mb-10 inline-block px-4">

                        {/* TITRE BASE (Contour) */}
                        <h1
                            className={`font-display font-medium uppercase tracking-tighter leading-[0.85] text-transparent relative z-10 w-full whitespace-normal ${isRTL
                                ? 'text-[12vw] md:text-[8vw]'
                                : 'text-[13vw] md:text-[7vw]'
                                }`}
                            style={{
                                WebkitTextStroke: '2px rgba(255,255,255,0.2)'
                            }}
                        >
                            {content.title}
                        </h1>

                        {/* TITRE MASQUE (Rose) */}
                        <div
                            className={`hero-title-mask absolute start-0 bg-[#FF2E93] z-20 w-full overflow-hidden flex items-center ${isRTL
                                ? 'h-[135%] top-[-17.5%]'
                                : 'h-full top-0'
                                }`}
                        >
                            <div className="px-4 w-full">
                                <h1 className={`font-display font-medium uppercase tracking-tighter leading-[0.85] text-black w-full whitespace-normal ${isRTL
                                    ? 'text-[12vw] md:text-[8vw]'
                                    : 'text-[13vw] md:text-[7vw]'
                                    }`}>
                                    {content.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* SOUS-TITRE */}
                    <div className="hero-content ps-6 md:ps-8 border-s-2 md:border-s-4 border-[#FF2E93]">
                        <p className="text-lg md:text-3xl font-serif italic text-white/70 max-w-4xl leading-relaxed">
                            {content.subtitle}
                        </p>
                    </div>
                </div>

                {/* SCROLL INDICATOR (Cliquable) */}
                <div
                    onClick={() => {
                        const nextSection = document.querySelector('.what-we-do-section');
                        if (nextSection) {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50 animate-bounce cursor-pointer z-30 hover:opacity-100 transition-opacity"
                >
                    <span className="text-[10px] uppercase tracking-widest mb-2 text-white/60">Scroll</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-[#FF2E93] to-transparent"></div>
                </div>
            </section>

            {/* WHAT WE DO */}
            <section className="what-we-do-section py-32 px-6 md:px-20 container mx-auto">
                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-4">
                        <span className="text-[#FF2E93] font-mono text-sm uppercase tracking-widest mb-4 block">01 / {content.step_labels?.expertise}</span>
                        <h2 className="text-4xl md:text-5xl font-display uppercase">{whatWeDo.title}</h2>
                    </div>
                    <div className="lg:col-span-8">
                        <p className="text-2xl font-light mb-12 text-white/80 leading-relaxed">{whatWeDo.text}</p>
                        <div className="grid md:grid-cols-2 gap-8">
                            {whatWeDo.bullets.map((item: string, i: number) => (
                                <div key={i} className="what-we-do-item flex gap-4 p-6 border border-white/10 hover:border-[#FF2E93] transition-colors bg-[#0A0A0A]">
                                    <div className="text-[#FF2E93] text-2xl">✦</div>
                                    <p className="text-lg">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR APPROACH */}
            <section className="py-32 bg-[#080808]">
                <div className="container mx-auto px-6 md:px-20">
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <span className="text-[#FF2E93] font-mono text-sm uppercase tracking-widest mb-4 block">02 / {content.step_labels?.process}</span>
                        <h2 className="text-4xl md:text-6xl font-display uppercase mb-6">{ourApproach.title}</h2>
                        <p className="text-xl text-white/50">{ourApproach.text}</p>
                    </div>

                    <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
                        <div className="absolute start-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#FF2E93] to-transparent hidden md:block" />

                        <div className="space-y-16">
                            {ourApproach.steps.map((step: any, i: number) => (
                                <div key={i} className="timeline-step flex flex-col md:flex-row gap-8 items-start relative group">
                                    <div className="md:w-16 h-16 rounded-full bg-[#111] border border-[#FF2E93] flex items-center justify-center text-[#FF2E93] font-bold z-10 shrink-0 text-xl font-display">
                                        {i + 1}
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="text-3xl font-display uppercase mb-2 group-hover:text-[#FF2E93] transition-colors">{step.title}</h3>
                                        <p className="text-white/60 text-lg font-light">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FORMATS */}
            <section className="formats-section py-32 px-6 md:px-20 container mx-auto">
                <div className="flex flex-col md:flex-row justify-between mb-20 gap-8">
                    <div>
                        <span className="text-[#FF2E93] font-mono text-sm uppercase tracking-widest mb-4 block">03 / {content.step_labels?.activation}</span>
                        <h2 className="text-4xl md:text-5xl font-display uppercase">{formats.title}</h2>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {formats.items.map((item: any, i: number) => (
                        <div
                            key={i}
                            className="format-card w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-10 bg-[#111] hover:bg-[#1a1a1a] transition-all duration-300 group border-t-2 border-transparent hover:border-[#FF2E93] hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2E93]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <h3 className="text-xl font-display uppercase mb-4 text-white group-hover:text-[#FF2E93] transition-colors">{item.title}</h3>
                            <p className="text-white/50 relative z-10">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOR WHO & WHAT YOU GET */}
            <section className="py-20 px-6 container mx-auto border-t border-white/5">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div>
                        <h3 className="text-3xl font-display uppercase mb-8">{forWho.title}</h3>
                        <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                            {forWho.text}
                        </p>
                    </div>

                    {/* FLÈCHE INVERSÉE EN RTL */}
                    <div className="bg-[#111] p-12 relative overflow-hidden">
                        <ArrowDownLeft
                            className={`absolute top-8 end-8 text-[#FF2E93] w-12 h-12 ${isRTL ? "-rotate-90" : ""}`}
                        />
                        <h3 className="text-3xl font-display uppercase mb-8">{whatYouGet.title}</h3>
                        <ul className="space-y-4">
                            {whatYouGet.bullets.map((bullet: string, i: number) => (
                                <li key={i} className="flex gap-4 items-start text-lg text-white/80">
                                    <CheckCircle2 className="w-6 h-6 text-[#FF2E93] shrink-0 mt-1" />
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-40 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF2E93]/10 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-display uppercase mb-8">{cta.title}</h2>
                    <p className="text-xl md:text-2xl font-serif italic text-white/60 mb-12">
                        {cta.text}
                    </p>
                    <SonicButton href={`${cta.primaryButton.href}?type=influence`} variant="influence" className="border border-[#FF2E93] text-[#FF2E93] hover:bg-[#FF2E93] hover:text-black px-12 py-5 uppercase font-bold tracking-widest text-lg transition-colors">
                        {cta.primaryButton.label}
                    </SonicButton>
                </div>
            </section>
        </main>
    );
}