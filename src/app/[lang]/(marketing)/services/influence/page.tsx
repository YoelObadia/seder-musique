import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import InfluenceClient from './InfluenceClient';
import { notFound } from 'next/navigation';

export default async function InfluencePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.influence;

    if (!content) return notFound();

    return <InfluenceClient content={content} lang={lang} />;
}
