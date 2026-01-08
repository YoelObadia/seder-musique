import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import FooterClient from './FooterClient';

export default async function Footer({ lang }: { lang: Locale }) {
    const dict = await getDictionary(lang);
    return <FooterClient content={dict.footer} lang={lang} />;
}
