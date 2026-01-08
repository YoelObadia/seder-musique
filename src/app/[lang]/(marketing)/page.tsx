import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import HomeHero from '@/components/home/HomeHero';
import PillarsNav from '@/components/home/PillarsNav';
import PartnersTicker from '@/components/home/PartnersTicker';

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-background text-white selection:bg-accent selection:text-black">
            {/* HERO SECTION (3D + Split Text) */}
            <HomeHero dict={dict.home} />

            {/* PARTNERS TICKER */}
            <PartnersTicker />

            {/* PILLARS NAVIGATION (Cards) */}
            <PillarsNav dict={dict.home} />

            {/* Additional sections (Booking Wizard, etc) will go here */}
        </main>
    );
}
