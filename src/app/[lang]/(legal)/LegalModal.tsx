'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Locale } from '@/i18n-config';

import { useLenis } from '@studio-freight/react-lenis';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Locale;
    title: string;
    content: string;
}

export default function LegalModal({ isOpen, onClose, lang, title, content }: LegalModalProps) {

    const lenis = useLenis();

    // 1. Empêcher le scroll de la page principale quand le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            lenis?.stop();
            document.body.style.overflow = 'hidden';
        } else {
            lenis?.start();
            document.body.style.overflow = 'unset';
        }
        return () => {
            lenis?.start();
            document.body.style.overflow = 'unset';
            // Important: ne pas oublier de relancer lenis si le composant démonte
        };
    }, [isOpen, lenis]);

    // Fonction pour parser et formater le contenu
    const renderContent = () => {
        return content.split('\n').map((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={index} className="h-4" />;

            // Titres de section: ex "1) Éditeur..." ou "1. Éditeur..."
            // On vérifie si la ligne commence par un chiffre suivi d'une parenthèse ou d'un point
            if (/^\d+[\)\.]/.test(trimmed)) {
                const isRTL = lang === 'he';
                return (
                    <h3 key={index} className={`text-[#FFD700] font-sans font-bold text-lg uppercase tracking-wider mt-10 mb-6 border-[#FFD700] ${isRTL ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
                        {trimmed}
                    </h3>
                );
            }

            // Sous-titres principaux (ex: "Mentions Légales...")
            if (index === 0 || trimmed.includes("Politique de confidentialité —")) {
                return (
                    <p key={index} className="text-white font-sans text-xl font-semibold mb-8">
                        {trimmed}
                    </p>
                );
            }

            // Highlight des champs clés (Email:, Tel:, etc.)
            // On split la ligne si elle contient un ":" pour mettre en gras la clé
            if (trimmed.includes(':') && trimmed.length < 100) {
                const [key, ...rest] = trimmed.split(':');
                const value = rest.join(':');
                // Simple hack pour éviter de casser des phrases normales avec ":"
                // On assume que les champs clés sont courts et ont une structure "Clé : Valeur"
                const keywords = [
                    'Email', 'Mail', 'Tel', 'Tél', 'Téléphone', 'Phone', 'Adresse', 'Address', 'Statut', 'Status', 'N°', 'Directeur', 'Director', 'Hébergement', 'Hosting', 'Contact',
                    'אימייל', 'טלפון', 'כתובת', 'סטטוס', 'מנהל', 'מייל' // Hebrew keywords
                ];

                if (keywords.some(k => key.trim().includes(k))) {
                    return (
                        <p key={index} className="text-white/80 font-sans text-sm leading-relaxed mb-2">
                            <strong className="text-white/90 font-semibold">{key} :</strong>{value}
                        </p>
                    );
                }
            }

            // Paragraphes standards
            return (
                <p key={index} className="text-white/70 font-sans text-sm leading-8 tracking-wide mb-3">
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* --- BACKDROP (Fond noir flou) --- */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} // Ferme quand on clique dehors
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
                    />

                    {/* --- MODAL CONTAINER --- */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-[#0A0A0A] w-full max-w-4xl max-h-[85vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
                            // Gestion RTL si jamais tu ajoutes l'arabe plus tard
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                        >

                            {/* --- HEADER STICKY (Le bouton X ne bougera pas) --- */}
                            <div className="sticky top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
                                <h2 className="text-xl font-display font-bold uppercase text-white tracking-wider">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="group p-2 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500 transition-all duration-300"
                                    aria-label="Fermer"
                                >
                                    <X className="w-5 h-5 text-white/60 group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>

                            {/* --- CONTENT SCROLLABLE --- */}
                            {/* C'est ici qu'on met la scrollbar custom */}
                            <div
                                className="overflow-y-auto p-6 md:p-10 custom-scrollbar"
                                data-lenis-prevent
                            >
                                {renderContent()}

                                <div className="pt-8 mt-10 border-t border-white/10 text-center text-xs text-white/40 font-sans">
                                    {/* Footer du modal (Date ou Copyright si besoin) */}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}