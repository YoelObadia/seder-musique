'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from '@studio-freight/react-lenis';

export default function ScrollReset() {
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        // Immediate native reset
        window.scrollTo(0, 0);

        // Lenis reset if available
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenis]);

    return null;
}
