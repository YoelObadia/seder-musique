export interface SocialLinks {
    instagram?: string;
    spotify?: string;
    youtube?: string;
    soundcloud?: string;
}

export interface Release {
    id: string;
    title: string;
    type: 'Single' | 'EP' | 'Album';
    coverImage: string;
    releaseDate: string;
    spotifyUrl?: string;
}

export interface Artist {
    id: string;
    slug: string;
    name: string;
    bio: string;
    tags: string[];
    image: string;
    heroVideo?: string;
    stats: {
        followers: string;
        monthlyListeners: string;
    };
    socials: SocialLinks;
    releases: Release[];
    isLabel: boolean;    // Signed to label
    isBooking: boolean;  // Manage booking
}
