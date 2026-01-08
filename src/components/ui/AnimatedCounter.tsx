'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    duration?: number;
    className?: string; // Add className prop for flexibility
}

export default function AnimatedCounter({ value, suffix = '', duration = 2, className }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);

            setCount(Math.floor(value * ease));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, value, duration]);

    return (
        <span ref={ref} className={className}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}
