import { Release } from '@/lib/types';

export const releases: Release[] = [
    {
        id: 'rel_1',
        title: 'Chronos',
        artistId: 'art_1',
        type: 'Album',
        coverUrl: 'https://res.cloudinary.com/seder/image/upload/v1/releases/chronos.jpg',
        date: '2025-10-15',
        streamingLinks: {
            spotify: 'https://open.spotify.com/album/...',
            appleMusic: 'https://music.apple.com/us/album/...',
        },
    },
    {
        id: 'rel_2',
        title: 'Entropy',
        artistId: 'art_1',
        type: 'EP',
        coverUrl: 'https://res.cloudinary.com/seder/image/upload/v1/releases/entropy.jpg',
        date: '2025-06-01',
        streamingLinks: {
            spotify: 'https://open.spotify.com/album/...',
            soundcloud: 'https://soundcloud.com/...',
        },
    },
    {
        id: 'rel_3',
        title: 'Glass Heart',
        artistId: 'art_2',
        type: 'Single',
        coverUrl: 'https://res.cloudinary.com/seder/image/upload/v1/releases/glass-heart.jpg',
        date: '2025-11-20',
        streamingLinks: {
            spotify: 'https://open.spotify.com/track/...',
            youtube: 'https://youtube.com/watch?v=...',
        },
    },
    {
        id: 'rel_4',
        title: 'System Failure',
        artistId: 'art_3',
        type: 'Single',
        coverUrl: 'https://res.cloudinary.com/seder/image/upload/v1/releases/system.jpg',
        date: '2025-08-10',
        streamingLinks: {
            spotify: 'https://open.spotify.com/track/...',
        },
    },
    {
        id: 'rel_5',
        title: 'Neon Nights',
        artistId: 'art_1', // Featuring context potentially
        type: 'Single',
        coverUrl: 'https://res.cloudinary.com/seder/image/upload/v1/releases/neon.jpg',
        date: '2025-01-05',
        streamingLinks: {
            spotify: 'https://open.spotify.com/track/...',
        },
    },
];
