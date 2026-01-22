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
                className="relative border-t border-white/5 py-24 px-6 pb-[calc(5rem+var(--safe-bottom))] overflow-hidden"
                style={{ background: '#050505' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                {/* Background Beam Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

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
                            <ul className="space-y-4 text-sm text-start">
                                {services.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 transition-colors inline-block group"
                                        >
                                            <span className="relative overflow-hidden inline-block">
                                                <span className="block translate-y-0 group-hover:-translate-y-full transition-transform duration-300">
                                                    {item.label}
                                                </span>
                                                <span className="absolute top-full left-0 block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 text-white">
                                                    {item.label}
                                                </span>
                                            </span>
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
                            <ul className="space-y-4 text-sm text-start">
                                {/* 1. Les liens classiques (Agence, Contact) */}
                                {legalLinks.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 transition-colors inline-block group"
                                        >
                                            <span className="relative overflow-hidden inline-block">
                                                <span className="block translate-y-0 group-hover:-translate-y-full transition-transform duration-300">
                                                    {item.label}
                                                </span>
                                                <span className="absolute top-full left-0 block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 text-white">
                                                    {item.label}
                                                </span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}

                                {/* 2. Le bouton Mentions Légales (Modal) */}
                                <li>
                                    <button
                                        onClick={() => setActiveLegalContent('mentions')}
                                        className="text-gray-400 hover:text-white transition-colors text-start inline-block group relative"
                                    >
                                        <span className="relative overflow-hidden inline-block">
                                            <span className="block translate-y-0 group-hover:-translate-y-full transition-transform duration-300">
                                                {content.links.legal_notice}
                                            </span>
                                            <span className="absolute top-full left-0 block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 text-white">
                                                {content.links.legal_notice}
                                            </span>
                                        </span>
                                    </button>
                                </li>

                                {/* 3. Le bouton Politique de Confidentialité (Modal) */}
                                <li>
                                    <button
                                        onClick={() => setActiveLegalContent('privacy')}
                                        className="text-gray-400 hover:text-white transition-colors text-start inline-block group relative"
                                    >
                                        <span className="relative overflow-hidden inline-block">
                                            <span className="block translate-y-0 group-hover:-translate-y-full transition-transform duration-300">
                                                {content.links.privacy_policy}
                                            </span>
                                            <span className="absolute top-full left-0 block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 text-white">
                                                {content.links.privacy_policy}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-gray-600 text-xs text-start font-mono uppercase tracking-wider">
                                {content.copyright}
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            <a href="https://instagram.com/sedermusic" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FFD700] transition-colors text-xs uppercase tracking-widest font-mono">Instagram</a>
                            <a href="https://linkedin.com/company/sedermusic" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FFD700] transition-colors text-xs uppercase tracking-widest font-mono">LinkedIn</a>
                            <a href="https://spotify.com/sedermusic" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FFD700] transition-colors text-xs uppercase tracking-widest font-mono">Spotify</a>
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