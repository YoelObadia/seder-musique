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
import { ArrowRight, Loader2, Mail, MapPin, Check } from 'lucide-react';

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
    const isRTL = lang === 'he';
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const searchParams = useSearchParams();
    const urlType = searchParams.get('type');

    // 1. Map URL params to FINAL Logic
    let defaultType = '';
    if (urlType === 'booking') defaultType = 'booking_talent'; // Client seeking Artist
    else if (urlType === 'management') defaultType = 'artist_management'; // Artist seeking Manager
    else if (urlType === 'talents') defaultType = 'artist_management'; // Application
    else if (urlType === 'influence') defaultType = 'marketing';
    else if (urlType === 'booking_rd') defaultType = 'booking_seder';
    else if (urlType && ['production'].includes(urlType)) defaultType = urlType;


    // Zod Schema with Conditional Logic
    const contactSchema = z.object({
        name: z.string().min(2, dict.contact.errors.name_required),
        email: z.string().email(dict.contact.errors.email_invalid),
        projectType: z.string().min(1, dict.contact.errors.required),
        artistType: z.string().optional(),
        demo: z.string().optional(),
        message: z.string().min(4, dict.contact.errors.message_too_short),
    }).superRefine((data, ctx) => {
        // Management Branch: Demo is REQUIRED
        if (data.projectType === 'artist_management') {
            if (!data.demo || data.demo.length < 5) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: dict.contact.errors.demo_required,
                    path: ['demo']
                });
            }
            if (!data.artistType) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: dict.contact.errors.profile_required,
                    path: ['artistType']
                });
            }
        }
        // Booking Branch: Artist Type is REQUIRED
        if (data.projectType === 'booking_talent' && !data.artistType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: dict.contact.errors.talent_type_required,
                path: ['artistType']
            });
        }
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

    const contactInfo = [
        {
            icon: <Mail className="w-6 h-6" />,
            label: dict.contact.info.email_label || 'Email',
            value: "rds.event.production@gmail.com",
            action: "mailto:rds.event.production@gmail.com"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            label: dict.contact.info.location_label || 'Studio',
            value: dict.contact.info.location || 'Jerusalem, Israel',
            //action: "https://maps.google.com/?q=Paris,France"
        }
    ];

    // Dynamic Left Side Content
    const isManagement = projectType === 'artist_management';
    const leftTitle = isManagement
        ? (dict.contact?.management?.title || "Représentation Artistique")
        : (dict.contact?.booking?.title || dict.contact.title);

    const leftSubtitle = isManagement
        ? (dict.contact?.management?.subtitle || "Rejoignez R&D Records. Proposez votre démo et discutons de votre carrière.")
        : (dict.contact?.booking?.subtitle || "Nous trouvons l'artiste adapté à votre vision pour vos événements.");

    const leftInfo = isManagement ? "MANAGEMENT" : (dict.contact.info.management || "BOOKING");


    // Initial Animation
    useGSAP(() => {
        if (!isSuccess) {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Staggered Form Entry
            tl.fromTo('.anim-entry',
                { y: 30, opacity: 0, filter: 'blur(10px)' },
                { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, delay: 0.2 }
            );

            // Waveform Animation
            gsap.to('.waveform-line', {
                scaleY: 1.5,
                duration: 2,
                stagger: { each: 0.1, yoyo: true, repeat: -1 },
                ease: 'sine.inOut'
            });
        }
    }, { scope: containerRef, dependencies: [isSuccess] });

    // Dynamic Field Animations
    useGSAP(() => {
        if (!isSuccess) {
            const animatedFields = ['.artist-type-field', '.production-note', '.demo-field'];
            animatedFields.forEach(selector => {
                const el = formRef.current?.querySelector(selector);
                if (el) {
                    gsap.fromTo(el,
                        { height: 0, opacity: 0, marginTop: 0 },
                        { height: 'auto', opacity: 1, marginTop: 24, duration: 0.5, ease: 'power2.out' }
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
                setIsSuccess(true);
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Error sending email');
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitted(false);
        }
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-[#FFD700] selection:text-black" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Background Ambient Noise & Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none">

                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 start-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#FFD700]/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 h-full min-h-screen flex flex-col md:flex-row gap-10 md:gap-0 relative z-10 pt-24 md:pt-32 pb-20">

                {/* LEFT: INFO & CONTEXT (Dynamic) */}
                <div className="contents md:flex md:flex-col w-full md:w-5/12 pe-0 md:pe-12 lg:pe-24 justify-start gap-16 md:mb-0">
                    <div className="space-y-6 md:space-y-8 order-1 flex flex-col items-center md:items-start text-center md:text-start w-full max-w-2xl mx-auto md:mx-0">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-none break-words">
                            {dict.contact.title.line1}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#E5C100]">
                                {dict.contact.title.line2}
                            </span>
                        </h1>
                        <p className="text-white/60 text-base md:text-lg font-light tracking-wide max-w-sm">
                            {dict.contact.description}
                        </p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid gap-8 order-3 w-full max-w-2xl mx-auto md:mx-0">
                        {contactInfo.map((item, i) => (
                            <a
                                key={i}
                                href={item.action}
                                className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 transition-all duration-500 text-center md:text-start"
                            >
                                <div className="p-3 rounded-full bg-white/5 text-[#FFD700] group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1">{item.label}</p>
                                    <p className="text-lg font-display uppercase tracking-wide group-hover:text-white transition-colors break-all md:break-normal">{item.value}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="w-full md:w-7/12 relative min-h-[600px] order-2">
                    <div className="hidden md:block absolute start-[-2px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    {isSuccess ? (
                        <div className="ps-0 md:ps-12 lg:ps-16 flex flex-col justify-center h-full anim-entry">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-8 border border-green-500/50">
                                <Check className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-4xl font-display uppercase mb-4 text-white">
                                {dict.contact.success.title}
                            </h3>
                            <p className="text-lg md:text-xl text-white/80 font-serif italic mb-12 leading-relaxed border-s-2 border-[#FFD700] ps-6 max-w-lg">
                                {dict.contact.success.message}
                            </p>
                            <SonicButton
                                onClick={() => setIsSuccess(false)}
                                variant="booking"
                                className="border border-white/20 hover:bg-white hover:text-black hover:border-white px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 w-fit"
                            >
                                {dict.contact.success.button}
                            </SonicButton>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="ps-0 md:ps-12 lg:ps-16 flex flex-col gap-6 max-w-2xl py-10 mx-auto md:mx-0">

                            {/* Name */}
                            <div className="anim-entry group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#FFD700] transition-colors">
                                    {dict.contact.form.name}
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all duration-300 rounded-none`}
                                    placeholder="Nom complet"
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
                                    placeholder="email@exemple.com"
                                />
                                {errors.email && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.email.message}</span>}
                            </div>

                            {/* Project Type (Main Selector) */}
                            <div className="anim-entry group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#FFD700] transition-colors">
                                    {dict.contact.form.projectType.label}
                                </label>
                                <div className="relative select-wrapper transition-all duration-500 rounded-none">
                                    <select
                                        {...register('projectType')}
                                        className={`w-full bg-white/5 border ${errors.projectType ? 'border-red-500/50' : 'border-white/10'} p-4 text-white appearance-none focus:outline-none focus:border-[#FFD700] focus:bg-white/10 transition-all duration-300 rounded-none cursor-pointer`}
                                    >
                                        <option value="" className="bg-[#111] text-gray-500">{dict.contact.form.placeholders.select_request}</option>
                                        <option value="booking_talent" className="bg-[#111]">{dict.contact.form.projectType.options.booking_talent}</option>
                                        <option value="artist_management" className="bg-[#111]">{dict.contact.form.projectType.options.artist_management}</option>

                                        <option disabled className="bg-[#111] text-gray-600">──────────</option>

                                        <option value="booking_seder" className="bg-[#111]">{dict.contact.form.projectType.options.booking_seder}</option>
                                        <option value="production" className="bg-[#111]">{dict.contact.form.projectType.options.production}</option>
                                        <option value="marketing" className="bg-[#111]">{dict.contact.form.projectType.options.marketing}</option>
                                    </select>
                                    <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-white/40`}>▼</div>
                                </div>
                                {errors.projectType && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.projectType.message}</span>}
                            </div>

                            {/* CONDITIONAL: BRANCH CLIENT (Booking Talent) */}
                            {projectType === 'booking_talent' && (
                                <div className="artist-type-field overflow-hidden">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-[#FFD700] mb-2">
                                        {dict.contact.form.labels.talent_type}
                                    </label>
                                    <div className="relative">
                                        <select
                                            {...register('artistType')}
                                            className="w-full bg-[#FFD700]/5 border border-[#FFD700]/30 p-4 text-white appearance-none focus:outline-none focus:border-[#FFD700] transition-all duration-300 rounded-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#111] text-gray-500">{dict.contact.form.placeholders.specific_talent}</option>
                                            {dict.contact.form.clientNeeds?.map((opt: string, i: number) => (
                                                <option key={i} value={opt} className="bg-[#111]">{opt}</option>
                                            ))}
                                        </select>
                                        <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-white/40`}>▼</div>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-2 italic">
                                        {dict.contact.form.notes.talent_selection}
                                    </p>
                                    {errors.artistType && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.artistType.message}</span>}
                                </div>
                            )}


                            {/* CONDITIONAL: BRANCH ARTIST (Management) */}
                            {projectType === 'artist_management' && (
                                <>
                                    <div className="artist-type-field overflow-hidden">
                                        <label className="block text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-2">
                                            {dict.contact.form.labels.artist_profile}
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register('artistType')}
                                                className="w-full bg-[#3B82F6]/5 border border-[#3B82F6]/30 p-4 text-white appearance-none focus:outline-none focus:border-[#3B82F6] transition-all duration-300 rounded-none cursor-pointer"
                                            >
                                                <option value="" className="bg-[#111] text-gray-500">{dict.contact.form.placeholders.artist_profile}</option>
                                                {dict.contact.form.artistProfiles?.map((opt: string, i: number) => (
                                                    <option key={i} value={opt} className="bg-[#111]">{opt}</option>
                                                ))}
                                            </select>
                                            <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-white/40`}>▼</div>
                                        </div>
                                        {errors.artistType && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.artistType.message}</span>}
                                    </div>

                                    {/* DEMO LINK (Required for Artists) */}
                                    <div className="demo-field overflow-hidden">
                                        <label className="block text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-2">
                                            {dict.contact.form.labels.demo_link} <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            {...register('demo')}
                                            type="text"
                                            className={`w-full bg-[#3B82F6]/5 border ${errors.demo ? 'border-red-500/50' : 'border-[#3B82F6]/30'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#3B82F6] transition-all duration-300 rounded-none`}
                                            placeholder={dict.contact.form.placeholders.demo_link}
                                        />
                                        {errors.demo && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.demo.message}</span>}
                                    </div>
                                </>
                            )}

                            {/* Legacy / Other Conditional Logic */}
                            {projectType === 'talents_rd' && !isManagement && ( // Keeps old logic fallback if needed
                                <div className="demo-field overflow-hidden">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-2">
                                        {dict.contact.form.dynamicFields?.demo || "Demo"}
                                    </label>
                                    <input
                                        {...register('demo')}
                                        type="text"
                                        className="w-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#3B82F6] transition-all duration-300 rounded-none"
                                        placeholder="SoundCloud, YouTube..."
                                    />
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
                                    placeholder={isManagement ? dict.contact.form.placeholders.message_artist : dict.contact.form.placeholders.message_client}
                                />
                                {errors.message && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.message.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <div className="anim-entry pt-6 flex justify-center md:justify-end">
                                <SonicButton
                                    type="submit"
                                    variant="booking"
                                    className="w-full md:w-auto px-12 py-4 text-sm flex items-center justify-center gap-2"
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
