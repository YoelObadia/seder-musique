'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SonicButton from '@/components/ui/SonicButton';
import { Locale } from '@/i18n-config';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ContactClientProps {
    dict: any;
    lang: Locale;
}

type FormValues = {
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    artistType?: string;
    demo?: string;
    message: string;
};

export default function ContactClient({ dict, lang }: ContactClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const searchParams = useSearchParams();
    const urlType = searchParams.get('type');

    // 1. Map URL params to FINAL Logic
    let defaultType = '';
    if (urlType === 'booking') defaultType = 'booking_seder'; // Default to Seder (Stars)
    else if (urlType === 'talents') defaultType = 'talents_rd';
    else if (urlType === 'influence') defaultType = 'marketing'; // Map old URL param to new key
    else if (urlType && ['production', 'booking_rd'].includes(urlType)) defaultType = urlType;

    // Zod Schema with i18n
    const contactSchema = z.object({
        name: z.string().min(2, dict.contact.errors.name_required),
        email: z.string().email(dict.contact.errors.email_invalid),
        projectType: z.string().min(1, dict.contact.errors.required),
        artistType: z.string().optional(),
        demo: z.string().optional(),
        message: z.string().min(10, dict.contact.errors.message_too_short),
    });

    const { register, watch, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            projectType: defaultType
        }
    });

    useEffect(() => {
        if (defaultType) {
            setValue('projectType', defaultType);
        }
    }, [defaultType, setValue]);

    const projectType = watch('projectType');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Initial Animation
    useGSAP(() => {
        if (!isSuccess) { // Only animate form entry if not in success state (or handle transition)
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Staggered Form Entry
            tl.fromTo('.anim-entry',
                { y: 30, opacity: 0, filter: 'blur(10px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, delay: 0.2 }
            );

            // Waveform Animation (Continuous)
            gsap.to('.waveform-line', {
                scaleY: 1.5,
                duration: 2,
                stagger: {
                    each: 0.1,
                    yoyo: true,
                    repeat: -1
                },
                ease: 'sine.inOut'
            });

            // Highlight Pre-selection
            if (defaultType) {
                gsap.fromTo('.select-wrapper',
                    { boxShadow: '0 0 0 rgba(255, 215, 0, 0)', borderColor: 'rgba(255, 255, 255, 0.1)' },
                    {
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                        borderColor: '#FFD700',
                        duration: 1.5,
                        ease: 'power2.out',
                        delay: 1.2,
                        yoyo: true,
                        repeat: 1
                    }
                );
            }
        }
    }, { scope: containerRef, dependencies: [isSuccess] }); // Re-run if success state changes (to potentially animate success entry)

    // Dynamic Field Animations
    useGSAP(() => {
        if (!isSuccess) {
            // We target all potential dynamic containers
            const animatedFields = ['.artist-type-field', '.production-note', '.demo-field'];

            animatedFields.forEach(selector => {
                const el = formRef.current?.querySelector(selector);
                if (el) {
                    gsap.fromTo(el,
                        { height: 0, opacity: 0, marginTop: 0 },
                        { height: 'auto', opacity: 1, marginTop: (selector === '.production-note') ? 16 : 24, duration: 0.5, ease: 'power2.out' }
                    );
                }
            });
        }
    }, { dependencies: [projectType, isSuccess], scope: formRef });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitted(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, lang }),
            });

            if (res.ok) {
                // Animate out? 
                setIsSuccess(true);
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Error sending email');
                // Optionally handle error UI
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitted(false);
        }
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-[#FFD700] selection:text-black">

            {/* Background Ambient Noise & Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 h-full min-h-screen flex flex-col md:flex-row relative z-10 pt-32 pb-20">

                {/* LEFT: INFO & CONTEXT (Asymmetric) */}
                <div className="w-full md:w-5/12 pr-0 md:pr-12 lg:pr-24 flex flex-col justify-between mb-16 md:mb-0">
                    <div>
                        <span className="anim-entry block text-[#FFD700] font-mono text-xs uppercase tracking-[0.3em] mb-6">
                            {dict.contact.info.management}
                        </span>
                        <h1 className="anim-entry text-4xl md:text-6xl font-display font-medium uppercase leading-tight mb-8">
                            {dict.contact.title}
                        </h1>
                        <p className="anim-entry text-lg text-white/60 font-light leading-relaxed max-w-md">
                            {dict.contact.subtitle}
                        </p>
                    </div>

                    <div className="anim-entry mt-12 md:mt-0">
                        <div className="flex items-center gap-4 text-[#FFD700]/80 mb-2">
                            <span className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse" />
                            <span className="font-mono text-sm tracking-widest uppercase">{dict.contact.info.location}</span>
                        </div>
                        <p className="text-white/40 text-sm">contact@sedermusic.com</p>
                    </div>
                </div>

                {/* RIGHT: FORM (The Interaction) */}
                <div className="w-full md:w-7/12 relative min-h-[600px]">
                    {/* Vertical Divider Line (Desktop only) */}
                    <div className="hidden md:block absolute left-[-2px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    {isSuccess ? (
                        <div className="pl-0 md:pl-12 lg:pl-16 flex flex-col justify-center h-full anim-entry">
                            <div className="mb-8">
                                <span className="block text-white/30 font-mono text-xs uppercase tracking-[0.3em] mb-4">Status</span>
                                <h2 className="text-4xl md:text-5xl font-display uppercase text-[#FFD700] mb-6 leading-tight">
                                    {dict.contact.success.title}
                                </h2>
                            </div>
                            <p className="text-lg md:text-xl text-white/80 font-serif italic mb-12 leading-relaxed border-l-2 border-[#FFD700] pl-6 max-w-lg">
                                {dict.contact.success.message}
                            </p>
                            <div>
                                <SonicButton onClick={() => setIsSuccess(false)} variant="booking" className="px-10 py-4 uppercase tracking-widest text-xs">
                                    {dict.contact.success.reset_btn}
                                </SonicButton>
                            </div>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="pl-0 md:pl-12 lg:pl-16 flex flex-col gap-6 max-w-2xl py-10">

                            {/* Name */}
                            <div className="anim-entry group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#FFD700] transition-colors">
                                    {dict.contact.form.name}
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all duration-300 rounded-none`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.name.message}</span>}
                            </div>

                            {/* Email */}
                            <div className="anim-entry group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#FFD700] transition-colors">
                                    {dict.contact.form.email}
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all duration-300 rounded-none`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.email.message}</span>}
                            </div>

                            {/* Project Type */}
                            <div className="anim-entry group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#FFD700] transition-colors">
                                    {dict.contact.form.projectType.label}
                                </label>
                                <div className="relative select-wrapper transition-all duration-500 rounded-none">
                                    <select
                                        {...register('projectType')}
                                        className={`w-full bg-white/5 border ${errors.projectType ? 'border-red-500/50' : 'border-white/10'} p-4 text-white appearance-none focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all duration-300 rounded-none cursor-pointer`}
                                    >
                                        <option value="" className="bg-[#111] text-gray-500">...</option>
                                        <option value="booking_seder" className="bg-[#111]">{dict.contact.form.projectType.options.booking_seder}</option>
                                        <option value="booking_rd" className="bg-[#111]">{dict.contact.form.projectType.options.booking_rd}</option>
                                        <option value="talents_rd" className="bg-[#111]">{dict.contact.form.projectType.options.talents_rd}</option>
                                        <option value="production" className="bg-[#111]">{dict.contact.form.projectType.options.production}</option>
                                        <option value="marketing" className="bg-[#111]">{dict.contact.form.projectType.options.marketing}</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
                                </div>
                                {errors.projectType && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.projectType.message}</span>}
                            </div>

                            {/* CONDITIONAL Fields */}
                            {(projectType === 'booking_seder' || projectType === 'booking_rd') && dict.contact.form.dynamicFields?.artistType && (
                                <div className="artist-type-field overflow-hidden">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-[#A855F7] mb-2">
                                        {dict.contact.form.dynamicFields.artistType.label}
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('artistType')}
                                            className="w-full bg-[#A855F7]/10 border border-[#A855F7]/30 p-4 text-white appearance-none focus:outline-none focus:border-[#A855F7] transition-all duration-300 rounded-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#111] text-gray-500">...</option>
                                            {dict.contact.form.dynamicFields.artistType.options.map((opt: string, i: number) => (
                                                <option key={i} value={opt} className="bg-[#111]">{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
                                    </div>
                                </div>
                            )}

                            {projectType === 'talents_rd' && dict.contact.form.dynamicFields?.demo && (
                                <div className="demo-field overflow-hidden">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-2">
                                        {dict.contact.form.dynamicFields.demo}
                                    </label>
                                    <input
                                        {...register('demo')}
                                        type="text"
                                        className="w-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#3B82F6] transition-all duration-300 rounded-none"
                                        placeholder="SoundCloud, YouTube, Instagram..."
                                    />
                                </div>
                            )}

                            {projectType === 'production' && (
                                <div className="production-note overflow-hidden">
                                    <div className="flex items-start gap-3 p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 text-[#FFD700]">
                                        <span className="text-xl">✨</span>
                                        <p className="text-sm font-light leading-tight">
                                            {dict.contact.form.dynamicFields.productionNote}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Message */}
                            <div className="anim-entry group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#FFD700] transition-colors">
                                    {dict.contact.form.message}
                                </label>
                                <textarea
                                    {...register('message')}
                                    rows={4}
                                    className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all duration-300 rounded-none resize-none`}
                                    placeholder="..."
                                />
                                {errors.message && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.message.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <div className="anim-entry pt-6 flex justify-end">
                                <SonicButton
                                    type="submit"
                                    variant="booking"
                                    className="w-full md:w-auto px-12 py-4 text-sm"
                                    disabled={isSubmitted}
                                >
                                    {isSubmitted ? '...' : dict.contact.form.submit}
                                </SonicButton>
                            </div>

                        </form>
                    )}
                </div>
            </div>

            {/* GOLDEN WAVEFORM FOOTER */}
            <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center pointer-events-none opacity-30">
                <div className="flex gap-1 items-end h-full w-full max-w-4xl px-6">
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className="waveform-line flex-1 bg-gradient-to-t from-[#FFD700] to-transparent rounded-t-full opacity-60"
                            style={{
                                height: `${Math.random() * 40 + 10}%`,
                            }}
                        />
                    ))}
                </div>
            </div>

        </main>
    );
}
