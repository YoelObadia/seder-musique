'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const InfiniteTicker = ({
    items,
    direction = 'left',
    speed = 'normal',
    pauseOnHover = true,
    className,
}: {
    items: React.ReactNode[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'normal' | 'slow';
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    React.useEffect(() => {
        addAnimation();
    }, []);

    const [start, setStart] = React.useState(false);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });
            getDirection();
            getSpeed();
            setStart(true);
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            containerRef.current.style.setProperty('--animation-direction', direction === 'left' ? 'forwards' : 'reverse');
        }
    };

    const getSpeed = () => {
        if (containerRef.current) {
            const durations = { fast: '20s', normal: '40s', slow: '80s' };
            containerRef.current.style.setProperty('--animation-duration', durations[speed]);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                /* 1. ON SUPPRIME max-w-7xl ET ON MET w-full */
                'scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]',
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    'flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap items-center',
                    start && 'animate-scroll',
                    pauseOnHover && 'hover:[animation-play-state:paused]'
                )}
            >
                {items.map((item, idx) => (
                    <li
                        /* 2. ON UTILISE w-max AU LIEU DE LARGEURS FIXES */
                        className="w-max flex-shrink-0 flex items-center justify-center relative h-full"
                        key={idx}
                    >
                        {item}
                    </li>
                ))}
            </ul>
            <style jsx>{`
                .scroller {
                    --animation-duration: 40s;
                    --animation-direction: forwards;
                }
                .animate-scroll {
                    animation: scroll var(--animation-duration) linear infinite var(--animation-direction);
                }
                @keyframes scroll {
                    to {
                        transform: translate(calc(-50% - 2rem));
                    }
                }
            `}</style>
        </div>
    );
};