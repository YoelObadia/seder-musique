'use client';

import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Globe, Youtube, Play, Pause, Music2 } from 'lucide-react';
import SonicButton from '@/components/ui/SonicButton';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState, useEffect } from 'react';
import ScrollReset from '@/components/utils/ScrollReset';
import BackButton from '@/components/ui/BackButton';
import { cn } from '@/lib/utils';

// Extended interface for the full profile
export interface ArtistProfileData {
    name: string;
    role: string;
    image: string;
    slug: string;
    type: 'graine' | 'artiste';
    bio: string[];
    stats?: { label: string; value: string }[];
    gallery: string[];
    socials?: { platform: string; url: string }[];
}

interface ArtistProfileClientProps {
    artist: ArtistProfileData;
    lang: Locale;
    labels: {
        back: string;
        book: string;
        biography: string;
        gallery: string;
    };
}

// --- CUSTOM AUDIO PLAYER COMPONENT ---
const CustomAudioPlayer = ({ src, accentColor }: { src: string, accentColor: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Stop all other audios (simple implementation)
            document.querySelectorAll('audio').forEach(el => {
                if (el !== audioRef.current) {
                    el.pause();
                    // trigger state update in other components if needed? 
                    // for now, simple pause is enough.
                }
            });
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration || 1;
        setProgress((current / total) * 100);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    // Fake Waveform Bars
    const bars = [40, 70, 30, 80, 50, 90, 60, 40, 80, 50, 30, 70, 40, 60, 80, 40];

    return (
        <div className="w-full h-full bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center gap-6 p-6 group transition-all duration-500 hover:border-white/30">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                className="hidden"
            />

            {/* Play Button */}
            <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 shadow-lg"
                style={{ backgroundColor: accentColor, color: '#000' }}
            >
                {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                ) : (
                    <Play className="w-6 h-6 fill-current ms-1" />
                )}
            </button>

            {/* Visualizer & Progress */}
            <div className="w-full space-y-3">
                {/* Fake Visualizer */}
                <div className="flex items-center justify-center gap-[2px] h-8 max-w-[80%] mx-auto">
                    {bars.map((height, i) => (
                        <div
                            key={i}
                            className="w-1 bg-white/30 rounded-full transition-all duration-150"
                            style={{
                                height: isPlaying ? `${Math.random() * 100}%` : `${height / 3}%`,
                                opacity: isPlaying ? 1 : 0.3,
                                backgroundColor: isPlaying ? accentColor : undefined
                            }}
                        />
                    ))}
                </div>

                <p className="text-xs font-mono uppercase tracking-widest text-white/50 text-center">
                    {isPlaying ? 'Now Playing' : 'Listen Demo'}
                </p>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%`, backgroundColor: accentColor }}
                    />
                </div>
            </div>
        </div>
    );
};


export default function ArtistProfileClient({ artist, lang, labels }: ArtistProfileClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);

    const isRTL = lang === 'he';
    const accentColor = artist.type === 'graine' ? '#3B82F6' : '#FFD700';
    const accentClass = artist.type === 'graine' ? 'text-blue-500' : 'text-[#FFD700]';
    const borderClass = artist.type === 'graine' ? 'border-blue-500' : 'border-[#FFD700]';
    const bgClass = artist.type === 'graine' ? 'bg-blue-500' : 'bg-[#FFD700]';

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // 1. Image Reveal (Scale + Opacity)
            tl.fromTo(heroImageRef.current,
                { scale: 1.1, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.5 }
            )
                // 2. Text Content Reveal (Fade Up)
                .fromTo('.animate-text',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
                    '-=1'
                )
                // 3. Stats/Gallery Stagger
                .fromTo('.animate-section',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
                    '-=0.5'
                );
        });

        // Simplified mobile animation
        mm.add("(max-width: 767px)", () => {
            gsap.fromTo('.animate-text',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2 }
            );
        });

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-white/20 pt-[var(--header-height)]" dir={isRTL ? 'rtl' : 'ltr'}>
            <ScrollReset />

            {/* Back Button - Standardized */}
            <BackButton href={`/${lang}/services/talents`} lang={lang} isRTL={isRTL} />

            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col lg:grid lg:grid-cols-12 w-full bg-[#050505] pt-0">

                {/* 1. IMAGE SIDE */}
                <div className="relative h-[60vh] lg:h-auto lg:col-span-7 lg:col-start-6 lg:row-start-1 w-full overflow-hidden order-1 lg:order-2">
                    <div ref={heroImageRef} className="absolute inset-0 w-full h-full">
                        <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover object-center"
                            priority
                            sizes="(max-width: 768px) 100vw, 60vw"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t ltr:lg:bg-gradient-to-r rtl:lg:bg-gradient-to-l from-[#050505] via-transparent to-transparent opacity-90 lg:opacity-100" />
                    </div>
                </div>

                {/* 2. TEXT SIDE */}
                <div className="relative z-10 lg:col-span-5 lg:col-start-1 lg:row-start-1 flex flex-col justify-center px-6 md:px-12 lg:ps-24 lg:pe-12 py-12 lg:py-0 order-2 lg:order-1 lg:h-auto -mt-20 md:-mt-32 lg:mt-0 pointer-events-none lg:pointer-events-auto">
                    <div className="space-y-6 md:space-y-8 text-start max-w-xl pointer-events-auto">
                        <span className={`animate-text inline-block font-mono text-xs md:text-sm tracking-[0.2em] uppercase ${accentClass} bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 lg:bg-transparent lg:px-0 lg:border-none`}>
                            {artist.role} <span className="opacity-50 mx-2">|</span> {artist.type === 'graine' ? 'New Talent' : 'Artist'}
                        </span>

                        <h1 className="animate-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold uppercase leading-[0.85] tracking-tighter text-white drop-shadow-2xl lg:drop-shadow-none">
                            {artist.name}
                        </h1>

                        <div className="animate-text pt-4 md:pt-8 flex flex-col items-start gap-8">
                            <SonicButton
                                href={`/${lang}/contact`}
                                variant={artist.type === 'graine' ? 'talents' : 'production'}
                                className={`inline-block border ${borderClass} ${accentClass} hover:bg-white hover:text-black hover:border-white px-10 py-4 uppercase tracking-widest text-sm transition-all duration-300 text-center min-w-[200px] shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                            >
                                {labels.book}
                            </SonicButton>

                            {/* Socials */}
                            {artist.socials && artist.socials.length > 0 && (
                                <div className="flex gap-4">
                                    {artist.socials.map((social, i) => {
                                        let Icon = Globe;
                                        if (social.platform === 'instagram') Icon = Instagram;
                                        if (social.platform === 'youtube') Icon = Youtube;

                                        return (
                                            <a
                                                key={i}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`p-3 border rounded-full transition-all duration-300 ${borderClass} ${accentClass} hover:bg-white hover:text-black hover:border-white`}
                                                aria-label={social.platform}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* BIO & CONTENT SECTION */}
            <section className="relative z-10 bg-[#050505] px-6 md:px-12 lg:px-24 pb-32">
                <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* STATS & GALLERY */}
                    <div className="lg:col-span-5 space-y-16 animate-section order-2 lg:order-1">
                        {/* Stats */}
                        {artist.stats && (
                            <div className="grid grid-cols-2 gap-y-10 gap-x-8 border-t border-white/10 pt-10">
                                {artist.stats.map((stat, i) => (
                                    <div key={i} className="group">
                                        <h4 className="text-white/40 font-mono text-xs uppercase tracking-wider mb-3 group-hover:text-white transition-colors">{stat.label}</h4>
                                        <p className="text-2xl md:text-3xl font-display uppercase leading-none break-words" style={{ color: artist.type === 'graine' ? '#60A5FA' : '#FCD34D' }}>
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Gallery */}
                        <div className="border-t border-white/10 pt-10">
                            <h3 className="font-display uppercase text-2xl mb-8 flex items-center gap-3">
                                {labels.gallery} <Music2 className="w-5 h-5 opacity-50" />
                            </h3>
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                {artist.gallery.slice(0, 4).map((img, i) => {
                                    const isAudio = img.endsWith('.webm') || img.endsWith('.mp3');
                                    return (
                                        <div key={i} className={`relative aspect-[4/5] overflow-hidden rounded-lg group ${isAudio ? 'col-span-2 aspect-[2/1] md:aspect-[3/1]' : ''}`}>
                                            {isAudio ? (
                                                <CustomAudioPlayer src={img} accentColor={accentColor} />
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={img}
                                                        alt={`Gallery ${i}`}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* BIOGRAPHY */}
                    <div className="lg:col-span-7 animate-section order-1 lg:order-2">
                        <div className="sticky top-32">
                            <div className="flex items-center gap-4 mb-12">
                                <span className={`h-px w-12 ${bgClass}`} />
                                <h3 className={`text-xl font-mono uppercase tracking-widest ${accentClass}`}>
                                    {labels.biography}
                                </h3>
                            </div>

                            <div className="space-y-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-white/80 font-serif max-w-4xl">
                                {artist.bio.map((paragraph, i) => (
                                    <p key={i} className={i === 0 ? `first-letter:text-6xl first-letter:font-display ltr:first-letter:float-left ltr:first-letter:mr-4 rtl:first-letter:float-right rtl:first-letter:ml-4 first-letter:mt-[-8px] text-white` : ""}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
