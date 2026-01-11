import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import InfluenceClient from './InfluenceClient';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';
import SchemaOrg, { SederOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const isFr = lang === 'fr';
    const isHe = lang === 'he';

    const title = isFr
        ? "Agence d'Influence Luxe & Célébrités | Seder Music Group"
        : isHe
            ? "שיווק משפיענים וסלבס | Seder Music Group"
            : "Luxury Influencer Marketing Agency | Seder Music Group";

    const description = isFr
        ? "Connectez votre marque aux icônes de la musique. Stratégies d'influence exclusives pour le secteur du luxe et corporate. Impact réel, exécution parfaite."
        : isHe
            ? "חברו את המותג שלכם לאייקונים של עולם המוזיקה. אסטרטגיות משפיענים יוקרתיות למגזר העסקי. השפעה אמיתית, ביצוע מושלם."
            : "Connect your brand with music icons. Exclusive influencer strategies for luxury and corporate sectors. Real impact, flawless execution.";

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.seder-music.com/${lang}/services/influence`,
            languages: {
                'fr': `https://www.seder-music.com/fr/services/influence`,
                'en': `https://www.seder-music.com/en/services/influence`,
                'he': `https://www.seder-music.com/he/services/influence`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.seder-music.com/${lang}/services/influence`,
            siteName: 'Seder Music Group',
            images: [
                {
                    url: 'https://www.seder-music.com/images/og/influence.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Seder Music Influence',
                },
            ],
            locale: lang,
            type: 'website',
        },
    };
}

export default async function InfluencePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.influence;

    if (!content) return notFound();

    return (
        <>
            <SchemaOrg type="Organization" data={SederOrganizationSchema} />
            <SchemaOrg
                type="Service"
                data={{
                    name: "Luxury Influencer Marketing",
                    provider: { "@type": "Organization", name: "Seder Music Group" },
                    areaServed: "Global",
                    serviceType: "Marketing",
                    description: "High-end influencer marketing campaigns connecting luxury brands with musical artists."
                }}
            />
            <InfluenceClient content={content} lang={lang} />
        </>
    );
}
