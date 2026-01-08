'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoCard = ({
    className,
    title,
    description,
    header,
    icon,
    videoSrc,
    href,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    videoSrc?: string;
    href?: string;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                // Autoplay might be blocked, usually fine for muted videos
                console.warn("Video play blocked", error);
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Optional: Reset to start
        }
    };

    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-surface border border-transparent hover:border-accent/20 justify-between flex flex-col space-y-4 overflow-hidden relative",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Video Background Layer */}
            {videoSrc && (
                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        loop
                        muted
                        playsInline
                        className={cn(
                            "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {/* Overlay gradient to ensure text readability even when video plays */}
                    <div className={cn("absolute inset-0 bg-black/60 transition-opacity duration-300", isHovered ? "opacity-40" : "opacity-0")} />
                </div>
            )}

            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-10">
                {icon}
                <div className="font-display font-bold text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-mono text-xs text-neutral-400">
                    {description}
                </div>
            </div>
        </div>
    );
};
