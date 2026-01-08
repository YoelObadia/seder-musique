'use client';

import React from 'react';
import { InfiniteTicker } from '@/components/ui/InfiniteTicker';

const PARTNERS = [
    "SONY MUSIC", "UNIVERSAL", "WARNER", "LIVE NATION", "SPOTIFY", "APPLE MUSIC", "BEATPORT"
];

export default function PartnersTicker() {
    return (
        /* Le breakout CSS : w-screen et marges négatives pour toucher les bords du navigateur */
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black border-y border-white/10 overflow-hidden flex items-center">

            {/* Conteneur interne : on force w-full et max-w-none pour le ticker */}
            <div className="h-24 md:h-44 w-full flex items-center py-4 max-w-none">
                <InfiniteTicker
                    direction="left"
                    speed="slow"
                    items={PARTNERS.map((partner, i) => (
                        <div key={i} className="flex items-center justify-center group h-full">
                            {/* Centrage optique strict pour la police Monument Extended */}
                            <span className="text-2xl md:text-6xl font-display font-bold text-white/30 group-hover:text-[#FFD700] transition-colors duration-500 whitespace-nowrap px-8 md:px-20 uppercase tracking-tighter leading-[0] flex items-center h-full">
                                {partner}
                            </span>

                            {/* Séparateur Or (Gold) */}
                            <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-[#FFD700]/30 self-center" />
                        </div>
                    ))}
                />
            </div>
        </section>
    );
}