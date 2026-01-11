import { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

const BASE_URL = 'https://www.seder-music.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/agence',
        '/contact',
        '/services/production',
        '/services/booking',
        '/services/influence',
        '/services/talents',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add entries for each locale
    for (const locale of i18n.locales) {
        for (const route of routes) {
            sitemapEntries.push({
                url: `${BASE_URL}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        }
    }

    return sitemapEntries;
}
