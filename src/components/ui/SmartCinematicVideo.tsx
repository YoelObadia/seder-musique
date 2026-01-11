// components/ui/SmartCinematicVideo.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SmartCinematicVideoProps {
    posterSrc: string;
    videoSrc: string;
    className?: string;
    shouldPlay: boolean; // <--- NOUVELLE PROP CRITIQUE
}

export default function SmartCinematicVideo({
    posterSrc,
    videoSrc,
    className,
    shouldPlay,
}: SmartCinematicVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Gestion Lecture / Pause impérative pour performance max
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (shouldPlay) {
            // Astuce: on remet au début pour l'effet "départ" ou on laisse reprendre
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Auto-play prevented", error);
                });
            }
        } else {
            video.pause();
        }
    }, [shouldPlay]);

    return (
        <div className={cn("relative overflow-hidden w-full h-full bg-black", className)}>
            {/* L'image reste toujours derrière pour éviter le trou noir au chargement */}
            <Image
                src={posterSrc}
                alt="Service preview"
                fill
                className="object-cover z-0"
                sizes="(max-width: 768px) 100vw, 33vw"
            />

            {/* La vidéo est toujours dans le DOM (pour éviter le layout shift) mais en pause */}
            <video
                ref={videoRef}
                className={cn(
                    "absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500",
                    shouldPlay ? "opacity-100" : "opacity-0" // On cache la vidéo quand elle ne joue pas
                )}
                loop
                muted
                playsInline
                preload="metadata" // On ne charge pas tout le buffer inutilement
            >
                <source src={videoSrc} type="video/webm" />
            </video>
        </div>
    );
}