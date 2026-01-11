import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import HomeHero from '@/components/home/HomeHero';

import PartnersTicker from '@/components/home/PartnersTicker';

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-background text-white selection:bg-accent selection:text-black">
            {/* HERO SECTION (3D + Split Text) */}
            <HomeHero dict={dict.home} lang={undefined} />

            {/* PARTNERS TICKER */}
            <PartnersTicker />

            {/* PILLARS NAVIGATION (Cards) */}


            {/* Additional sections (Booking Wizard, etc) will go here */}
        </main>
    );
}
