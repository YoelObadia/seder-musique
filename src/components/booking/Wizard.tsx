'use client';

import React, { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingSchema, BookingFormData } from '@/lib/schemas';
import { submitBooking } from '@/actions/booking';
import { cn } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';

const REQUIREMENTS = {
    organizer: [
        "Budget minimum: $5,000",
        "Venue confirmée requise",
        "Professional riders only"
    ],
    artist: [
        "SoundCloud/Private Link",
        "Press Kit ready",
        "No attachments (Link only)"
    ]
};

// Common input styles via Tailwind
const INPUT_STYLES = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none transition-all duration-200 focus:border-accent focus:bg-white/10";

interface BookingWizardProps {
    initialArtist?: string;
}

export default function BookingWizard({ initialArtist }: BookingWizardProps) {
    // If initialArtist is present, we start at step 1 as an organizer
    const [step, setStep] = useState(initialArtist ? 1 : 0);
    const [role, setRole] = useState<'organizer' | 'artist' | null>(initialArtist ? 'organizer' : null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<any>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            role: 'organizer',
            name: '',
            email: '',
            message: '',
            artistName: initialArtist || ''
        },
        mode: 'onChange'
    });

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setValue
    } = form;

    const handleRoleSelect = (selectedRole: 'organizer' | 'artist') => {
        setRole(selectedRole);
        setValue('role', selectedRole);
        setStep(1);
    };

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        // Explicitly set role from state to ensure it matches schema if hidden input fails
        const payload = { ...data, role: role } as BookingFormData;

        // Server Action
        const res = await submitBooking(payload);
        setIsSubmitting(false);

        if (res.success) {
            setSuccess(true);
            setStep(2);
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 min-h-[600px] flex flex-col justify-center">
            <AnimatePresence mode="wait">

                {/* STEP 0: SELECT ROLE */}
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        <RoleCard
                            title="Organizer / Promoter"
                            description="Book Seder artists for your event or festival."
                            requirements={REQUIREMENTS.organizer}
                            onClick={() => handleRoleSelect('organizer')}
                        />
                        <RoleCard
                            title="Artist Application"
                            description="Apply to join the R&D Records roster."
                            requirements={REQUIREMENTS.artist}
                            onClick={() => handleRoleSelect('artist')}
                        />
                    </motion.div>
                )}

                {/* STEP 1: DYNAMIC FORM */}
                {step === 1 && role && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full bg-surface/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="mb-8 flex justify-between items-center">
                            <h2 className="text-2xl font-display text-white">
                                {role === 'organizer' ? 'Event Details' : 'Artist Profile'}
                            </h2>
                            <button onClick={() => setStep(0)} className="text-sm text-gray-500 hover:text-white transition">
                                ← Change Role
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <input type="hidden" {...register('role')} value={role} />

                            <div className="grid md:grid-cols-2 gap-6">
                                <InputGroup label="Name" error={errors.name?.message as string}>
                                    <input {...register('name')} className={INPUT_STYLES} placeholder="Jane Doe" />
                                </InputGroup>
                                <InputGroup label="Email" error={errors.email?.message as string}>
                                    <input {...register('email')} className={INPUT_STYLES} placeholder="jane@example.com" />
                                </InputGroup>
                            </div>

                            {role === 'organizer' && (
                                <>
                                    {initialArtist && (
                                        <div className="md:col-span-2 mb-4 p-4 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-between">
                                            <div>
                                                <span className="text-xs uppercase text-accent font-mono block mb-1">Booking Request For</span>
                                                <span className="text-xl font-display text-white uppercase">{initialArtist.replace(/-/g, ' ')}</span>
                                            </div>
                                            <input type="hidden" {...register('artistName')} />
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InputGroup label="Budget (USD)" error={errors.budget?.message as string}>
                                            <input type="number" {...register('budget')} className={INPUT_STYLES} placeholder="10000" />
                                        </InputGroup>
                                        <InputGroup label="Event Date" error={errors.date?.message as string}>
                                            <input type="date" {...register('date')} className={INPUT_STYLES} />
                                        </InputGroup>
                                    </div>
                                    <InputGroup label="Venue / Location" error={errors.venue?.message as string}>
                                        <input {...register('venue')} className={INPUT_STYLES} placeholder="Club Name, City" />
                                    </InputGroup>
                                </>
                            )}

                            {role === 'artist' && (
                                <InputGroup label="Demo Link (SoundCloud/Dropbox)" error={errors.demoLink?.message as string}>
                                    <input {...register('demoLink')} className={INPUT_STYLES} placeholder="https://soundcloud.com/..." />
                                </InputGroup>
                            )}

                            <InputGroup label="Additional Message" error={errors.message?.message as string}>
                                <textarea {...register('message')} rows={4} className={`${INPUT_STYLES} resize-none`} placeholder="Tell us more about your vision..." />
                            </InputGroup>

                            <div className="flex justify-end pt-4">
                                <MagneticButton type="submit" disabled={isSubmitting} className="bg-white text-black border-none hover:bg-gray-200">
                                    {isSubmitting ? 'Processing...' : 'Submit Request'}
                                </MagneticButton>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* STEP 2: SUCCESS */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent mb-6 border border-accent/50">
                            <svg width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </div>
                        <h3 className="text-3xl font-display text-white mb-2">Message Received</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            Your request has been logged in our system. Our team will review {role === 'organizer' ? 'the offer' : 'your profile'} and get back to you within 48 hours.
                        </p>
                        <button onClick={() => { setStep(0); setSuccess(false); setRole(null); }} className="text-sm underline text-white hover:text-accent">
                            Start a new request
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

function RoleCard({ title, description, requirements, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/50 transition-all duration-300 hover:bg-surface/80 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-black">
                    →
                </div>
            </div>

            <h3 className="text-2xl font-display text-white mb-2 group-hover:text-accent transition-colors">{title}</h3>
            <p className="text-gray-400 mb-6 font-mono text-sm min-h-[40px]">{description}</p>

            <div className="space-y-2">
                {requirements.map((req: string, i: number) => (
                    <div key={i} className="flex items-center text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/50 mr-2" />
                        {req}
                    </div>
                ))}
            </div>
        </div>
    );
}

function InputGroup({ label, error, children }: { label: string, error?: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                {label} {error && <span className="text-red-500 ml-2 normal-case tracking-normal">{error}</span>}
            </label>
            {children}
        </div>
    );
}
