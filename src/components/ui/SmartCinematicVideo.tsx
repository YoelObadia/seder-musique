'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SmartCinematicVideoProps {
    posterSrc: string;
    videoSrc: string;
    className?: string;
    priority?: boolean;
}

export default function SmartCinematicVideo({
    posterSrc,
    videoSrc,
    className,
    priority = false, // If true, load instantly (for Hero), else lazy
}: SmartCinematicVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // 1. Detect Proximity (Load video when 200px away)
    const isInView = useInView(containerRef, {
        once: true,
        margin: "200px" // Load slightly before it appears
    });

    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // 2. Handle Video Load
    const handleCanPlay = () => {
        setIsVideoLoaded(true);
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden w-full h-full bg-black", className)}
        >
            {/* STAGE 1: POSTER (Immediate LCP) */}
            <Image
                src={posterSrc}
                alt="Background"
                fill
                className="object-cover z-0"
                priority={priority}
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* STAGE 2: VIDEO INSERTION (On Proximity) */}
            {(isInView || priority) && (
                <video
                    ref={videoRef}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000",
                        isVideoLoaded ? "opacity-100" : "opacity-0"
                    )}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onCanPlay={handleCanPlay}
                >
                    <source src={videoSrc} type="video/webm" />
                    {/* Fallback can be added here if needed, but user said WebM is ready */}
                </video>
            )}

            {/* Optional Overlay to blend imperfections during switch */}
            <div className={cn(
                "absolute inset-0 bg-black/10 z-20 pointer-events-none transition-opacity duration-500",
                isVideoLoaded ? "opacity-0" : "opacity-20"
            )} />
        </div>
    );
}
