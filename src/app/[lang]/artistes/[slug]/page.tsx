import { getDictionary, getArtistDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { notFound } from 'next/navigation';
import ArtistProfileClient, { ArtistProfileData } from '@/components/talents/ArtistProfileClient';

interface Props {
    params: Promise<{
        lang: Locale;
        slug: string;
    }>;
}

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
    const artistDict = await getArtistDictionary(lang); // Load rich artist data
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

    // 2. Fetch Rich Data from Artist Dictionary
    // We cast artistDict to any because the keys are dynamic slugs
    const richData = (artistDict as any)[slug] || {
        bio: ["Biographie à venir..."],
        stats: [],
        gallery: []
    };

    const fullProfile: ArtistProfileData = {
        name: foundData.name,
        role: foundData.role,
        image: foundData.image.replace('.webp', '-p.webp'), // Use landscape version for profile hero
        slug: foundData.slug,
        type: type as 'graine' | 'artiste',
        ...richData, // Merge bio, stats, gallery from JSON
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
