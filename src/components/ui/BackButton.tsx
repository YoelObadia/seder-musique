'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BackButtonProps {
    href: string;
    lang: string;
    isRTL?: boolean;
}

export default function BackButton({ href, lang, isRTL = false }: BackButtonProps) {
    return (
        <Link
            href={href}
            className="absolute z-40 flex items-center gap-2 text-white/80 hover:text-white transition-colors group start-6 md:start-12"
            // STRICT positioning: Header Height + 1.5rem spacing.
            style={{ top: 'calc(var(--header-height) + 1.5rem)' }}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="p-2 rounded-full border border-white/20 group-hover:border-white/50 transition-colors bg-black/60 hover:bg-black/80 backdrop-blur-md shadow-lg">
                {isRTL ? (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                ) : (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                )}
            </div>
        </Link>
    );
}
