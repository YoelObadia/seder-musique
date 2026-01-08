'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface BlurImageProps extends ImageProps {
    className?: string;
    containerClassName?: string;
    aspectRatio?: string; // e.g. "aspect-square", "aspect-video"
}

export default function BlurImage({
    src,
    alt,
    className,
    containerClassName,
    aspectRatio,
    ...props
}: BlurImageProps) {
    const [isLoading, setLoading] = useState(true);

    return (
        <div className={cn("overflow-hidden bg-white/5 relative", aspectRatio, containerClassName)}>
            <Image
                src={src}
                alt={alt}
                className={cn(
                    "duration-700 ease-in-out cover",
                    isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
                    className
                )}
                onLoad={() => setLoading(false)}
                {...props}
            />
        </div>
    );
}
