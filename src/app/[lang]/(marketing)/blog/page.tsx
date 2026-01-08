import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

// Placeholder blog posts
const blogPosts = [
    {
        slug: 'ouverture-saison-2026',
        title: 'Ouverture de la Saison 2026',
        excerpt: 'Découvrez notre programme événementiel pour la nouvelle année...',
        date: '2026-01-15',
        image: null,
    },
    {
        slug: 'partenariat-tel-aviv',
        title: 'Nouveau Partenariat à Tel Aviv',
        excerpt: 'Seder Music Group étend sa présence au Moyen-Orient...',
        date: '2026-01-10',
        image: null,
    },
    {
        slug: 'marketing-influence-trends',
        title: 'Tendances Marketing d\'Influence 2026',
        excerpt: 'Les stratégies qui vont dominer l\'industrie événementielle...',
        date: '2026-01-05',
        image: null,
    },
];

export default async function BlogPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6">
            <div className="container mx-auto">
                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <span className="text-xs font-mono tracking-[0.5em] uppercase mb-6 block" style={{ color: '#FFD700' }}>
                        {dict.nav.blog}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tighter mb-8">
                        {dict.blog.hero_title}
                    </h1>
                    <p className="text-xl text-white/60 font-light">
                        {dict.blog.hero_subtitle}
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <article
                            key={post.slug}
                            className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                        >
                            {/* Image Placeholder */}
                            <div
                                className="aspect-video w-full"
                                style={{
                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
                                }}
                            />

                            {/* Content */}
                            <div className="p-6">
                                <time className="text-xs font-mono text-white/40 mb-3 block">
                                    {new Date(post.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'he' ? 'he-IL' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                                <h2 className="text-xl font-display font-bold mb-3 group-hover:text-[#FFD700] transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-white/50 mb-4">
                                    {post.excerpt}
                                </p>
                                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: '#FFD700' }}>
                                    {dict.blog.read_more} →
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
