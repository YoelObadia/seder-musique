
import { Artist } from '@/types/data';
import artistsData from '@/data/artists.json';

// Type assertion because JSON import might be inferred loosely
const artists = artistsData as Artist[];

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
    return artists.find((artist) => artist.slug === slug);
}

export async function getAllArtists(): Promise<Artist[]> {
    return artists;
}
