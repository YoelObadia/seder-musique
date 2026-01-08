import { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

const BASE_URL = 'https://www.sedermusicgroup.com'; // Replace with actual domain

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        '',
        '/label',
        '/production',
        '/booking',
        '/agence',
        '/contact',
        '/legal',
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
