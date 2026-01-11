'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import ParticleTextHero from '@/components/3d/ParticleTextHero';
import MagneticButton from '@/components/ui/MagneticButton';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface HomeHeroProps {
    dict: any;
    lang: any;
}

export default function HomeHero({ dict, lang }: HomeHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        const tl = gsap.timeline({ delay: 0.5 });

        // 1. Cinematic Background Zoom-Out (Le "Souffle" initial)
        gsap.fromTo(".hero-particles",
            { scale: 1.15, filter: "blur(12px)" },
            { scale: 1, filter: "blur(0px)", duration: 2.5, ease: "power2.out" }
        );

        // 2. Content Reveal (Staggered & Organic)
        gsap.set(".hero-content", { autoAlpha: 1 });

        tl.from(".hero-element", {
            y: 40,
            opacity: 0,
            filter: "blur(15px)",
            duration: 1.8,
            stagger: 0.15,
            ease: "power3.out"
        });

    }, { scope: containerRef, dependencies: [mounted] });

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-start md:justify-end overflow-hidden bg-[#050505]" suppressHydrationWarning>

            {/* LE TITRE ANIMÉ EN PAILLETTES 2D (Z-0) */}
            <div className="hero-particles absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <ParticleTextHero />
            </div>

            {/* CONTENU INFÉRIEUR (Z-10) */}
            <div className="hero-content opacity-0 relative z-10 container mx-auto px-6 flex flex-col items-center text-center select-none pt-[45vh] md:pt-0 mb-12 md:mb-0 md:pb-32">

                {/* Sous-titre */}
                <p className="hero-element text-lg md:text-xl text-white/60 max-w-2xl font-light mb-8 md:mb-10 tracking-wide">
                    {dict.hero_subtitle}
                </p>

                {/* Actions */}
                <div className="hero-element flex flex-col md:flex-row gap-6">
                    <MagneticButton
                        href="#services"
                        className="bg-accent-secondary text-background font-bold px-8 py-4 md:px-10 md:py-5 rounded-none hover:shadow-[0_0_40px_rgba(201,162,77,0.5)] transition-shadow duration-300 uppercase tracking-widest text-sm"
                    >
                        {dict.cta_primary}
                    </MagneticButton>

                    <MagneticButton
                        href={`/${lang}/contact`}
                        className="bg-transparent text-accent-primary border border-accent-primary/60 hover:bg-accent-primary hover:text-background px-8 py-4 md:px-10 md:py-5 rounded-none transition-all duration-300 uppercase tracking-widest text-sm"
                    >
                        <span className="flex items-center gap-2">
                            {dict.cta_secondary}
                            <ArrowRightIcon className={cn("transition-transform", lang === 'he' && "rotate-180")} />
                        </span>
                    </MagneticButton>
                </div>
            </div>

            {/* Indicateur de Scroll */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-[2px] h-12 bg-gradient-to-b from-accent-primary to-transparent" />
            </div>
        </section>
    );
}