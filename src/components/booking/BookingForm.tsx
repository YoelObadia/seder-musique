'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Locale } from '@/i18n-config';
import SonicButton from '@/components/ui/SonicButton';
import { Check, User, Mail, Phone, Music, MessageSquare, Mic2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface BookingFormProps {
    dict: any;
    lang: Locale;
}

type FormValues = {
    name: string;
    email: string;
    phone?: string;
    artistName?: string;
    message: string;
};

export default function BookingForm({ dict, lang }: BookingFormProps) {
    const isRTL = lang === 'he';
    const formRef = useRef<HTMLFormElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Schema
    const bookingSchema = z.object({
        name: z.string().min(2, dict.booking.form.required),
        email: z.string().email(dict.booking.form.required),
        phone: z.string().optional(),
        artistName: z.string().optional(),
        message: z.string().min(4, dict.booking.form.required),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            artistName: '',
            message: ''
        }
    });

    // Entrance Animation
    useGSAP(() => {
        // Stagger in form items on mount
        gsap.from('.form-item', {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all"
        });
    }, { scope: containerRef });

    // Success Animation
    useGSAP(() => {
        if (isSuccess) {
            gsap.fromTo('.success-anim',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
            );
        }
    }, { dependencies: [isSuccess], scope: containerRef });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitted(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    projectType: 'booking_seder',
                    lang
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
                reset();
            } else {
                console.error('Error sending booking request');
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitted(false);
        }
    };

    if (isSuccess) {
        return (
            <div ref={containerRef} className="w-full max-w-2xl mx-auto text-center py-12 px-6 success-anim bg-white/5 backdrop-blur-md rounded-3xl border border-[#A855F7]/30 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 bg-[#A855F7] rounded-full blur-xl opacity-40 animate-pulse" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#A855F7] to-[#7E22CE] flex items-center justify-center border border-white/20">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-display uppercase mb-6 text-white tracking-tight">
                    {dict.booking.form.success}
                </h3>
                <p className="text-white/70 mb-10 text-lg font-serif italic max-w-lg mx-auto leading-relaxed">
                    {dict.contact.success.message}
                </p>

                <SonicButton
                    onClick={() => setIsSuccess(false)}
                    variant="booking"
                    className="border-white/20 hover:border-[#A855F7] hover:bg-[#A855F7]/10 text-white transition-all bg-transparent"
                >
                    {dict.contact.success.reset_btn}
                </SonicButton>
            </div>
        );
    }

    // Floating Icon Wrapper
    const InputWrapper = ({ children, icon: Icon, error }: { children: React.ReactNode, icon: any, error?: string }) => (
        <div className="relative group">
            <div className={cn(
                "absolute top-11 start-4 z-10 transition-colors duration-300 pointer-events-none",
                error ? "text-red-400" : "text-white/30 group-focus-within:text-[#A855F7]"
            )}>
                <Icon className="w-5 h-5" />
            </div>
            {children}
        </div>
    );

    return (
        <div ref={containerRef} className="w-full max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 form-item">
                <h2 className="text-4xl md:text-6xl font-display uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight">
                    {dict.booking.form.title}
                </h2>
                <p className="text-white/50 font-serif italic text-xl md:text-2xl">
                    {dict.booking.form.subtitle}
                </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="form-item space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#A855F7]/80 ms-1">
                            {dict.booking.form.name}
                        </label>
                        <InputWrapper icon={User} error={errors.name?.message}>
                            <input
                                {...register('name')}
                                type="text"
                                className={cn(
                                    "w-full h-14 bg-white/5 border backdrop-blur-sm ps-12 pe-4 text-white placeholder-white/20 focus:outline-none transition-all duration-300 rounded-xl",
                                    errors.name
                                        ? "border-red-500/50 focus:border-red-500 bg-red-500/5"
                                        : "border-white/10 hover:border-white/20 focus:border-[#A855F7] focus:bg-white/10 focus:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                                )}
                                dir="auto"
                            />
                        </InputWrapper>
                        {errors.name && <span className="text-red-400 text-xs tracking-wide uppercase ms-1">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-item space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#A855F7]/80 ms-1">
                            {dict.booking.form.email}
                        </label>
                        <InputWrapper icon={Mail} error={errors.email?.message}>
                            <input
                                {...register('email')}
                                type="email"
                                className={cn(
                                    "w-full h-14 bg-white/5 border backdrop-blur-sm ps-12 pe-4 text-white placeholder-white/20 focus:outline-none transition-all duration-300 rounded-xl",
                                    errors.email
                                        ? "border-red-500/50 focus:border-red-500 bg-red-500/5"
                                        : "border-white/10 hover:border-white/20 focus:border-[#A855F7] focus:bg-white/10 focus:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                                )}
                                dir="ltr" // Toujours LTR pour les emails
                            />
                        </InputWrapper>
                        {errors.email && <span className="text-red-400 text-xs tracking-wide uppercase ms-1">{errors.email.message}</span>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Phone */}
                    <div className="form-item space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#A855F7]/80 ms-1">
                            {dict.booking.form.phone}
                        </label>
                        <InputWrapper icon={Phone}>
                            <input
                                {...register('phone')}
                                type="tel"
                                className="w-full h-14 bg-white/5 border border-white/10 backdrop-blur-sm ps-12 pe-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 hover:border-white/20 focus:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 rounded-xl"
                                dir="ltr" // Souvent mieux d'avoir les numéros en LTR pour la saisie (+972...)
                            />
                        </InputWrapper>
                    </div>

                    {/* Artist Name */}
                    <div className="form-item space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#A855F7]/80 ms-1">
                            {dict.booking.form.artist}
                        </label>
                        <InputWrapper icon={Mic2}>
                            <input
                                {...register('artistName')}
                                type="text"
                                placeholder={dict.booking.form.placeholders?.specific_talent || ""}
                                className="w-full h-14 bg-white/5 border border-white/10 backdrop-blur-sm ps-12 pe-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 hover:border-white/20 focus:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 rounded-xl"
                                dir="auto"
                            />
                        </InputWrapper>
                    </div>
                </div>

                {/* Message */}
                <div className="form-item space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-[#A855F7]/80 ms-1">
                        {dict.booking.form.message}
                    </label>
                    <div className="relative group">
                        <div className={cn(
                            "absolute top-4 start-4 z-10 transition-colors duration-300 pointer-events-none",
                            errors.message ? "text-red-400" : "text-white/30 group-focus-within:text-[#A855F7]"
                        )}>
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <textarea
                            {...register('message')}
                            rows={5}
                            className={cn(
                                "w-full bg-white/5 border backdrop-blur-sm ps-12 pe-4 py-4 text-white placeholder-white/20 focus:outline-none transition-all duration-300 rounded-xl resize-none",
                                errors.message
                                    ? "border-red-500/50 focus:border-red-500 bg-red-500/5"
                                    : "border-white/10 hover:border-white/20 focus:border-[#A855F7] focus:bg-white/10 focus:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                            )}
                            dir="auto"
                        />
                    </div>
                    {errors.message && <span className="text-red-400 text-xs tracking-wide uppercase ms-1">{errors.message.message}</span>}
                </div>

                {/* Submit */}
                <div className="form-item flex justify-center pt-8">
                    <SonicButton
                        type="submit"
                        variant="booking"
                        className={cn(
                            "w-full md:w-auto px-16 py-5 text-sm flex items-center justify-center gap-3 border border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]",
                            isSubmitted && "opacity-70 cursor-wait"
                        )}
                        disabled={isSubmitted}
                    >
                        {isSubmitted ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            dict.booking.form.submit
                        )}
                    </SonicButton>
                </div>
            </form>
        </div>
    );
}
