'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Music, Users, Calendar, Star } from 'lucide-react';
import MagneticNavItem from '@/components/ui/MagneticNavItem';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import Image from 'next/image';


const GOLD = '#FFD700';


interface HeaderProps {
    nav?: any;
}

export default function Header({ nav }: HeaderProps) {
    const params = useParams();
    const pathname = usePathname();
    const lang = params?.lang ?? 'en';
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isServicesHover, setIsServicesHover] = useState(false);

    const isRTL = lang === 'he';

    // Smart Glass Logic
    const { scrollY } = useScroll();
    const headerBg = useTransform(scrollY, [0, 50], ["rgba(5,5,5,0)", "rgba(5,5,5,0.85)"]);
    const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(16px)"]);
    const headerBorder = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);

    // Use dictionary values or fallback if nav is undefined (safety)
    const t = nav || {
        agency: 'AGENCE',
        services: 'SERVICES',
        submenu: {
            production: 'Production Événementielle',
            influence: "Marketing d'Influence",
            booking: 'Booking',
            talents: 'Talents'
        },
        contact: 'CONTACT'
    };

    const services = [
        {
            href: `/${lang}/services/production`,
            label: t.submenu?.production || 'Production',
            key: 'production',
            icon: <Music className="w-5 h-5 group-hover:text-black transition-colors" />
        },
        {
            href: `/${lang}/services/influence`,
            label: t.submenu?.influence || 'Influence',
            key: 'influence',
            icon: <Users className="w-5 h-5 group-hover:text-black transition-colors" />
        },
        {
            href: `/${lang}/services/booking`,
            label: t.submenu?.booking || 'Booking',
            key: 'booking',
            icon: <Calendar className="w-5 h-5 group-hover:text-black transition-colors" />
        },
        {
            href: `/${lang}/services/talents`,
            label: t.submenu?.talents || 'Talents',
            key: 'talents',
            icon: <Star className="w-5 h-5 group-hover:text-black transition-colors" />
        },
    ];

    const simpleLinks = [
        { href: `/${lang}/agence`, label: t.agency },
        { href: 'services', label: t.services, isDropdown: true },
        // { href: `/${lang}/billetterie`, label: 'BILLETTERIE' },
        // { href: `/${lang}/blog`, label: 'BLOG' },
        { href: `/${lang}/contact`, label: t.contact },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href);

    return (
        <motion.header
            style={{
                backgroundColor: headerBg,
                backdropFilter: headerBlur,
                borderBottomColor: headerBorder,
                borderBottomStyle: 'solid'
            }}
            className="fixed top-0 start-0 end-0 z-50 transition-colors duration-500 pt-[var(--safe-top)]"
            onMouseLeave={() => setIsServicesHover(false)}
        >
            <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
                {/* Logo */}
                {/* Logo & Brand */}
                <Link
                    href={`/${lang}`}
                    className="flex items-center gap-4 group"
                >
                    <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105">
                        <Image
                            src="/images/logo.webp"
                            alt="Seder Music Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tighter uppercase text-white transition-opacity group-hover:opacity-80">
                        <span style={{ color: GOLD }}>SEDER</span> MUSIC
                    </span>
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden lg:flex items-center gap-6">
                    {simpleLinks.map((item) => (
                        <li
                            key={item.href}
                            className="relative h-full flex items-center"
                            onMouseEnter={() => item.isDropdown && setIsServicesHover(true)}
                            onMouseLeave={() => item.isDropdown && setIsServicesHover(false)}
                        >
                            {/* Standard Link or Dropdown Trigger */}
                            {item.isDropdown ? (
                                <>
                                    <button className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FFFFFF80] hover:text-[#FFD700] transition-colors relative z-10 px-4 py-2">
                                        {item.label}
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isServicesHover ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Simplified Dropdown */}
                                    <AnimatePresence>
                                        {isServicesHover && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95, x: isRTL ? '50%' : '-50%' }}
                                                animate={{ opacity: 1, y: 0, scale: 1, x: isRTL ? '50%' : '-50%' }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95, x: isRTL ? '50%' : '-50%' }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full start-1/2 pt-2 w-64 z-50"
                                            >
                                                <div className="bg-[#080808] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-3xl py-2">
                                                    {services.map((service) => (
                                                        <Link
                                                            key={service.href}
                                                            href={service.href}
                                                            className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-start"
                                                            onClick={() => setIsServicesHover(false)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="text-[#FFD700]">
                                                                    {service.icon}
                                                                </div>
                                                                <span className="font-display font-medium uppercase text-xs tracking-wider">
                                                                    {service.label}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <MagneticNavItem
                                    href={item.href}
                                    className="text-xs font-mono uppercase tracking-widest text-[#FFFFFF80] hover:text-white"
                                    active={isActive(item.href)}
                                >
                                    {item.label}
                                </MagneticNavItem>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="hidden lg:flex items-center gap-6 border-s border-white/10 ps-6 ms-6 h-6">
                    <LocaleSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#050505] border-t border-white/5 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-6 pt-[calc(2rem+var(--safe-top))] pb-[calc(2rem+var(--safe-bottom))]">
                            {simpleLinks.map((item) => (
                                <div key={item.label}>
                                    {!item.isDropdown ? (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className="block text-lg font-mono uppercase tracking-widest mb-4 text-start"
                                            style={{ color: isActive(item.href) ? GOLD : 'rgba(255,255,255,0.7)' }}
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <div className="space-y-4">
                                            <span className="block text-lg font-mono uppercase tracking-widest text-[#FFD700] text-start">
                                                {item.label}
                                            </span>
                                            <div className="ps-4 border-s border-white/10 space-y-3">
                                                {services.map(service => (
                                                    <Link
                                                        key={service.href}
                                                        href={service.href}
                                                        onClick={() => setIsMobileOpen(false)}
                                                        className="block text-sm text-white/60 hover:text-white text-start"
                                                    >
                                                        {service.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="pt-6 border-t border-white/10">
                                <span className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-4 text-start">Language</span>
                                <div className="flex justify-start">
                                    <LocaleSwitcher />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header >
    );
}
