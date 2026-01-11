'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

import Link from 'next/link';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    strength?: number;
    href?: string; // Support for Link
}

export default function MagneticButton({
    children,
    className,
    strength = 30,
    href,
    ...props
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const xTo = useRef<gsap.QuickToFunc>();
    const yTo = useRef<gsap.QuickToFunc>();
    const xToText = useRef<gsap.QuickToFunc>();
    const yToText = useRef<gsap.QuickToFunc>();

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;

        if (!button || !text) return;

        xTo.current = gsap.quickTo(button, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
        yTo.current = gsap.quickTo(button, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });
        xToText.current = gsap.quickTo(text, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
        yToText.current = gsap.quickTo(text, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

        const handleMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const { clientX, clientY } = mouseEvent;
            const { left, top, width, height } = button.getBoundingClientRect();

            const center = { x: left + width / 2, y: top + height / 2 };
            const distance = { x: clientX - center.x, y: clientY - center.y };

            // Apply magnetic effect
            xTo.current?.(distance.x * (strength / 100));
            yTo.current?.(distance.y * (strength / 100));

            xToText.current?.(distance.x * (strength / 80));
            yToText.current?.(distance.y * (strength / 80));
        };

        const handleMouseLeave = () => {
            xTo.current?.(0);
            yTo.current?.(0);
            xToText.current?.(0);
            yToText.current?.(0);
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            button.removeEventListener('mousemove', handleMouseMove);
            button.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    const handleReset = () => {
        xTo.current?.(0);
        yTo.current?.(0);
        xToText.current?.(0);
        yToText.current?.(0);
    };

    const commonClasses = cn(
        "relative px-8 py-3 rounded-full border border-white/20 overflow-hidden group transition-colors duration-300 hover:border-accent-secondary cursor-pointer",
        className
    );

    const innerContent = (
        <>
            {/* Fill animation background */}
            <div className="absolute inset-0 bg-accent-secondary translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0" />

            <span ref={textRef} className="relative z-10 font-display uppercase tracking-widest text-sm inline-block">
                {children}
            </span>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                ref={buttonRef as React.RefObject<HTMLAnchorElement>}
                className={commonClasses}
                onClick={(e) => {
                    handleReset();
                    props.onClick?.(e as any);
                }}
            >
                {innerContent}
            </Link>
        );
    }

    return (
        <button
            ref={buttonRef as React.RefObject<HTMLButtonElement>}
            className={commonClasses}
            onClick={(e) => {
                handleReset();
                props.onClick?.(e);
            }}
            {...props}
        >
            {innerContent}
        </button>
    );
}
