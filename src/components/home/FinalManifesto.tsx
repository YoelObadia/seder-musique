'use client';

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const GOLD = '#FFD700';

interface FinalManifestoProps {
    dict: {
        manifesto: {
            content: string;
            signature: string;
        };
    };
}

export default function FinalManifesto({ dict }: FinalManifestoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-20%' });

    // Dynamic Grain Intensity based on scroll position relative to this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end center"]
    });

    // As we scroll into view, grain becomes slightly more intense
    const grainOpacity = useTransform(scrollYProgress, [0, 1], [0.03, 0.08]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden px-6 md:px-12"
        >
            <div className="max-w-4xl mx-auto z-10">
                {/* Bloc Central: Serif, Italic, Light, White */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1], // Ease out expo
                    }}
                    className="text-center"
                >
                    <p className="text-3xl md:text-4xl lg:text-5xl font-serif italic leading-relaxed text-white/90">
                        <span className="text-[#FFD700] me-2 opactiy-50">“</span>
                        {dict.manifesto.content}
                        <span className="text-[#FFD700] ms-2 opacity-50">”</span>
                    </p>
                </motion.div>

                {/* Signature Décalée: Sans-Serif (Monument), Gold, Tracking Widest */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                        duration: 1.5,
                        delay: 1.5, // Wait for text to resolve
                        ease: 'easeOut',
                    }}
                    className="mt-12 flex justify-end pr-8 md:pr-16"
                >
                    <span
                        className="text-xs md:text-sm font-display font-medium uppercase tracking-[0.3em] md:tracking-[0.5em]"
                        style={{ color: GOLD }}
                    >
                        {dict.manifesto.signature}
                    </span>
                </motion.div>
            </div>

            {/* Subtle Grain Overlay - Dynamic */}
            <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    opacity: grainOpacity,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </section >
    );
}
