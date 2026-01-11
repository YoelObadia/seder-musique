import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import ProductionClient from './ProductionClient';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';
import SchemaOrg, { SederOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const isFr = lang === 'fr';
    const isHe = lang === 'he';

    const title = isFr
        ? "Production Événementielle Technique & Artistique (Gala, Concert) | Seder Music"
        : isHe
            ? "הפקה טכנית ואמנותית לאירועים (גאלה, קונצרטים) | Seder Music"
            : "Technical & Artistic Event Production (Gala, Concerts) | Seder Music";

    const description = isFr
        ? "De la conception scénographique à la régie technique. Seder Music Group produit des événements d'exception en Israël et en Europe. Son, Lumière, Vidéo, Scène."
        : isHe
            ? "מעיצוב במה ועד ניהול טכני. Seder Music Group מפיקה אירועים יוצאי דופן בישראל ובאירופה. סאונד, תאורה, וידאו, במה."
            : "From scenography to technical management. Seder Music Group produces exceptional events in Israel and Europe. Sound, Lighting, Video, Stage.";

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.seder-music.com/${lang}/services/production`,
            languages: {
                'fr': `https://www.seder-music.com/fr/services/production`,
                'en': `https://www.seder-music.com/en/services/production`,
                'he': `https://www.seder-music.com/he/services/production`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.seder-music.com/${lang}/services/production`,
            siteName: 'Seder Music Group',
            images: [
                {
                    url: 'https://www.seder-music.com/images/og/production.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Seder Music Production',
                },
            ],
            locale: lang,
            type: 'website',
        },
    };
}

export default async function ProductionPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.production;

    if (!content) return notFound();

    return (
        <>
            <SchemaOrg type="Organization" data={SederOrganizationSchema} />
            <SchemaOrg
                type="Service"
                data={{
                    name: "Event Production Services",
                    provider: { "@type": "Organization", name: "Seder Music Group" },
                    areaServed: ["Israel", "Europe"],
                    serviceType: "Event Production",
                    description: "Full-service technical and artistic production for high-end events, galas, and concerts."
                }}
            />
            <ProductionClient content={content} lang={lang} />
        </>
    );
}
