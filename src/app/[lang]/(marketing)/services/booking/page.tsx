import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import BookingClient from './BookingClient';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';
import SchemaOrg, { SederOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const isFr = lang === 'fr';
    const isHe = lang === 'he';

    const title = isFr
        ? "Booking Artistes & Orchestres VIP (International) | Seder Music"
        : isHe
            ? "בוקינג לאמנים בינלאומיים והרכבים לאירועים | Seder Music"
            : "VIP Artist & Orchestra Booking Agency (International) | Seder Music";

    const description = isFr
        ? "Réservez les plus grands artistes pour vos événements. Orchestres symphoniques, stars internationales, chanteurs israéliens. Un catalogue exclusif pour des moments inoubliables."
        : isHe
            ? "הזמינו את האמנים הגדולים ביותר לאירוע שלכם. תזמורות, כוכבים בינלאומיים, זמרים ישראלים. קטלוג אקסקלוסיבי לרגעים בלתי נשכחים."
            : "Book top-tier artists for your events. Symphonic orchestras, international stars, Israeli singers. An exclusive catalog for unforgettable moments.";

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.seder-music.com/${lang}/services/booking`,
            languages: {
                'fr': `https://www.seder-music.com/fr/services/booking`,
                'en': `https://www.seder-music.com/en/services/booking`,
                'he': `https://www.seder-music.com/he/services/booking`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.seder-music.com/${lang}/services/booking`,
            siteName: 'Seder Music Group',
            images: [
                {
                    url: 'https://www.seder-music.com/images/og/booking.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Seder Music Booking',
                },
            ],
            locale: lang,
            type: 'website',
        },
    };
}

export default async function BookingPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.booking;

    if (!content) return notFound();

    return (
        <>
            <SchemaOrg type="Organization" data={SederOrganizationSchema} />
            <SchemaOrg
                type="Service"
                data={{
                    name: "Artist Booking Agency",
                    provider: { "@type": "Organization", name: "Seder Music Group" },
                    areaServed: "Worldwide",
                    serviceType: "Entertainment Booking",
                    description: "Premium booking agency for international stars, orchestras, and VIP entertainment."
                }}
            />
            <BookingClient content={content} lang={lang} />
        </>
    );
}
