'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';
import Link from 'next/link';
import { ArrowCustomIcon } from '@/components/ui/Icons'; // If we have one, otherwise inline SVG

gsap.registerPlugin(ScrollTrigger);

interface BookingTimelineProps {
    dict: any;
}

export default function BookingTimeline({ dict }: BookingTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement[]>([]);

    // Process Steps from Dictionary
    const steps = [
        { key: 'contact', number: '01' },
        { key: 'quote', number: '02' },
        { key: 'contract', number: '03' },
        { key: 'show', number: '04' }
    ];

    useGSAP(() => {
        if (!containerRef.current) return;

        // Line Fill Animation
        gsap.to(lineRef.current, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: 0.5,
            }
        });

        // Steps Highlight Logic
        stepsRef.current.forEach((step, index) => {
            if (!step) return;

            ScrollTrigger.create({
                trigger: step,
                start: 'top center+=100', // When step hits center
                end: 'bottom center-=100',
                toggleClass: { targets: step, className: 'is-active' },
                onEnter: () => gsap.to(step, { opacity: 1, scale: 1.05, duration: 0.3 }),
                onLeave: () => gsap.to(step, { opacity: 0.5, scale: 1, duration: 0.3 }),
                onEnterBack: () => gsap.to(step, { opacity: 1, scale: 1.05, duration: 0.3 }),
                onLeaveBack: () => gsap.to(step, { opacity: 0.5, scale: 1, duration: 0.3 }),
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-32 relative container mx-auto px-6 overflow-hidden">

            {/* Vertical Line Container */}
            <div className="absolute left-[20px] md:left-1/2 top-40 bottom-40 w-[2px] bg-white/10 -translate-x-1/2">
                <div ref={lineRef} className="w-full bg-accent h-0" />
            </div>

            <h2 className="text-4xl font-display text-center mb-24 relative z-10">THE PROCESS</h2>

            <div className="flex flex-col gap-24 relative z-10">
                {steps.map((stepItem, i) => {
                    const content = dict.booking.process[stepItem.key];
                    const isEven = i % 2 === 0;

                    return (
                        <div
                            key={stepItem.key}
                            ref={(el) => { if (el) stepsRef.current[i] = el; }}
                            className={cn(
                                "flex items-center gap-8 md:gap-16 opacity-50 transition-all",
                                "flex-row", // Always row for icon alignment
                                isEven ? "md:flex-row-reverse" : "md:flex-row" // Alternating sides on Desktop
                            )}
                        >
                            {/* Text Content */}
                            <div className={cn("flex-1 text-left", isEven ? "md:text-left" : "md:text-right")}>
                                <h3 className="text-3xl font-display mb-2 text-white">{content.title}</h3>
                                <p className="text-gray-400 font-light">{content.desc}</p>
                            </div>

                            {/* Center Marker */}
                            <div className="relative shrink-0 w-10 h-10 rounded-full bg-surface border border-white/20 flex items-center justify-center z-20 shadow-[0_0_20px_black]">
                                <span className="text-xs font-mono text-white">{stepItem.number}</span>
                                <div className="absolute inset-0 rounded-full border border-accent opacity-0 transition-opacity duration-300 [.is-active_&]:opacity-100 animate-ping" />
                            </div>

                            {/* Empty spacer for alternating grid */}
                            <div className="flex-1 hidden md:block" />
                        </div>
                    );
                })}
            </div>

            {/* CTA */}
            <div className="mt-32 flex justify-center sticky bottom-10 z-30">
                <Link href="/contact">
                    <MagneticButton className="bg-white text-black text-xl font-bold px-12 py-6 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        {dict.booking.cta}
                    </MagneticButton>
                </Link>
            </div>
        </section>
    );
}
