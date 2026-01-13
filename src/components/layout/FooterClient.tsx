'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import Image from 'next/image';
import { Locale } from '@/i18n-config';
import LegalModal from '@/app/[lang]/(legal)/LegalModal';

const GOLD = '#FFD700';

interface FooterClientProps {
    content: any; // Using any for flexibility with dictionary type
    lang: Locale;
}

type LegalContentType = 'mentions' | 'privacy' | null;

export default function FooterClient({ content, lang }: FooterClientProps) {
    const [activeLegalContent, setActiveLegalContent] = useState<LegalContentType>(null);

    // Animation Config
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
        }
    };

    const services = [
        { href: `/${lang}/services/booking`, label: content.links.booking },
        { href: `/${lang}/services/influence`, label: content.links.marketing },
        { href: `/${lang}/services/production`, label: content.links.production },
        { href: `/${lang}/services/talents`, label: content.links.talents },
    ];

    // On ne garde ici que les liens qui sont de vraies pages
    const legalLinks = [
        { href: `/${lang}/agence`, label: content.links.agency },
        { href: `/${lang}/contact`, label: content.links.contact },
    ];

    const getModalTitle = () => {
        if (activeLegalContent === 'mentions') return content.links.legal_notice;
        if (activeLegalContent === 'privacy') return content.links.privacy_policy;
        return '';
    };

    const getModalContent = () => {
        if (activeLegalContent === 'mentions') return content.legal.mentions;
        if (activeLegalContent === 'privacy') return content.legal.privacy;
        return '';
    };

    return (
        <>
            <motion.footer
                className="border-t border-white/5 py-20 px-6 pb-[calc(5rem+var(--safe-bottom))]"
                style={{ background: '#050505' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-start">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
                        {/* Brand */}
                        <motion.div variants={itemVariants} className="max-w-sm text-start">
                            <Link href={`/${lang}`} className="flex items-center gap-4 mb-6 group">
                                <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="Seder Music Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-2xl font-display font-bold uppercase tracking-tighter text-white">
                                    <span style={{ color: GOLD }}>SEDER</span> MUSIC
                                </span>
                            </Link>
                            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line text-start">
                                {content.description}
                            </p>
                        </motion.div>

                        {/* Services */}
                        <motion.div variants={itemVariants} className="text-start">
                            <h4
                                className="font-mono text-xs uppercase tracking-widest mb-6 text-start"
                                style={{ color: GOLD }}
                            >
                                {content.headings.services}
                            </h4>
                            <ul className="space-y-3 text-sm text-start">
                                {services.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 transition-colors inline-block"
                                        >
                                            <motion.span
                                                whileHover={{ color: '#FFFFFF', textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Legal */}
                        <motion.div variants={itemVariants} className="text-start">
                            <h4
                                className="font-mono text-xs uppercase tracking-widest mb-6 text-start"
                                style={{ color: GOLD }}
                            >
                                {content.headings.legal}
                            </h4>
                            <ul className="space-y-3 text-sm text-start">
                                {/* 1. Les liens classiques (Agence, Contact) */}
                                {legalLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 transition-colors inline-block"
                                        >
                                            <motion.span
                                                whileHover={{ color: '#FFFFFF', textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        </Link>
                                    </li>
                                ))}

                                {/* 2. Le bouton Mentions Légales (Modal) */}
                                <li>
                                    <button
                                        onClick={() => setActiveLegalContent('mentions')}
                                        className="text-gray-400 hover:text-white transition-colors text-start inline-block"
                                    >
                                        <motion.span
                                            whileHover={{ color: '#FFFFFF', textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {content.links.legal_notice}
                                        </motion.span>
                                    </button>
                                </li>

                                {/* 3. Le bouton Politique de Confidentialité (Modal) */}
                                <li>
                                    <button
                                        onClick={() => setActiveLegalContent('privacy')}
                                        className="text-gray-400 hover:text-white transition-colors text-start inline-block"
                                    >
                                        <motion.span
                                            whileHover={{ color: '#FFFFFF', textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {content.links.privacy_policy}
                                        </motion.span>
                                    </button>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-gray-600 text-xs text-start">
                                {content.copyright}
                            </p>
                            <div className="hidden md:block w-px h-3 bg-white/10" />
                            <LocaleSwitcher className="md:opacity-60 hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex gap-6">
                            <a href="https://instagram.com/sedermusic" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-xs">Instagram</a>
                            <a href="https://linkedin.com/company/sedermusic" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-xs">LinkedIn</a>
                            <a href="https://spotify.com/sedermusic" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-xs">Spotify</a>
                        </div>
                    </motion.div>
                </div>
            </motion.footer>

            {/* LE MODAL EST ICI */}
            <LegalModal
                isOpen={!!activeLegalContent}
                onClose={() => setActiveLegalContent(null)}
                lang={lang}
                title={getModalTitle()}
                content={getModalContent()}
            />
        </>
    );
}