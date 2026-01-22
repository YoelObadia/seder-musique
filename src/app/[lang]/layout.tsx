// import type { Metadata } from 'next'; // Removed duplicate
import { i18n } from '@/i18n-config';
import '@/app/globals.css';
import { ReactLenis } from '@/lib/lenis'; // We'll create a wrapper for Client Component usage
import PersistentPlayer from '@/components/player/PersistentPlayer';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollReset from '@/components/utils/ScrollReset';

import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
    themeColor: '#050505',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://www.seder-music.com'),
    title: {
        default: 'Seder Music Group | Event Production & Artist Management',
        template: '%s | Seder Music Group',
    },
    description: 'Agence de production événementielle, booking d\'artistes et label musical. Jérusalem, Paris, International.',
    applicationName: 'Seder Music',
    authors: [{ name: 'Seder Music Group', url: 'https://www.seder-music.com' }],
    creator: 'Seder Music Group',
    publisher: 'Seder Music Group',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://www.seder-music.com',
        siteName: 'Seder Music Group',
        title: 'Seder Music Group | Luxury Events & Talent Management',
        description: 'L\'excellence artistique au service de vos événements. Production, Booking, Label.',
        images: [
            {
                url: '/images/og/default.jpg',
                width: 1200,
                height: 630,
                alt: 'Seder Music Group',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@sedermusic',
        creator: '@sedermusic',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dir = lang === 'he' ? 'rtl' : 'ltr';
    const dict = await getDictionary(lang as Locale);

    return (
        <html lang={lang} dir={dir} suppressHydrationWarning>
            <head />
            {/* On l'ajoute ICI sur le body pour ignorer bis_register */}
            <body className="antialiased" suppressHydrationWarning>
                <ReactLenis root>
                    <Header nav={dict.nav} />
                    {children}
                    <Footer lang={lang as any} />
                    <PersistentPlayer />
                </ReactLenis>
            </body>
        </html>
    );
}