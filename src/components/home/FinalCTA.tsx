'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const GOLD = '#CBA135';

interface FinalCTAProps {
    dict: {
        cta_final: {
            text: string;
            sub: string;
        };
    };
}

export default function FinalCTA({ dict }: FinalCTAProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.1, y: middleY * 0.1 }); // Magnetic strength
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { text, sub } = dict.cta_final;

    return (
        <section className="relative py-32 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-white/60 font-serif italic mb-8 text-lg"
            >
                {sub}
            </motion.p>

            {/* Magnetic Button Container */}
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={reset}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
                className="relative z-10"
            >
                <Link href="/contact" className="group relative inline-block cursor-pointer">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-[#CBA135] rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 scale-75 group-hover:scale-110" />

                    {/* Button Body */}
                    <div className="relative px-12 py-6 bg-[#CBA135] text-black rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        <span className="relative z-10 font-display font-bold uppercase tracking-[0.2em] text-sm md:text-base text-black">
                            {text}
                        </span>

                        {/* Liquid Drop Effect */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] bg-white rounded-[40%]"
                            initial={{ y: "100%", x: "-50%", rotate: 0 }}
                            whileHover={{ y: "-50%", rotate: 20 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                    </div>
                </Link>
            </motion.div>
        </section>
    );
}
