import type { Metadata } from 'next';
import { i18n } from '@/i18n-config';
import '@/app/globals.css';
import { ReactLenis } from '@/lib/lenis'; // We'll create a wrapper for Client Component usage
import PersistentPlayer from '@/components/player/PersistentPlayer';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollReset from '@/components/utils/ScrollReset';

export const metadata: Metadata = {
    title: 'Seder Music Group',
    description: 'R&D Records, Production Studio & Booking Agency.',
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dir = lang === 'he' ? 'rtl' : 'ltr';

    return (
        <html lang={lang} dir={dir} suppressHydrationWarning>
            <head />
            {/* On l'ajoute ICI sur le body pour ignorer bis_register */}
            <body className="antialiased" suppressHydrationWarning>
                <ReactLenis root>
                    <ScrollReset />
                    <Header />
                    {children}
                    <Footer lang={lang as any} />
                    <PersistentPlayer />
                </ReactLenis>
            </body>
        </html>
    );
}