import { Artist } from '@/lib/types';

export const artists: Artist[] = [
    {
        id: 'art_1',
        slug: 'kairos-flux',
        name: 'KAIROS FLUX',
        heroVideoUrl: 'https://res.cloudinary.com/seder/video/upload/v1/artists/kairos-main.mp4',
        tags: ['Ethereal Techno', 'Live Performance', 'Visual Art'],
        labelDetails: {
            spotifyId: 'kairos123',
            fanBio: `
# Beyond Time

Kairos Flux represents the intersection of digital precision and organic chaos. Emerging from the underground warehouses of Berlin, their sound is a manifesto of the "Now".

* "A sonic architecture that rebuilds itself with every beat." - Mixmag
* "Unapologetically futuristic." - RA
      `,
            releases: ['rel_1', 'rel_2'],
        },
        bookingDetails: {
            priceRange: '$$$',
            technicalRiderUrl: '/docs/riders/kairos_tech_2025.pdf',
            isBookable: true,
            stats: {
                monthlyListeners: '2.4M',
                instagramFollowers: '450K',
            },
        },
    },
    {
        id: 'art_2',
        slug: 'nara-v',
        name: 'NARA V',
        heroVideoUrl: 'https://res.cloudinary.com/seder/video/upload/v1/artists/nara-main.mp4',
        tags: ['Dark Pop', 'Experimental', 'Fashion'],
        labelDetails: {
            spotifyId: 'narav456',
            fanBio: `
# The Voice of Void.

Nara V constructs vocal landscapes that haunt the soul. Her lyrics pierce through the noise of modern existence.
      `,
            releases: ['rel_3'],
        },
        // Not bookable through the agency currently, pure Label artist for now
        bookingDetails: {
            priceRange: '$$',
            technicalRiderUrl: '',
            isBookable: false,
            stats: {
                monthlyListeners: '890K',
                instagramFollowers: '1.2M',
            }
        }
    },
    {
        id: 'art_3',
        slug: 'void-walker',
        name: 'VOID WALKER',
        heroVideoUrl: 'https://res.cloudinary.com/seder/video/upload/v1/artists/void-main.mp4',
        tags: ['Industrial', 'Techno', 'Raw'],
        // Booking Only Artist
        bookingDetails: {
            priceRange: '$$',
            technicalRiderUrl: '/docs/riders/void_tech.pdf',
            isBookable: true,
            stats: {
                monthlyListeners: '150K',
                instagramFollowers: '35K',
            },
        },
    },
];
