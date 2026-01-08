'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/i18n-config';
import { motion } from 'framer-motion';

export default function LocaleSwitcher({ className = '' }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();

    // Helper to switch locale
    const switchLocale = (newLocale: string) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = newLocale; // Replace locale segment
        const newPath = segments.join('/');
        router.push(newPath); // Seamless navigation
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
