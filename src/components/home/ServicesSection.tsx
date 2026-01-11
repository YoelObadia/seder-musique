'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Locale } from '@/i18n-config';
import { ArrowUpRight, Music, Mic2, Users, Star } from 'lucide-react';

const GOLD = '#FFD700';

// ----------------------------------------------------------------------
// DATA & COLORS
// ----------------------------------------------------------------------
const SERVICES_CONFIG = [
    {
        id: 'production',
        href: '/services/production',
        icon: <Music className="w-8 h-8" />,
        videoSrc: '/videos/production.webm',
        // Emerald & Gold - Brightened
        gradient: 'radial-gradient(circle at center, #10B981 0%, #064E3B 100%)',
        glowColor: '#10B981',
        delay: 0.1
    },
    {
        id: 'influence',
        href: '/services/influence',
        icon: <Users className="w-8 h-8" />,
        videoSrc: '/videos/influence.webm',
        // Sapphire & Gold - Brightened
        gradient: 'radial-gradient(circle at center, #3B82F6 0%, #1E3A8A 100%)',
        glowColor: '#3B82F6',
        delay: 0.2
    },
    {
        id: 'booking',
        href: '/services/booking',
        icon: <Mic2 className="w-8 h-8" />,
        videoSrc: '/videos/bookings.webm',
        // Amethyst & Gold - Brightened
        gradient: 'radial-gradient(circle at center, #A855F7 0%, #581C87 100%)',
        glowColor: '#A855F7',
        delay: 0.3
    },
    {
        id: 'talents',
        href: '/services/talents',
        icon: <Star className="w-8 h-8" />,
        videoSrc: '/videos/talents.webm',
        // Ruby & Gold - Brightened
        gradient: 'radial-gradient(circle at center, #EF4444 0%, #991B1B 100%)',
        glowColor: '#EF4444',
        delay: 0.4
    },
];

// ----------------------------------------------------------------------
// 3D TILT PROPS
// ----------------------------------------------------------------------
const ROTATION_RANGE = 20;

// ----------------------------------------------------------------------
// COMPONENT
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


            {/* Ambient liquid blobs - Boosted Opacity */}
            <div className="absolute top-1/4 start-1/4 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-1/4 end-1/4 w-[600px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

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

                        return (
                            <TiltCard
                                key={service.id}
                                service={service}
                                title={title}
                                desc={desc}
                                label={label}
                                lang={lang}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// TILT CARD COMPONENT WITH SPOTLIGHT
// ----------------------------------------------------------------------
function TiltCard({
    service,
    title,
    desc,
    lang,
    index,
    label
}: {
    service: typeof SERVICES_CONFIG[0];
    title: string;
    desc: string;
    lang: Locale;
    index: number;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    // Lazy Load Video
    const isInView = useInView(ref, { once: true, margin: "0px 0px 200px 0px" });

    // Mouse position relative to center of card
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Mouse position relative to top-left of card (for spotlight)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    // Transform logic for tilt
    const rotateX = useTransform(ySpring, [-0.5, 0.5], [ROTATION_RANGE, -ROTATION_RANGE]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [-ROTATION_RANGE, ROTATION_RANGE]);

    // Parallax logic for video (moves opposite to tilt for depth)
    const videoX = useTransform(xSpring, [-0.5, 0.5], [-15, 15]); // 15px movement
    const videoY = useTransform(ySpring, [-0.5, 0.5], [-15, 15]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // For tilt
        const xPct = clientX / width - 0.5;
        const yPct = clientY / height - 0.5;

        x.set(xPct);
        y.set(yPct);

        // For spotlight
        mouseX.set(clientX);
        mouseY.set(clientY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: service.delay, duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
            }}
            className="relative h-[450px] rounded-[2rem] cursor-pointer group perspective-1000"
        >
            <Link href={`/${lang}${service.href}`} className="block h-full w-full">
                {/* Card Container */}
                <div
                    className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[2rem] border border-white/10
                                transition-all duration-500 overflow-hidden shadow-xl"
                    style={{
                        transform: "translateZ(0px)",
                        borderColor: isHovered ? service.glowColor : 'rgba(255,255,255,0.1)'
                    }}
                >
                    {/* VIDEO BACKGROUND (HTML5) WITH PARALLAX */}
                    <motion.div
                        className="absolute inset-[-20px] z-0 pointer-events-none overflow-hidden rounded-[2rem] bg-black"
                        style={{ x: videoX, y: videoY }} // Parallax movement
                    >
                        {isInView && (
                            <video
                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 brightness-110 saturate-125"
                                src={service.videoSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        )}

                        {/* COLOR OVERLAY (Jewel Tone) */}
                        <div
                            className="absolute inset-0 mix-blend-multiply z-[1] transition-opacity duration-700"
                            style={{
                                backgroundColor: service.glowColor,
                                opacity: 0.1
                            }}
                        />
                        {/* GRADIENT OVERLAY (Bottom fade) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[2]" />
                    </motion.div>

                    {/* Spotlight Effect - Brightened, Top Layer */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300 z-20"
                        style={{
                            background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${service.glowColor}50, transparent 40%)`,
                        }}
                    />

                    {/* Content Layer */}
                    <div
                        className="relative h-full flex flex-col justify-between p-10 z-30"
                        style={{ transform: "translateZ(40px)" }}
                    >
                        {/* Top: Icon & Number */}
                        <div className="flex justify-between items-start">
                            <div
                                className="p-4 rounded-2xl bg-black/40 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300 shadow-lg"
                                style={{
                                    color: isHovered ? '#000' : service.glowColor,
                                    backgroundColor: isHovered ? service.glowColor : 'rgba(0,0,0,0.4)',
                                    boxShadow: isHovered ? `0 0 30px ${service.glowColor}60` : 'none'
                                }}
                            >
                                {service.icon}
                            </div>
                            <span className="font-mono text-xs text-white/60">0{index + 1}</span>
                        </div>

                        {/* Bottom: Text */}
                        <div>
                            <div className="flex items-center gap-3 mb-4 opacity-100 transition-opacity duration-300">
                                <span className="h-[1px] w-8 transition-all duration-300" style={{ backgroundColor: service.glowColor }} />
                                <span className="text-xs font-mono tracking-widest uppercase shadow-black drop-shadow-md" style={{ color: service.glowColor }}>
                                    {isHovered ? 'Discover' : label || 'Explore'}
                                </span>
                            </div>

                            <h3 className="h-10 text-3xl font-display font-bold uppercase mb-4 text-white transition-colors drop-shadow-2xl">
                                {title}
                            </h3>
                            <p className="text-white/80 text-base font-serif italic leading-relaxed group-hover:text-white transition-colors drop-shadow-md">
                                {desc}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
