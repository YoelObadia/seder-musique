'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

type SonicVariant = 'booking' | 'talents' | 'influence' | 'production';

interface SonicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant: SonicVariant;
    href?: string;
    className?: string;
}

export default function SonicButton({
    children,
    variant,
    href,
    className,
    ...props
}: SonicButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const btn = buttonRef.current;
        const container = containerRef.current;
        if (!btn || !container) return;

        const ctx = gsap.context(() => {
            // Setup based on variant
            switch (variant) {
                case 'booking': // THE PERFORMANCE (Microphone)
                    const micBody = container.querySelector('.mic-body');
                    const micStand = container.querySelector('.mic-stand');
                    const notes = gsap.utils.toArray('.music-note') as Element[];

                    // Default state
                    gsap.set(notes, { opacity: 0, scale: 0, y: 10 });

                    // Hover Loop
                    const micTl = gsap.timeline({ paused: true, repeat: -1 });

                    // Mic rocking
                    micTl.to(micBody, { rotation: 15, duration: 0.8, ease: 'power1.inOut', transformOrigin: 'bottom center' })
                        .to(micBody, { rotation: -15, duration: 0.8, ease: 'power1.inOut', transformOrigin: 'bottom center' })
                        .to(micBody, { rotation: 0, duration: 0.8, ease: 'power1.inOut', transformOrigin: 'bottom center' });

                    // Notes floating
                    const notesTl = gsap.timeline({ paused: true, repeat: -1 });
                    notesTl.to(notes, {
                        y: -30,
                        x: () => (Math.random() - 0.5) * 40, // Spread
                        rotation: () => (Math.random() - 0.5) * 60,
                        opacity: 1,
                        scale: 1,
                        duration: 1.5,
                        stagger: { each: 0.5, repeat: -1 },
                        ease: 'power1.out',
                    }).to(notes, { opacity: 0, duration: 0.2 }, "<1.3"); // Fade out at end

                    btn.addEventListener('mouseenter', () => {
                        gsap.to([micBody, micStand], { opacity: 0.25, duration: 0.3 });
                        micTl.play();
                        notesTl.play();
                    });
                    btn.addEventListener('mouseleave', () => {
                        micTl.pause();
                        micTl.progress(0); // Reset position
                        notesTl.pause();
                        gsap.to(notes, { opacity: 0, y: 0, duration: 0.2 });
                        gsap.to([micBody, micStand], { rotation: 0, opacity: 0, duration: 0.3 });
                    });
                    break;

                case 'talents': // THE FREQUENCY (Waveform) - No changes
                    const waves = gsap.utils.toArray('.sonic-wave') as Element[];
                    gsap.set(waves, { opacity: 0, scaleY: 0.2 });

                    const waveTl = gsap.timeline({ paused: true, repeat: -1 });
                    waveTl.to(waves, {
                        scaleY: 1,
                        opacity: 0.8,
                        duration: 0.4,
                        stagger: {
                            each: 0.05,
                            yoyo: true,
                            repeat: -1
                        },
                        ease: 'sine.inOut'
                    });

                    btn.addEventListener('mouseenter', () => {
                        waveTl.play();
                    });
                    btn.addEventListener('mouseleave', () => {
                        waveTl.pause();
                        waveTl.time(0);
                        gsap.to(waves, { scaleY: 0.2, opacity: 0, duration: 0.3 });
                    });
                    break;

                case 'influence': // THE CAPTURE (Camera)
                    const cameraBody = container.querySelector('.cam-body');
                    const cameraLens = container.querySelector('.cam-lens');
                    const cameraFlash = container.querySelector('.cam-flash');

                    // Default
                    gsap.set(cameraFlash, { opacity: 0 });

                    const camTl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1 });

                    // Flash animation
                    camTl.to(cameraFlash, { opacity: 0.8, scale: 1.5, duration: 0.05, ease: 'power4.out' })
                        .to(cameraFlash, { opacity: 0, scale: 1, duration: 0.1 }); // Fast Flash

                    // Breathing Lens
                    gsap.to(cameraLens, { scale: 1.1, duration: 1, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });

                    btn.addEventListener('mouseenter', () => {
                        gsap.to([cameraBody, cameraLens], { opacity: 1, duration: 0.3 });
                        camTl.play();
                    });
                    btn.addEventListener('mouseleave', () => {
                        camTl.pause();
                        camTl.progress(0);
                        gsap.to([cameraBody, cameraLens, cameraFlash], { opacity: 0, duration: 0.3 });
                    });
                    break;

                case 'production': // THE PRODUCTION (EQ/Levels)
                    const bars = gsap.utils.toArray('.prod-bar') as Element[];

                    const prodTl = gsap.timeline({ paused: true, repeat: -1 });

                    // Random dancing bars
                    prodTl.to(bars, {
                        height: () => Math.random() * 100 + "%",
                        duration: 0.2,
                        ease: 'power1.inOut',
                        stagger: {
                            each: 0.05,
                            repeat: -1,
                            yoyo: true
                        }
                    });

                    btn.addEventListener('mouseenter', () => {
                        gsap.to(bars, { opacity: 0.6, duration: 0.3 }); // Dark bars on Gold
                        prodTl.play();
                    });
                    btn.addEventListener('mouseleave', () => {
                        prodTl.pause();
                        gsap.to(bars, { opacity: 0, height: '20%', duration: 0.3 });
                    });
                    break;
            }
        }, container);

        return () => ctx.revert();
    }, [variant]);

    // Base styles - removed bg-black/50 to rely on passed classes for transparency/color
    const baseStyles = "relative inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/20 select-none overflow-hidden transition-colors duration-300 group";

    // Variants specific structure
    const renderContent = () => {
        switch (variant) {
            case 'talents':
                return (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-100 pointer-events-none">
                            {/* Bars hidden by default opacity in GSAP set */}
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="sonic-wave w-1 h-4 bg-current rounded-full mx-[1px]" />
                            ))}
                        </div>
                        <span ref={textRef} className="relative z-10 font-display uppercase tracking-widest text-sm transition-colors duration-300">
                            {children}
                        </span>
                    </>
                );
            case 'booking':
                return (
                    <>
                        <div className="absolute inset-x-0 bottom-0 h-full flex flex-col items-center justify-end pointer-events-none pb-1 pointer-events-none z-0">
                            {/* Notes */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center overflow-visible">
                                <div className="music-note text-current text-xs">♪</div>
                                <div className="music-note text-current text-xs absolute ml-4 -mt-2">♫</div>
                                <div className="music-note text-current text-xs absolute -ml-4 -mt-2">♪</div>
                            </div>

                            {/* Mic Head */}
                            <div className="mic-body w-3 h-5 bg-current rounded-full opacity-0 border border-black/20" />
                            {/* Mic Stand */}
                            <div className="mic-stand w-0.5 h-6 bg-current opacity-0" />
                        </div>
                        <span ref={textRef} className="relative z-10 font-display uppercase tracking-widest text-sm transition-colors duration-300">
                            {children}
                        </span>
                    </>
                );
            case 'influence':
                return (
                    <>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Camera Body - PINK Color */}
                            <div className="cam-body relative w-10 h-7 border-2 border-[#EC4899] rounded-sm flex items-center justify-center opacity-0">
                                {/* Lens */}
                                <div className="cam-lens w-4 h-4 border-2 border-[#EC4899] rounded-full" />
                                {/* Shutter Button */}
                                <div className="absolute -top-1 right-2 w-1.5 h-1 bg-[#EC4899]" />
                                {/* Flash Box */}
                                <div className="cam-flash absolute inset-0 bg-white mix-blend-overlay rounded-sm opacity-0" />
                            </div>
                        </div>
                        <span ref={textRef} className="relative z-10 font-display uppercase tracking-widest text-sm transition-colors duration-300">
                            {children}
                        </span>
                    </>
                );
            case 'production':
                return (
                    <>
                        {/* EQ Levels at bottom */}
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 pb-2 pointer-events-none overflow-hidden h-full">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="prod-bar w-1.5 h-1/4 bg-black rounded-t-sm opacity-0" />
                            ))}
                        </div>
                        <span ref={textRef} className="relative z-10 font-display uppercase tracking-widest text-sm transition-colors duration-300">
                            {children}
                        </span>
                    </>
                );
            default:
                return children;
        }
    };

    if (href) {
        return (
            <div ref={containerRef} className="inline-block">
                <Link ref={buttonRef as React.RefObject<HTMLAnchorElement>} href={href} className={cn(baseStyles, className)} {...props as any}>
                    {renderContent()}
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="inline-block">
            <button ref={buttonRef as React.RefObject<HTMLButtonElement>} className={cn(baseStyles, className)} {...props}>
                {renderContent()}
            </button>
        </div>
    );
}
