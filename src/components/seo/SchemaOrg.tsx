import Script from 'next/script';

interface SchemaOrgProps {
    type: 'Organization' | 'Service';
    data: any;
}

export default function SchemaOrg({ type, data }: SchemaOrgProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    };

    return (
        <Script
            id={`schema-${type.toLowerCase()}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Helper presets
export const SederOrganizationSchema = {
    name: "Seder Music Group",
    url: "https://www.seder-music.com",
    logo: "https://www.seder-music.com/images/logo.png",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Jerusalem",
        addressCountry: "IL"
    },
    sameAs: [
        "https://www.instagram.com/sedermusicgroup",
        "https://www.linkedin.com/company/seder-music-group",
        "https://www.facebook.com/sedermusicgroup"
    ],
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+972-50-000-0000",
        contactType: "customer service",
        areaServed: ["IL", "FR", "US", "Worldwide"],
        availableLanguage: ["French", "English", "Hebrew"]
    }
};
