'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Locale } from '@/i18n-config';
import SonicButton from '@/components/ui/SonicButton';
import { Check } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Schema
    const bookingSchema = z.object({
        name: z.string().min(2, dict.booking.form.required),
        email: z.string().email(dict.booking.form.required), // Using 'required' generic error for invalid email to keep it simple or add specific key if needed
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

    const onSubmit = async (data: FormValues) => {
        setIsSubmitted(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    projectType: 'booking_seder', // Hardcoded for this specific form
                    lang
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
                reset();
                // Optional: Scroll to success message if needed, but in-place replacement is fine
            } else {
                console.error('Error sending booking request');
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitted(false);
        }
    };

    useGSAP(() => {
        if (isSuccess) {
            gsap.fromTo('.success-anim',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, { dependencies: [isSuccess] });

    if (isSuccess) {
        return (
            <div className="w-full max-w-2xl mx-auto text-center py-10 success-anim border border-[#A855F7]/30 bg-[#A855F7]/5 rounded-2xl p-10">
                <div className="w-16 h-16 rounded-full bg-[#A855F7]/20 flex items-center justify-center mx-auto mb-6 border border-[#A855F7]/50">
                    <Check className="w-8 h-8 text-[#A855F7]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display uppercase mb-4 text-white">
                    {dict.booking.form.success}
                </h3>
                <p className="text-white/60 mb-8">
                    {dict.contact.success.message}
                </p>
                <SonicButton
                    onClick={() => setIsSuccess(false)}
                    variant="booking"
                    className="border border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white px-8 py-3 uppercase tracking-widest text-sm transition-colors"
                >
                    {dict.contact.success.reset_btn}
                </SonicButton>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-display uppercase mb-4">
                    {dict.booking.form.title}
                </h2>
                <p className="text-white/60 font-serif italic text-lg">
                    {dict.booking.form.subtitle}
                </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="group">
                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#A855F7] transition-colors">
                            {dict.booking.form.name} <span className="text-[#A855F7]">*</span>
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 transition-all duration-300 rounded-none`}
                        />
                        {errors.name && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="group">
                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#A855F7] transition-colors">
                            {dict.booking.form.email} <span className="text-[#A855F7]">*</span>
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 transition-all duration-300 rounded-none`}
                        />
                        {errors.email && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.email.message}</span>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="group">
                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#A855F7] transition-colors">
                            {dict.booking.form.phone}
                        </label>
                        <input
                            {...register('phone')}
                            type="tel"
                            className="w-full bg-white/5 border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 transition-all duration-300 rounded-none"
                        />
                    </div>

                    {/* Artist Name */}
                    <div className="group">
                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#A855F7] transition-colors">
                            {dict.booking.form.artist}
                        </label>
                        <input
                            {...register('artistName')}
                            type="text"
                            placeholder={dict.booking.form.placeholders?.specific_talent || ""}
                            className="w-full bg-white/5 border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 transition-all duration-300 rounded-none"
                        />
                    </div>
                </div>

                {/* Message */}
                <div className="group">
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-[#A855F7] transition-colors">
                        {dict.booking.form.message} <span className="text-[#A855F7]">*</span>
                    </label>
                    <textarea
                        {...register('message')}
                        rows={4}
                        className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7] focus:bg-white/10 transition-all duration-300 rounded-none resize-none`}
                    />
                    {errors.message && <span className="text-red-400 text-[10px] tracking-wide uppercase mt-1 block">{errors.message.message}</span>}
                </div>

                {/* Submit */}
                <div className="flex justify-center pt-6">
                    <SonicButton
                        type="submit"
                        variant="booking"
                        className="w-full md:w-auto px-12 py-4 text-sm flex items-center justify-center gap-2 border border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-all duration-300"
                        disabled={isSubmitted}
                    >
                        {isSubmitted ? '...' : dict.booking.form.submit}
                    </SonicButton>
                </div>
            </form>
        </div>
    );
}
