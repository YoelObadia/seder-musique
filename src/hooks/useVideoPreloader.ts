import { useState, useEffect } from 'react';

export function useVideoPreloader(videoSrc: string, delay: number) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        // Pas de préchargement sur mobile pour économiser la data (optionnel)
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) return;

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const preload = async () => {
            try {
                // 1. On attend son tour (le délai)
                await new Promise(resolve => {
                    timeoutId = setTimeout(resolve, delay);
                });

                if (!isMounted) return;

                // 2. On télécharge le fichier
                const response = await fetch(videoSrc);
                const blob = await response.blob();

                if (!isMounted) return;

                // 3. On crée l'URL locale (RAM)
                const objectUrl = URL.createObjectURL(blob);
                setSrc(objectUrl);
            } catch (error) {
                // En cas d'erreur ou d'annulation, on ne fait rien
            }
        };

        preload();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            if (src) URL.revokeObjectURL(src); // Nettoyage mémoire
        };
    }, [videoSrc, delay]);

    return src;
}