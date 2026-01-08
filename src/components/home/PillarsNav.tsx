'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PillarsNavProps {
    dict: any;
}

const PILLARS_CONFIG = [
    {
        id: 'label',
        bgClass: 'bg-zinc-900',
        img: '/images/pillar-label.jpg', // Placeholder
        video: '/videos/pillar-label.mp4' // Placeholder
    },
    {
        id: 'studio',
        bgClass: 'bg-zinc-800',
        img: '/images/pillar-studio.jpg',
        video: '/videos/pillar-studio.mp4'
    },
    {
        id: 'agency',
        bgClass: 'bg-zinc-900',
        img: '/images/pillar-agency.jpg',
        video: '/videos/pillar-agency.mp4'
    },
];

export default function PillarsNav({ dict }: PillarsNavProps) {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 mb-12">
                <h2 className="text-4xl font-display text-white mb-8">{dict.pillars_title}</h2>
            </div>

            <div className="flex flex-col lg:flex-row h-[120vh] lg:h-[600px] w-full border-y border-white/5">
                {PILLARS_CONFIG.map((pillar) => {
                    const content = dict.pillars[pillar.id];
                    return (
                        <div
                            key={pillar.id}
                            className={cn(
                                "group relative flex-1 flex flex-col justify-end p-8 lg:p-12 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                "lg:hover:flex-[2.5] border-b lg:border-b-0 lg:border-r border-white/5 last:border-0",
                                pillar.bgClass
                            )}
                        >
                            {/* Background Gradient/Image Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="relative z-20 transform transition-transform duration-500 lg:group-hover:-translate-y-4">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-mono uppercase tracking-widest text-accent border border-accent/20 rounded-full bg-accent/10">
                                    0{PILLARS_CONFIG.indexOf(pillar) + 1}
                                </span>
                                <h3 className="text-3xl lg:text-5xl font-display text-white mb-4 leading-tight">
                                    {content.title}
                                </h3>
                                <p className="text-gray-400 max-w-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    {content.description}
                                </p>
                            </div>

                            {/* Action Icon */}
                            <div className="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white">
                                    ↗
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
