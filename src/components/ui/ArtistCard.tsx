'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BlurImage from '@/components/ui/BlurImage';
import { Artist } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

interface ArtistCardProps {
    artist: Artist;
    index: number;
    lang: string;
}

export default function ArtistCard({ artist, index, lang }: ArtistCardProps) {
    // Use a video thumbnail if available (mocked by replacing extension), otherwise fallback 
    // For this generic component, we'll try to guess a thumbnail or use a placeholder color
    // Ideally, 'artist' object should have a 'thumbnailUrl' or 'coverImage'. 
    // We'll rely on our BlurImage logic or use the video as a poster if possible.

    // Quick hack for demo images if not present in data:
    const imageUrl = artist.heroVideoUrl.replace('.mp4', '.jpg');

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-surface border border-white/5 cursor-pointer"
        >
            <Link href={`/${lang}/label/artistes/${artist.slug}`} className="block w-full h-full">
                {/* Background Image / Video Poster */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <BlurImage
                        src={imageUrl}
                        alt={artist.name}
                        fill
                        className="object-cover"
                        containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {artist.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] font-mono uppercase px-2 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-display text-white uppercase leading-none tracking-tight">
                            {artist.name}
                        </h3>
                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out">
                            <ArrowTopRightIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
