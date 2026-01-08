import { artists } from '@/data/artists';
import { releases } from '@/data/releases';
import { Artist, Release, Service } from '@/lib/types';

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
    await delay(50); // Artificial latency
    const artist = artists.find((a) => a.slug === slug);
    return artist || null;
}

export async function getAllBookableArtists(): Promise<Artist[]> {
    await delay(50);
    return artists.filter((testArtist) => testArtist.bookingDetails?.isBookable);
}

export async function getLatestReleases(limit: number = 3): Promise<Release[]> {
    await delay(50);
    // Sort by date descending
    const sortedReleases = [...releases].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedReleases.slice(0, limit);
}

export async function getFeaturedProjects(): Promise<Service[]> {
    await delay(50);
    // Mock data for services since we didn't create a separate file for it yet
    return [
        {
            id: 'srv_1',
            title: 'Full Scale Production',
            description: 'End-to-end album production, mixing, and mastering in our analog-digital hybrid suites.',
            videoLoopUrl: 'https://res.cloudinary.com/seder/video/upload/v1/services/production-loop.mp4'
        },
        {
            id: 'srv_2',
            title: 'Visual Identity',
            description: 'Generative art, 3D assets, and motion design for the modern artist.',
            videoLoopUrl: 'https://res.cloudinary.com/seder/video/upload/v1/services/visuals-loop.mp4'
        }
    ];
}

export async function getArtistReleases(artistId: string): Promise<Release[]> {
    await delay(50);
    return releases.filter(r => r.artistId === artistId);
}
