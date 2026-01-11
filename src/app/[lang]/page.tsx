import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import HomeHero from '@/components/home/HomeHero';
import PartnersTicker from '@/components/home/PartnersTicker';
import ServicesSection from '@/components/home/ServicesSection';
import FinalManifesto from '@/components/home/FinalManifesto';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';
import SchemaOrg, { SederOrganizationSchema } from '@/components/seo/SchemaOrg';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const isFr = lang === 'fr';
    const isHe = lang === 'he';

    const title = isFr
        ? "Production Événementielle Luxe & Corporative (Jérusalem/Paris) | Seder Music Group"
        : isHe
            ? "הפקת אירועי יוקרה וניהול אמנותי (ירושלים) | Seder Music Group"
            : "Luxury Corporate Event Production & Artist Management (Jerusalem) | Seder Music Group";

    const description = isFr
        ? "L'excellence événementielle entre Jérusalem et Paris. Seder Music Group orchestre vos galas, délégations et événements corporate avec une signature artistique unique."
        : isHe
            ? "מצוינות בהפקת אירועים בין ירושלים לפריז. Seder Music Group מנהלת את הגאלות, המשלחות והאירועים העסקיים שלכם עם חותמת אמנותית ייחודית."
            : "Event excellence bridging Jerusalem and Paris. Seder Music Group orchestrates your galas, delegations, and corporate events with a unique artistic signature.";

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.seder-music.com/${lang}`,
            languages: {
                'fr': `https://www.seder-music.com/fr`,
                'en': `https://www.seder-music.com/en`,
                'he': `https://www.seder-music.com/he`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.seder-music.com/${lang}`,
            siteName: 'Seder Music Group',
            images: [
                {
                    url: 'https://www.seder-music.com/images/og/home.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Seder Music Group - Luxury Events',
                },
            ],
            locale: lang,
            type: 'website',
        },
    };
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
            <SchemaOrg type="Organization" data={SederOrganizationSchema} />
            {/* HERO */}
            <HomeHero dict={dict.home} lang={lang} />

            {/* SERVICES */}
            <ServicesSection dict={dict} lang={lang} />

            {/* PARTNERS TICKER */}
            {/* <PartnersTicker /> */}

            {/* MANIFESTO */}
            <FinalManifesto dict={dict} />

            {/* FINAL CTA */}
            <FinalCTA dict={dict} />

            {/* Spacer - Footer handles separation but keeping safety margin */}
            <div className="h-24" />
        </main>
    );
}
