import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { notFound } from 'next/navigation';
import ArtistProfileClient, { ArtistProfileData } from '@/components/talents/ArtistProfileClient';

interface Props {
    params: Promise<{
        lang: Locale;
        slug: string;
    }>;
}

// SIMULATED DATA STORE
// In a real app, this would likely come from the dictionary/CMS or extended MDF files.
// For now, we manually map specific slugs to rich content.
const MOCK_ARTISTS_DATA: Record<string, Omit<ArtistProfileData, 'name' | 'role' | 'image' | 'slug' | 'type'>> = {
    'samuel-skouri': {
        bio: [
            "Samuel Skouri incarne une nouvelle vague de la musique méditerranéenne, fusionnant avec audace les mélismes orientaux et la pop contemporaine. Sa voix, à la fois puissante et nuancée, porte l'héritage d'une tradition séculaire tout en s'ouvrant aux sonorités modernes.",
            "Dès son plus jeune âge, il s'imprègne des classiques de la chanson andalouse et de la variété française, forgeant une identité vocale unique. Son premier projet chez R&D Records explore ces dualités, proposant un voyage émotionnel entre Jérusalem et Paris.",
            "Sur scène, Samuel déploie une énergie solaire, capable de transformer chaque concert en une communion intime avec son public, prouvant qu'il est bien plus qu'une voix : il est une présence."
        ],
        stats: [
            { label: "Style", value: "Pop Oriental" },
            { label: "Voix", value: "Tenor" }
        ],
        gallery: [
            "/images/samuel.webp", // Placeholder - reusing main image if no others
            "/images/placeholders/studio- mic.jpg" // Placeholder
        ]
    },
    'sarah-halfon': {
        bio: [
            "Sarah Halfon est une compositrice et pianiste dont les mélodies semblent raconter des histoires sans prononcer un mot. Sa musique, minimaliste et poignante, puise son inspiration dans le néo-classique et les musiques de film.",
            "Formée au conservatoire mais rebelle dans l'âme, elle rejoint R&D Records pour développer des bandes originales imaginaires qui accompagnent la vie de ceux qui l'écoutent. Son toucher unique au piano crée des atmosphères suspendues, hors du temps.",
            "Elle travaille actuellement sur son premier EP instrumental, mêlant piano acoustique et textures électroniques subtiles."
        ],
        stats: [
            { label: "Instrument", value: "Piano" },
            { label: "Style", value: "Néo-Classique" }
        ],
        gallery: [
            "/images/sarah.webp",
            "/images/placeholders/piano-hands.jpg"
        ]
    },
    'raphael-david-skouri': {
        bio: [
            "Raphaël David Skouri est un artiste confirmé qui a su conquérir les scènes les plus prestigieuses. Avec une carrière déjà riche en succès, il rejoint l'écurie R&D Records pour passer un nouveau cap dans sa direction artistique.",
            "Maître de l'émotion, il navigue avec aisance entre les registres liturgiques profonds et la chanson de variété haut de gamme. Sa collaboration avec le label marque un retour aux sources, avec une production plus épurée et organique.",
            "Sa voix, reconnaissable entre mille, est un véhicule d'émotions brutes, touchant directement l'âme de son auditoire."
        ],
        stats: [
            { label: "Expérience", value: "10+ Ans" },
            { label: "Concerts", value: "International" }
        ],
        gallery: [
            "/images/raphael.webp",
            "/images/placeholders/concert-lights.jpg"
        ]
    }
};

export async function generateStaticParams() {
    // Generate params for all known slugs to pre-render them
    return [
        { slug: 'samuel-skouri' },
        { slug: 'sarah-halfon' },
        { slug: 'raphael-david-skouri' }
    ];
}

export default async function ArtistPage({ params }: Props) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const t = dict.talents.cards;

    // 1. Find basic info in Dictionary (Shared Text)
    // We check both lists: Graines and Artistes
    const grainesList = t.graines.list || [];
    const artistesList = t.artistes.list || [];

    const graineFound = grainesList.find((p: any) => p.slug === slug);
    const artisteFound = artistesList.find((p: any) => p.slug === slug);

    const foundData = graineFound || artisteFound;

    if (!foundData) {
        return notFound();
    }

    const type = graineFound ? 'graine' : 'artiste';

    // 2. Merge with Rich/Simulated Data
    const richData = MOCK_ARTISTS_DATA[slug] || {
        bio: ["Biographie à venir..."],
        stats: [],
        gallery: [foundData.image]
    };

    const fullProfile: ArtistProfileData = {
        name: foundData.name,
        role: foundData.role,
        image: foundData.image.replace('.webp', '-p.webp'), // Use landscape version for profile hero
        slug: foundData.slug,
        type: type as 'graine' | 'artiste',
        ...richData,
        gallery: richData.gallery.length > 0 ? richData.gallery : [foundData.image]
    };

    const labels = {
        back: dict.nav.submenu.talents, // "Talents"
        book: type === 'graine' ? dict.talents.cards.graines.cta : dict.talents.cards.artistes.cta,
        biography: dict.artist.biography_label,
        gallery: "Galerie" // Or add to dictionary, hardcoded for now or use "Media"
    };

    return <ArtistProfileClient artist={fullProfile} lang={lang} labels={labels} />;
}
