'use client';

import React, { useState, useEffect, useRef } from 'react';

const CHARS = "-_~=+*^!@#$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface GlitchTextProps {
    text: string;
    className?: string;
    hover?: boolean;
}

export default function GlitchText({ text, className, hover = false }: GlitchTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const originalText = text;

    const startScramble = () => {
        let iteration = 0;
        clearInterval(intervalRef.current!);

        intervalRef.current = setInterval(() => {
            setDisplayText(
                originalText
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= originalText.length) {
                clearInterval(intervalRef.current!);
            }

            iteration += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        if (hover) {
            startScramble();
        } else {
            setDisplayText(originalText);
        }
        return () => clearInterval(intervalRef.current!);
    }, [hover, originalText]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
}
