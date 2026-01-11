import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import HomeHero from '@/components/home/HomeHero';
import PartnersTicker from '@/components/home/PartnersTicker';
import ServicesSection from '@/components/home/ServicesSection';
import FinalManifesto from '@/components/home/FinalManifesto';
import FinalCTA from '@/components/home/FinalCTA';

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
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
