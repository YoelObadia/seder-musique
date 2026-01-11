import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import TalentsClient from './TalentsClient';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';
import SchemaOrg, { SederOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const isFr = lang === 'fr';
    const isHe = lang === 'he';

    const title = isFr
        ? "R&D Records | Label de Musique Juive & Méditerranéenne (Jérusalem) | Seder Music"
        : isHe
            ? "R&D Records | לייבל מוזיקה יהודית וים-תיכונית (ירושלים) | Seder Music"
            : "R&D Records | Jewish & Mediterranean Music Label (Jerusalem) | Seder Music";

    const description = isFr
        ? "Le label musical d'excellence. Développement d'artistes, production musicale et management de talents. Découvrez nos Graines de Talents et nos Stars confirmées."
        : isHe
            ? "לייבל המוזיקה למצוינות. פיתוח אמנים, הפקה מוזיקלית וניהול טאלנטים. גלו את הדור הבא של הכוכבים ואת האמנים המבוססים שלנו."
            : "The label of musical excellence. Artist development, music production, and talent management. Discover our Rising Stars and Established Artists.";

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.seder-music.com/${lang}/services/talents`,
            languages: {
                'fr': `https://www.seder-music.com/fr/services/talents`,
                'en': `https://www.seder-music.com/en/services/talents`,
                'he': `https://www.seder-music.com/he/services/talents`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.seder-music.com/${lang}/services/talents`,
            siteName: 'Seder Music Group',
            images: [
                {
                    url: 'https://www.seder-music.com/images/og/talents.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'R&D Records - Seder Music',
                },
            ],
            locale: lang,
            type: 'website',
        },
    };
}

export default async function TalentsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.talents;

    if (!content) return notFound();

    return (
        <>
            <SchemaOrg type="Organization" data={SederOrganizationSchema} />
            <SchemaOrg
                type="Service"
                data={{
                    name: "R&D Records - Music Label",
                    provider: { "@type": "Organization", name: "Seder Music Group" },
                    areaServed: "Worldwide",
                    serviceType: "Music Label",
                    description: "Artist management and music production label specializing in Jewish and Mediterranean music."
                }}
            />
            <TalentsClient content={content} lang={lang} />
        </>
    );
}
