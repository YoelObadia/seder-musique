import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import TalentsClient from './TalentsClient';
import { notFound } from 'next/navigation';

export default async function TalentsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.talents;

    if (!content) return notFound();

    return <TalentsClient content={content} lang={lang} />;
}
