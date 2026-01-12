'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from '@studio-freight/react-lenis';
import { i18n } from '@/i18n-config';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function LocaleSwitcher({ className = '' }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const lenis = useLenis();

    // Restore scroll on mount/update if we have a saved position
    useEffect(() => {
        const savedScroll = sessionStorage.getItem('locale-scroll-pos');
        if (savedScroll && lenis) {
            // Slight delay to ensure layout is stable
            requestAnimationFrame(() => {
                lenis.scrollTo(parseFloat(savedScroll), { immediate: true });
                sessionStorage.removeItem('locale-scroll-pos');
            });
        }
    }, [lenis, pathname]);

    // Helper to switch locale
    const switchLocale = (newLocale: string) => {
        if (!pathname) return '/';

        // Save current scroll position
        if (lenis) {
            sessionStorage.setItem('locale-scroll-pos', lenis.scroll.toString());
        }

        const segments = pathname.split('/');
        segments[1] = newLocale; // Replace locale segment
        const newPath = segments.join('/');
        router.push(newPath, { scroll: false }); // Seamless navigation with scroll preservation
    };

    const currentLocale = pathname?.split('/')[1] || i18n.defaultLocale;

    return (
        <div className={`flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] ${className}`}>
            {i18n.locales.map((locale, index) => (
                <div key={locale} className="flex items-center">
                    <button
                        onClick={() => switchLocale(locale)}
                        className={`transition-all duration-300 relative group py-1 ${currentLocale === locale
                            ? 'text-[#FFD700] font-bold'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        {locale.toUpperCase()}
                        {currentLocale === locale && (
                            <motion.div
                                layoutId="activeLocale"
                                className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#FFD700]"
                            />
                        )}
                    </button>

                    {index < i18n.locales.length - 1 && (
                        <span className="mx-3 w-[2px] h-[2px] rounded-full bg-white/10" />
                    )}
                </div>
            ))}
        </div>
    );
}
