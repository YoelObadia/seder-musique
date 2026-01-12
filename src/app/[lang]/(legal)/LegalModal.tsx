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
}

export default function LegalModal({ isOpen, onClose, lang }: LegalModalProps) {

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
        };
    }, [isOpen, lenis]);

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
                            className="bg-[#0A0A0A] w-full max-w-3xl max-h-[85vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
                            // Gestion RTL si jamais tu ajoutes l'arabe plus tard
                            dir={lang === 'he' ? 'rtl' : 'ltr'}
                        >

                            {/* --- HEADER STICKY (Le bouton X ne bougera pas) --- */}
                            <div className="sticky top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
                                <h2 className="text-xl font-display font-bold uppercase text-white tracking-wider">
                                    Mentions Légales
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
                                className="overflow-y-auto p-6 md:p-10 space-y-10 text-white/80 font-serif leading-relaxed custom-scrollbar"
                                data-lenis-prevent
                            >

                                {/* Section 1 */}
                                <section>
                                    <h3 className="text-sm font-sans font-bold text-[#FFD700] uppercase tracking-widest mb-4">
                                        1. Édition du site
                                    </h3>
                                    <p className="text-sm">
                                        Propriétaire : <strong>[NOM DE TA SOCIÉTÉ]</strong><br />
                                        Statut : SAS / SARL au capital de [MONTANT] €<br />
                                        SIRET : [NUMÉRO SIRET] - RCS : [VILLE]<br />
                                        Adresse : [ADRESSE COMPLÈTE]<br />
                                        Contact : [EMAIL]
                                    </p>
                                </section>

                                {/* Section 2 */}
                                <section>
                                    <h3 className="text-sm font-sans font-bold text-[#FFD700] uppercase tracking-widest mb-4">
                                        2. Hébergement
                                    </h3>
                                    <p className="text-sm">
                                        Le site est hébergé par <strong>Vercel Inc.</strong><br />
                                        440 N Barranca Ave #4133 Covina, CA 91723<br />
                                        privacy@vercel.com
                                    </p>
                                </section>

                                {/* Section 3 */}
                                <section>
                                    <h3 className="text-sm font-sans font-bold text-[#FFD700] uppercase tracking-widest mb-4">
                                        3. Propriété Intellectuelle
                                    </h3>
                                    <p className="text-sm">
                                        Tous les contenus présents sur ce site (textes, vidéos, images, sons, logos) sont protégés par le droit d'auteur. Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.
                                    </p>
                                </section>

                                {/* Section 4 */}
                                <section>
                                    <h3 className="text-sm font-sans font-bold text-[#FFD700] uppercase tracking-widest mb-4">
                                        4. Données Personnelles
                                    </h3>
                                    <p className="text-sm">
                                        Conformément au RGPD, vous disposez d'un droit d'accès et de rectification aux données vous concernant. Aucune donnée n'est vendue à des tiers. Pour exercer ce droit : [TON EMAIL].
                                    </p>
                                </section>

                                <div className="pt-8 border-t border-white/10 text-center text-xs text-white/40 font-sans">
                                    Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}