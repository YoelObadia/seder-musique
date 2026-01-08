import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import ProductionClient from './ProductionClient';
import { notFound } from 'next/navigation';

export default async function ProductionPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.production;

    if (!content) return notFound();

    return <ProductionClient content={content} lang={lang} />;
}
