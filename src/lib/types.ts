export type PriceRange = '$' | '$$' | '$$$';

export interface SocialStats {
    monthlyListeners: string;
    instagramFollowers: string;
}

export interface LabelDetails {
    spotifyId: string;
    fanBio: string; // Markdown content
    releases: string[]; // Array of Release IDs
}

export interface BookingDetails {
    priceRange: PriceRange;
    technicalRiderUrl: string; // URL to PDF
    isBookable: boolean;
    stats: SocialStats;
}

export interface Artist {
    id: string;
    slug: string;
    name: string;
    heroVideoUrl: string;
    tags: string[];
    labelDetails?: LabelDetails;
    bookingDetails?: BookingDetails;
}

export interface ExternalLinks {
    spotify?: string;
    appleMusic?: string;
    soundcloud?: string;
    youtube?: string;
}

export interface Release {
    id: string;
    title: string;
    artistId: string;
    type: 'Single' | 'EP' | 'Album';
    coverUrl: string;
    date: string; // ISO Date string
    streamingLinks: ExternalLinks;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    videoLoopUrl: string; // For Bento hover effect
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: 'Booking' | 'Label' | 'General';
}
