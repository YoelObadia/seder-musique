'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const GOLD = '#FFD700';

interface ExpertSectionProps {
    dict: {
        manifesto: {
            content: string;
            signature: string;
        };
    };
}

export default function ExpertSection({ dict }: ExpertSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-20%' });

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden px-6 md:px-12"
        >
            <div className="max-w-5xl mx-auto text-center z-10">
                {/* Manifesto Text */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1], // Ease out expo-ish
                    }}
                    className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase leading-relaxed md:leading-relaxed lg:leading-relaxed tracking-wide"
                >
                    {dict.manifesto.content}
                </motion.h2>

                {/* Signature */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{
                        duration: 1.5,
                        delay: 0.8,
                        ease: 'easeOut',
                    }}
                    className="mt-16 md:mt-24"
                >
                    <span
                        className="text-xs md:text-sm font-display uppercase tracking-[0.3em] md:tracking-[0.5em]"
                        style={{ color: GOLD }}
                    >
                        {dict.manifesto.signature}
                    </span>
                </motion.div>
            </div>

            {/* Subtle Grain Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </section>
    );
}