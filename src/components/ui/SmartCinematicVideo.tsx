'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useVideoPreloader } from '@/hooks/useVideoPreloader';

interface SmartCinematicVideoProps {
    posterSrc: string;
    videoSrc: string;
    className?: string;
    shouldPlay: boolean;
    loadDelay?: number;
}

export default function SmartCinematicVideo({
    posterSrc,
    videoSrc,
    className,
    shouldPlay,
    loadDelay = 2000,
}: SmartCinematicVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isTrulyPlaying, setIsTrulyPlaying] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 1. Détection Mobile (Hydration safe)
    useEffect(() => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    }, []);

    // 2. Préchargement (seulement si Desktop)
    const blobUrl = useVideoPreloader(isMobile ? '' : videoSrc, loadDelay);
    const currentSource = blobUrl || videoSrc;

    useEffect(() => {
        // Si on est sur mobile, on ne fait rien, on garde l'image
        if (isMobile) return;

        const video = videoRef.current;
        if (!video) return;

        if (shouldPlay) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // La vidéo joue vraiment, on peut déclencher le fade
                        // On attend un micro-tick pour être sûr que l'image est peinte
                        requestAnimationFrame(() => setIsTrulyPlaying(true));
                    })
                    .catch(() => {
                        setIsTrulyPlaying(false);
                    });
            }
        } else {
            video.pause();
            // On remet l'image immédiatement quand on quitte pour éviter de voir une vidéo figée
            setIsTrulyPlaying(false);

            // Optionnel : Reset au début pour la prochaine fois
            // setTimeout(() => { if(video) video.currentTime = 0; }, 500); 
        }
    }, [shouldPlay, isMobile]);

    return (
        <div className={cn("relative overflow-hidden w-full h-full bg-[#050505]", className)}>
            {/* L'IMAGE (POSTER) */}
            {/* Elle reste visible tant que la vidéo n'est pas "Truly Playing" */}
            <div
                className={cn(
                    "absolute inset-0 z-10 transition-opacity duration-700 ease-in-out",
                    isTrulyPlaying ? "opacity-0" : "opacity-100"
                )}
            >
                <Image
                    src={posterSrc}
                    alt="Service background"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false} // Pas prioritaire, le LCP est géré ailleurs
                />
            </div>

            {/* LA VIDÉO */}
            {!isMobile && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    loop
                    muted
                    playsInline
                    preload="none"
                // On préserve le dernier état visuel
                >
                    <source src={currentSource} type="video/webm" />
                </video>
            )}
        </div>
    );
}