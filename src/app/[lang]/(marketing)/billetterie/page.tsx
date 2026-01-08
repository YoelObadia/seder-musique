import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';

export default async function BilletteriePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6">
            <div className="container mx-auto">
                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-xs font-mono tracking-[0.5em] uppercase mb-6 block" style={{ color: '#FFD700' }}>
                        {dict.nav.billetterie}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tighter mb-8">
                        {dict.billetterie.hero_title}
                    </h1>
                    <p className="text-xl text-white/60 font-light mb-12">
                        {dict.billetterie.hero_subtitle}
                    </p>

                    {/* CTA to external ticketing */}
                    <a
                        href="https://tickets.seder.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 font-mono text-sm uppercase tracking-widest transition-all duration-300 rounded-full"
                        style={{
                            background: '#FFD700',
                            color: '#050505'
                        }}
                    >
                        {dict.billetterie.cta}
                        <span>↗</span>
                    </a>
                </div>
            </div>
        </main>
    );
}
