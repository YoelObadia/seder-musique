import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import ContactClient from './ContactClient';

import { Suspense } from 'react';

import { Metadata } from 'next';
import SchemaOrg, { SederOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const isFr = lang === 'fr';
    const isHe = lang === 'he';

    const title = isFr
        ? "Contactez-nous | Booking Artiste & Devis Événement (Jérusalem) | Seder Music"
        : isHe
            ? "צרו קשר | בוקינג אמנים וקבלת הצעת מחיר (ירושלים) | Seder Music"
            : "Contact Us | Artist Booking & Event Quote (Jerusalem) | Seder Music";

    const description = isFr
        ? "Discutons de votre projet. Demande de devis pour production événementielle, booking d'artiste ou partenariat influence. Réponse sous 24h."
        : isHe
            ? "בואו נדבר על הפרויקט שלכם. בקשת הצעת מחיר להפקת אירוע, בוקינג לאמנים או שיתוף פעולה עם משפיענים. מענה תוך 24 שעות."
            : "Let's discuss your project. Request a quote for event production, artist booking, or influencer partnership. 24h response time.";

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.seder-music.com/${lang}/contact`,
            languages: {
                'fr': `https://www.seder-music.com/fr/contact`,
                'en': `https://www.seder-music.com/en/contact`,
                'he': `https://www.seder-music.com/he/contact`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.seder-music.com/${lang}/contact`,
            siteName: 'Seder Music Group',
            images: [
                {
                    url: 'https://www.seder-music.com/images/og/contact.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Contact Seder Music Group',
                },
            ],
            locale: lang,
            type: 'website',
        },
    };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <SchemaOrg type="Organization" data={SederOrganizationSchema} />
            <ContactClient dict={dict} lang={lang} />
        </Suspense>
    );
}
