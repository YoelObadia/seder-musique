import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import ContactClient from './ContactClient';

import { Suspense } from 'react';

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <ContactClient dict={dict} lang={lang} />
        </Suspense>
    );
}
