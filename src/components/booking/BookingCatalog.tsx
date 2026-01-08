'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Artist } from '@/lib/types';
import ArtistCard from '@/components/ui/ArtistCard'; // Reusing our nice card
import { cn } from '@/lib/utils';

// Filter Constants
const GENRES = ['Techno', 'Pop', 'Live', 'Visual Art']; // Adapted to our mock data tags
const PRICES = [
    { label: '< 10k€', value: 'low' },
    { label: '> 50k€', value: 'high' }
];

interface BookingCatalogProps {
    artists: Artist[]; // Expecting all bookable artists passed from server
    dict: any;
    lang: string;
}

export default function BookingCatalog({ artists, dict, lang }: BookingCatalogProps) {
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [activePrice, setActivePrice] = useState<string | null>(null);

    // Filter Logic
    const filteredArtists = useMemo(() => {
        return artists.filter(artist => {
            // Genre Filter
            if (activeGenre) {
                // Check if any tag contains the genre string (case insensitive)
                const hasTag = artist.tags.some(tag => tag.toLowerCase().includes(activeGenre.toLowerCase()));
                if (!hasTag) return false;
            }

            // Price Filter
            if (activePrice) {
                const price = artist.bookingDetails?.priceRange?.length || 0;
                // Assumption: $ = 1, $$ = 2, $$$ = 3, $$$$ = 4
                // Mock mapping: low (<10k) = $, high (>50k) = $$$ or $$$$
                if (activePrice === 'low' && price > 2) return false;
                if (activePrice === 'high' && price < 3) return false;
            }

            return true;
        });
    }, [artists, activeGenre, activePrice]);

    return (
        <section className="py-24 container mx-auto px-6">
            <h2 className="text-4xl font-display mb-12 text-center md:text-left">{dict.booking.hero_title}</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-16 relative z-10">
                <button
                    onClick={() => { setActiveGenre(null); setActivePrice(null); }}
                    className={cn(
                        "px-6 py-2 rounded-full border transition-all",
                        !activeGenre && !activePrice ? "bg-white text-black border-white" : "text-gray-400 border-white/10 hover:border-white"
                    )}
                >
                    {dict.booking.filters.all}
                </button>

                {/* Genre Buttons */}
                {GENRES.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
                        className={cn(
                            "px-6 py-2 rounded-full border transition-all",
                            activeGenre === genre ? "bg-accent text-black border-accent" : "text-white border-white/10 hover:border-accent/50"
                        )}
                    >
                        {genre}
                    </button>
                ))}

                <div className="w-[1px] h-8 bg-white/10 mx-2 hidden md:block" />

                {/* Price Buttons */}
                {PRICES.map(price => (
                    <button
                        key={price.value}
                        onClick={() => setActivePrice(activePrice === price.value ? null : price.value)}
                        className={cn(
                            "px-6 py-2 rounded-full border transition-all font-mono text-sm",
                            activePrice === price.value ? "bg-zinc-800 text-white border-zinc-500" : "text-gray-500 border-white/5 hover:border-white/20"
                        )}
                    >
                        {price.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map((artist, i) => (
                            <motion.div
                                key={artist.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ArtistCard artist={artist} index={i} lang={lang} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-20 text-gray-500"
                        >
                            No artists found matching criteria.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
