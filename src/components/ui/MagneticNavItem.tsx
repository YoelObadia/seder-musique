'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

interface MagneticNavItemProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    activeColor?: string;
    active?: boolean;
}

export default function MagneticNavItem({
    href,
    children,
    className = "",
    activeColor = "#FFD700",
    active = false
}: MagneticNavItemProps) {
    const containerRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        const xTo = gsap.quickTo(container, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(container, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const xToText = gsap.quickTo(text, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yToText = gsap.quickTo(text, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = container.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const disX = clientX - centerX;
            const disY = clientY - centerY;

            // Magnetic Pull Strength
            xTo(disX * 0.2);
            yTo(disY * 0.2);
            xToText(disX * 0.3); // Text moves slightly more
            yToText(disY * 0.3);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
            xToText(0);
            yToText(0);
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <Link
            ref={containerRef}
            href={href}
            className={`relative inline-block px-4 py-2 ${className}`}
            style={{ color: active ? activeColor : undefined }}
        >
            <span ref={textRef} className="relative z-10 inline-block transition-colors duration-300">
                {children}
            </span>
            {/* Active Indicator (Dot) */}
            {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD700]" />
            )}
        </Link>
    );
}
