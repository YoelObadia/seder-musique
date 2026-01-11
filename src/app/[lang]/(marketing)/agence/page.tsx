import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Image from 'next/image';

export const metadata = {
    title: 'Agence | Seder Music',
    description: 'Maison de Création Globale.',
};

export default async function AgencyPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FFD700] selection:text-black font-sans">
            {/* HERO */}
            <section className="pt-48 pb-32 px-6 container mx-auto text-center border-b border-white/5 relative overflow-hidden">


                <span className="text-[#FFD700] font-mono text-xs tracking-[0.5em] uppercase mb-12 block opacity-80">
                    Seder Music
                </span>
                <h1 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter mb-12 leading-[0.9]">
                    {dict.agency.hero_title}
                </h1>
                <p className="text-xl md:text-2xl text-white/50 font-serif italic max-w-2xl mx-auto tracking-wide">
                    {dict.agency.hero_subtitle}
                </p>
            </section>

            {/* VISION (The Origin) */}
            <section className="py-40 px-6 container mx-auto">
                <div className="grid md:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-4xl font-display mb-12 uppercase tracking-tight relative inline-block">
                            {dict.agency.vision_title}
                            <span className="absolute -bottom-4 start-0 w-12 h-[2px] bg-[#FFD700]" />
                        </h2>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed font-light font-display">
                            {dict.agency.vision_text.split('. ').map((sentence: string, i: number) => (
                                <span key={i} className="block mb-6">
                                    {sentence}{i < dict.agency.vision_text.split('. ').length - 1 ? '.' : ''}
                                </span>
                            ))}
                        </p>
                    </div>
                    {/* Image with Breathing Overlay */}
                    <div className="relative h-[600px] w-full bg-white/5 overflow-hidden group">
                        <Image
                            src="/images/agence.webp"
                            alt="Agence Seder Music - Jerusalem"
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={90}
                        />
                        <div className="absolute inset-0 bg-[#050505]/20 mix-blend-overlay pointer-events-none" />
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 pointer-events-none mix-blend-soft-light" />
                    </div>
                </div>
            </section>

            {/* LEADERSHIP (The Standard) */}
            <section className="py-40 px-6 bg-white/[0.02] relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-20 items-center">
                        {/* Director Photo */}
                        <div className="relative w-full md:w-5/12 aspect-[3/4] grayscale hover:grayscale-0 transition-all duration-1000 group cursor-none">
                            <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                                <Image
                                    src="/images/p.webp"
                                    alt={dict.expert.name}
                                    fill
                                    className="object-cover object-top transition-transform duration-[1.5s] group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                <div className="absolute bottom-8 start-8 z-20">
                                    <div className="text-3xl font-display uppercase tracking-tighter mb-2">{dict.expert.name}</div>
                                    <div className="text-[#FFD700] text-sm font-mono tracking-widest">{dict.expert.role}</div>
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="w-full md:w-7/12">
                            <h2 className="text-4xl font-display mb-12 uppercase flex items-center gap-6">
                                {dict.agency.leadership_title}
                                <span className="h-[1px] w-32 bg-white/10" />
                            </h2>
                            <p className="text-xl md:text-2xl text-white/70 font-serif italic mb-12 leading-loose">
                                "{dict.agency.leadership_bio}"
                            </p>

                            <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
                                <div>
                                    <div className="text-5xl font-display text-[#FFD700] mb-2">15+</div>
                                    <div className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">{dict.expert.stats.experience}</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-display text-[#FFD700] mb-2">Seder Music</div>
                                    <div className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">Owner</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SIGNATURE */}
            <section className="py-60 px-6 bg-black text-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[20vw] font-bold font-display uppercase pointer-events-none select-none">
                    Seder Group
                </div>
                <div className="container mx-auto relative z-10">
                    <div className="w-1 h-24 bg-[#FFD700] mx-auto mb-12" />
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium uppercase tracking-tight text-white leading-tight max-w-5xl mx-auto">
                        {dict.agency.signature}
                    </h2>
                </div>
            </section>
        </main>
    );
}
