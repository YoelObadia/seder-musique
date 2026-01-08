'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

export default function SectionHeader({
    title,
    subtitle,
    className,
    align = 'left',
}: SectionHeaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%', // Start animation when top of header is 80% down viewport
                toggleActions: 'play none none reverse',
            },
        });

        if (titleRef.current) {
            // Simple SplitText simulation for "staggered letters" effect without paid SplitText plugin
            // In a real production environment with Club GreenSock, use SplitText
            // Here we animate the whole line or words if we split them manually.
            // For now, simple vertical reveal
            tl.fromTo(
                titleRef.current,
                { y: '100%', opacity: 0 },
                { y: '0%', opacity: 1, duration: 1, ease: 'power3.out' }
            );
        }

        if (subtitleRef.current) {
            tl.fromTo(
                subtitleRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
                '-=0.8'
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    }, []);

    const alignmentClass = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end',
    }[align];

    return (
        <div
            ref={containerRef}
            className={cn('flex flex-col mb-12', alignmentClass, className)}
        >
            <div className="overflow-hidden">
                <h2
                    ref={titleRef}
                    className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight text-white"
                >
                    {title}
                </h2>
            </div>

            {subtitle && (
                <p
                    ref={subtitleRef}
                    className="mt-4 text-gray-400 font-mono text-sm md:text-base max-w-lg"
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
