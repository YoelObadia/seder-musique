'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Locale } from '@/i18n-config';
import { Music, Mic2, Users, Star } from 'lucide-react';
import SmartCinematicVideo from '../ui/SmartCinematicVideo';

// ----------------------------------------------------------------------
// DATA & COLORS
// ----------------------------------------------------------------------
const ROTATION_RANGE = 15; // 15 est plus élégant que 20 pour ce design

const SERVICES_CONFIG = [
    {
        id: 'production',
        href: '/services/production',
        icon: <Music className="w-6 h-6" />,
        videoSrc: '/videos/production.webm',
        posterSrc: '/images/production-poster.webp',
        gradient: 'radial-gradient(circle at center, #10B981 0%, #064E3B 100%)',
        glowColor: '#10B981',
    },
    {
        id: 'influence',
        href: '/services/influence',
        icon: <Users className="w-6 h-6" />,
        videoSrc: '/videos/influence.webm',
        posterSrc: '/images/influence-poster.webp',
        gradient: 'radial-gradient(circle at center, #3B82F6 0%, #1E3A8A 100%)',
        glowColor: '#3B82F6',
    },
    {
        id: 'booking',
        href: '/services/booking',
        icon: <Mic2 className="w-6 h-6" />,
        videoSrc: '/videos/bookings.webm',
        posterSrc: '/images/bookings-poster.webp',
        gradient: 'radial-gradient(circle at center, #A855F7 0%, #581C87 100%)',
        glowColor: '#A855F7',
    },
    {
        id: 'talents',
        href: '/services/talents',
        icon: <Star className="w-6 h-6" />,
        videoSrc: '/videos/talents.webm',
        posterSrc: '/images/talents-poster.webp',
        gradient: 'radial-gradient(circle at center, #EF4444 0%, #991B1B 100%)',
        glowColor: '#EF4444',
    },
];

// ----------------------------------------------------------------------
// COMPONENT MAIN
// ----------------------------------------------------------------------
export default function ServicesSection({
    dict,
    lang,
}: {
    dict: any;
    lang: Locale;
}) {
    return (
        <section id="services" className="relative py-40 overflow-hidden bg-[#050505]">
            {/* Background elements */}
            <div className="absolute top-1/4 start-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-1/4 end-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none mix-blend-screen" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[clamp(3rem,5vw,5rem)] font-display font-bold uppercase tracking-tighter mb-8"
                    >
                        {dict.services_section.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-xl font-serif italic leading-relaxed"
                    >
                        {dict.services_section.subtitle}
                    </motion.p>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SERVICES_CONFIG.map((service, index) => {
                        const title = dict.services_section.cards[service.id].title;
                        const desc = dict.services_section.cards[service.id].desc;
                        const label = dict.nav.submenu[service.id];

                        // Calcul du délai de chargement vidéo (Cascade)
                        // 2s initial + 1.5s entre chaque carte
                        const staggerDelay = 2000 + (index * 1500);

                        return (
                            <TiltCard
                                key={service.id}
                                service={service}
                                title={title}
                                desc={desc}
                                label={label}
                                lang={lang}
                                index={index}
                                loadDelay={staggerDelay}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// TILT CARD COMPONENT
// ----------------------------------------------------------------------
function TiltCard({
    service,
    title,
    desc,
    lang,
    index,
    label,
    loadDelay
}: {
    service: typeof SERVICES_CONFIG[0];
    title: string;
    desc: string;
    lang: Locale;
    index: number;
    label: string;
    loadDelay: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], [ROTATION_RANGE, -ROTATION_RANGE]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [-ROTATION_RANGE, ROTATION_RANGE]);

    // Parallax léger pour la vidéo
    const videoX = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);
    const videoY = useTransform(ySpring, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        x.set(clientX / width - 0.5);
        y.set(clientY / height - 0.5);
        mouseX.set(clientX);
        mouseY.set(clientY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0); y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
                willChange: "transform", // Optimisation GPU
            }}
            className="relative h-[500px] w-full rounded-[2rem] cursor-pointer group perspective-1000"
        >
            <Link href={`/${lang}${service.href}`} className="block h-full w-full">
                <div
                    className="absolute inset-0 bg-[#0A0A0A] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 border border-white/5"
                    style={{
                        transform: "translateZ(0px)",
                        borderColor: isHovered ? service.glowColor : 'rgba(255,255,255,0.1)'
                    }}
                >
                    {/* --- VIDEO LAYER --- */}
                    <motion.div
                        className="absolute inset-[-10px] z-0 pointer-events-none"
                        style={{ x: videoX, y: videoY }}
                    >
                        <SmartCinematicVideo
                            posterSrc={service.posterSrc}
                            videoSrc={service.videoSrc}
                            shouldPlay={isHovered} // Lecture seulement au survol
                            loadDelay={loadDelay}  // Chargement différé
                            className="absolute inset-0 w-full h-full brightness-[0.8] saturate-[1.1]"
                        />

                        {/* Gradient Overlay pour lisibilité texte */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 z-[1]" />

                        {/* Color Tint Overlay */}
                        <div
                            className="absolute inset-0 mix-blend-overlay opacity-30 z-[1] transition-opacity duration-500"
                            style={{ backgroundColor: service.glowColor }}
                        />
                    </motion.div>

                    {/* --- SPOTLIGHT EFFECT --- */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 z-10"
                        style={{
                            background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${service.glowColor}40, transparent 40%)`,
                        }}
                    />

                    {/* --- CONTENT LAYER --- */}
                    <div
                        className="relative h-full flex flex-col justify-between p-8 z-20"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {/* TOP SECTION: Icon Box & Number */}
                        <div className="flex justify-between items-start w-full">
                            {/* Icon Box Vitré */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110 shadow-lg"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: isHovered ? '#FFF' : service.glowColor,
                                    boxShadow: isHovered ? `0 0 20px ${service.glowColor}40` : 'none'
                                }}
                            >
                                {service.icon}
                            </div>

                            {/* Number */}
                            <span className="font-serif text-sm font-medium text-white/40 tracking-widest">
                                0{index + 1}
                            </span>
                        </div>

                        {/* BOTTOM SECTION: Centered Text */}
                        <div className="flex flex-col items-center text-center space-y-3 pb-2">
                            {/* Separator Line & Label */}
                            <div className="flex items-center gap-4 mb-2 opacity-80">
                                <span className="h-[1px] w-6 bg-white/20" />
                                <span
                                    className="text-[10px] font-bold tracking-[0.2em] uppercase"
                                    style={{ color: service.glowColor }}
                                >
                                    {label || 'Service'}
                                </span>
                                <span className="h-[1px] w-6 bg-white/20" />
                            </div>

                            <h3 className="text-3xl font-display font-bold uppercase text-white drop-shadow-lg tracking-tight">
                                {title}
                            </h3>

                            <p className="text-sm font-serif text-white/70 line-clamp-2 max-w-[90%] leading-relaxed group-hover:text-white transition-colors">
                                {desc}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}