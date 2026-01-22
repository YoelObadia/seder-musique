import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';

export default async function BilletteriePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-48 pb-24 px-6 relative overflow-hidden flex flex-col items-center justify-center">

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#FFD700] opacity-5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
            </div>

            <div className="container mx-auto relative z-10">
                {/* Hero */}
                <div className="max-w-5xl mx-auto text-center">
                    <span className="inline-block py-2 px-4 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-mono tracking-[0.3em] uppercase mb-8 backdrop-blur-md">
                        {dict.nav.billetterie}
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium uppercase tracking-tighter mb-8 leading-[0.9]">
                        {dict.billetterie.hero_title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/50 font-serif italic mb-16 max-w-2xl mx-auto leading-relaxed">
                        {dict.billetterie.hero_subtitle}
                    </p>

                    {/* CTA to external ticketing using SonicButton style logic manually or importing if possible, sticking to a nice <a> tag */}
                    <a
                        href="https://tickets.seder.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-4 px-12 py-6 font-mono text-sm uppercase tracking-widest transition-all duration-300 rounded-full bg-[#FFD700] text-black hover:bg-white hover:scale-105"
                    >
                        <span className="font-bold relative z-10">{dict.billetterie.cta}</span>
                        <span className="relative z-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-lg">↗</span>
                    </a>
                </div>
            </div>
        </main>
    );
}
