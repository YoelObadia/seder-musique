'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Music, Users, Calendar, Star } from 'lucide-react';
import MagneticNavItem from '@/components/ui/MagneticNavItem';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [isMobileOpen]);

    // Smart Glass Logic
    const { scrollY } = useScroll();
    const headerBg = useTransform(scrollY, [0, 50], ["rgba(5,5,5,0)", "rgba(5,5,5,0.6)"]);
    const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
    const headerBorder = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"]);

    // Use dictionary values or fallback if nav is undefined (safety)
    const t = nav || {
        agency: 'AGENCE',
        services: 'SERVICES',
        submenu: {
            production: 'Production Événementielle',
            booking: 'Booking',
            influence: "Marketing d'Influence",
            talents: 'Talents'
        },
        contact: 'CONTACT'
    };

    const services = [
        {
            href: `/${lang}/services/booking`,
            label: t.submenu?.booking || 'Booking',
            key: 'booking',
            icon: <Calendar className="w-5 h-5 group-hover:text-black transition-colors" />
        },
        {
            href: `/${lang}/services/influence`,
            label: t.submenu?.influence || 'Influence',
            key: 'influence',
            icon: <Users className="w-5 h-5 group-hover:text-black transition-colors" />
        },
        {
            href: `/${lang}/services/production`,
            label: t.submenu?.production || 'Production',
            key: 'production',
            icon: <Music className="w-5 h-5 group-hover:text-black transition-colors" />
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
        { href: `/${lang}/contact`, label: t.contact },
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(href);

    // Mobile Menu Variants
    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as any }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as any }
        }
    };

    const linkVariants = {
        closed: { y: "100%", opacity: 0 },
        open: (i: number) => ({
            y: "0%",
            opacity: 1,
            transition: { duration: 0.5, delay: 0.1 + (i * 0.1), ease: [0.76, 0, 0.24, 1] as any }
        })
    };

    return (
        <>
            <motion.header
                style={{
                    backgroundColor: headerBg,
                    backdropFilter: headerBlur,
                    borderBottomColor: headerBorder,
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px'
                }}
                className="fixed top-0 start-0 end-0 z-[60] transition-all duration-500 pt-[var(--safe-top)]"
                onMouseLeave={() => setIsServicesHover(false)}
            >
                <nav className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
                    {/* Logo & Brand */}
                    <Link
                        href={`/${lang}`}
                        className="flex items-center gap-4 group relative z-[70]"
                        onClick={() => setIsMobileOpen(false)}
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
                    <ul className="hidden lg:flex items-center gap-8">
                        {simpleLinks.map((item) => (
                            <li
                                key={item.href}
                                className="relative h-full flex items-center text-sm"
                                onMouseEnter={() => item.isDropdown && setIsServicesHover(true)}
                                onMouseLeave={() => item.isDropdown && setIsServicesHover(false)}
                            >
                                {item.isDropdown ? (
                                    <>
                                        <button className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FFFFFF80] hover:text-[#FFD700] transition-colors relative z-10 px-2 py-2">
                                            {item.label}
                                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isServicesHover && "rotate-180")} />
                                        </button>

                                        <AnimatePresence>
                                            {isServicesHover && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95, x: isRTL ? '50%' : '-50%' }}
                                                    animate={{ opacity: 1, y: 0, scale: 1, x: isRTL ? '50%' : '-50%' }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95, x: isRTL ? '50%' : '-50%' }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute top-full start-1/2 pt-4 w-72 z-50"
                                                >
                                                    <div className="bg-[#0A0A0A]/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl p-2">
                                                        {services.map((service) => (
                                                            <Link
                                                                key={service.href}
                                                                href={service.href}
                                                                className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-lg group"
                                                                onClick={() => setIsServicesHover(false)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-[#FFD700] p-2 bg-[#FFD700]/5 rounded-lg group-hover:bg-[#FFD700] group-hover:text-black transition-all">
                                                                        {service.icon}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-display font-medium uppercase text-xs tracking-wider text-white">
                                                                            {service.label}
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-500 font-mono hidden group-hover:block transition-all">
                                                                            Explore
                                                                        </span>
                                                                    </div>
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
                                        className={cn(
                                            "text-xs font-mono uppercase tracking-widest transition-colors",
                                            isActive(item.href) ? "text-white" : "text-[#FFFFFF80] hover:text-[#FFD700]"
                                        )}
                                        active={isActive(item.href)}
                                    >
                                        {item.label}
                                    </MagneticNavItem>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-6 border-s border-white/10 ps-6 ms-6 h-8">
                        <LocaleSwitcher />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-white p-2 relative z-[70] hover:text-[#FFD700] transition-colors"
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </nav>
            </motion.header>

            {/* FULL SCREEN MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[55] bg-[#050505] lg:hidden flex flex-col pt-32 px-8 pb-10"
                    >
                        {/* Background Elements */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex-1 flex flex-col gap-8 overflow-y-auto">
                            {simpleLinks.map((item, i) => (
                                <div key={item.label} className="overflow-hidden">
                                    <motion.div
                                        custom={i}
                                        variants={linkVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                    >
                                        {!item.isDropdown ? (
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileOpen(false)}
                                                className={cn(
                                                    "block text-4xl md:text-5xl font-display uppercase font-bold tracking-tight mb-4 text-start transition-colors",
                                                    isActive(item.href) ? "text-[#FFD700]" : "text-white/60 hover:text-white"
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <div className="space-y-6">
                                                <span className="block text-4xl md:text-5xl font-display uppercase font-bold tracking-tight text-white text-start">
                                                    {item.label}
                                                </span>
                                                <div className="ps-6 border-s-2 border-white/10 space-y-4">
                                                    {services.map((service, idx) => (
                                                        <Link
                                                            key={service.href}
                                                            href={service.href}
                                                            onClick={() => setIsMobileOpen(false)}
                                                            className="block group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xl md:text-2xl font-serif italic text-white/40 group-hover:text-[#FFD700] transition-colors">
                                                                    0{idx + 1}
                                                                </span>
                                                                <span className="text-xl md:text-2xl font-display uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                                                                    {service.label}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        {/* Footer in Menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="pt-10 border-t border-white/10"
                        >
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="block text-xs font-mono uppercase tracking-widest text-[#FFD700] mb-4 text-start">
                                        Language
                                    </span>
                                    <LocaleSwitcher className="opacity-100" />
                                </div>
                                <div className="text-end">
                                    <p className="text-white/20 text-xs font-mono">
                                        © Seder Music
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
