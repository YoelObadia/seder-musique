'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARS = "-_~=+*^!@#$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface ScrambleInProps {
    text: string;
    className?: string;
    delay?: number;
    scrambleSpeed?: number;
    scrambleDuration?: number; // Total duration to resolve
}

export default function ScrambleIn({
    text,
    className,
    delay = 0,
    scrambleSpeed = 50,
    scrambleDuration = 1000
    // If we want stagger, we control 'delay' from parent
}: ScrambleInProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const [displayText, setDisplayText] = useState("");

    // We start with empty or random check
    // Strategy: Show random chars, then gradually fix them from left to right?
    // Or just random soup that turns into text? 
    // "Word-by-word reveal" -> We likely wrap this around WORDS.

    useEffect(() => {
        if (!isInView) return;

        let frameId: number;
        let startTime: number;

        // Wait for delay
        const timeout = setTimeout(() => {
            startTime = Date.now();

            const animate = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / scrambleDuration, 1);

                // progress 0 -> 1
                // Number of resolved characters
                const resolvedCount = Math.floor(progress * text.length);

                const scrambled = text
                    .split("")
                    .map((char, index) => {
                        if (index < resolvedCount) {
                            return text[index];
                        }
                        // Random char
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("");

                setDisplayText(scrambled);

                if (progress < 1) {
                    frameId = requestAnimationFrame(animate);
                }
            };

            frameId = requestAnimationFrame(animate);

        }, delay * 1000);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(frameId);
        };
    }, [isInView, delay, text, scrambleDuration]);

    return (
        <span ref={ref} className={className}>
            {displayText || text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')}
            {/* Initial state is random mess or empty? "Reveal" implies appearing. Let's make it opacity 0 initially via parent or CSS? 
                Actually nicer if it's visible as glitch code then resolves.
            */}
        </span>
    );
}
