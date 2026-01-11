'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface ArtistCardProps {
    name: string;
    role: string;
    image?: string;
    slug: string;
    lang: string;
    variant?: 'graines' | 'artistes';
}

export default function ArtistCard({ name, role, image, slug, lang, variant = 'graines' }: ArtistCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const accentColor = variant === 'graines' ? 'border-blue-500' : 'border-[#FFD700]';
    const textColor = variant === 'graines' ? 'text-blue-500' : 'text-[#FFD700]';
    const hoverBorder = variant === 'graines' ? 'group-hover:border-blue-500/50' : 'group-hover:border-[#FFD700]/50';

    useGSAP(() => {
        const card = cardRef.current;
        const img = imageRef.current;
        const overlay = overlayRef.current;

        if (!card || !img || !overlay) return;

        const tl = gsap.timeline({ paused: true });

        tl.to(img, { scale: 1.1, duration: 0.6, ease: 'power2.out' })
            .to(overlay, { opacity: 0.4, duration: 0.4 }, 0);

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());

        return () => {
            card.removeEventListener('mouseenter', () => tl.play());
            card.removeEventListener('mouseleave', () => tl.reverse());
        };
    }, {});

    return (
        <Link href={`/${lang}/artistes/${slug}`} className="block h-full">
            <div
                ref={cardRef}
                className={`group relative h-[400px] w-full overflow-hidden bg-[#111] border border-white/10 ${hoverBorder} transition-colors duration-500 cursor-pointer`}
            >
                {/* Image */}
                <div className="absolute inset-0 overflow-hidden">
                    {image ? (
                        <Image
                            ref={imageRef}
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 will-change-transform grayscale group-hover:grayscale-0"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div ref={imageRef} className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/10">
                            <span className="text-4xl font-display uppercase">Seder</span>
                        </div>
                    )}
                </div>

                {/* Gradient Gradient */}
                <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 start-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className={`block text-xs font-mono uppercase tracking-widest ${textColor} mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100`}>
                                {role}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-display uppercase text-white leading-none group-hover:text-white transition-colors">
                                {name}
                            </h3>
                        </div>
                        <div className={`p-2 rounded-full border border-white/20 ${variant === 'graines' ? 'bg-blue-500/20 text-blue-500' : 'bg-[#FFD700]/20 text-[#FFD700]'} opacity-0 group-hover:opacity-100 transition-all duration-500 ltr:translate-x-4 rtl:-translate-x-4 group-hover:translate-x-0`}>
                            <ArrowUpRight className="w-5 h-5 rtl:rotate-[-90deg]" /> {/* Rotate arrow for RTL logic if needed, usually ArrowUpRight is fine but maybe flip horizontal? Let's flip it just in case or keep standard. Creating a distinct visual for RTL might be better. */}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
