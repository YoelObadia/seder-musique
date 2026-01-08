import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import BookingClient from './BookingClient';
import { notFound } from 'next/navigation';

export default async function BookingPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.service_pages?.booking;

    if (!content) return notFound();

    return <BookingClient content={content} lang={lang} />;
}
