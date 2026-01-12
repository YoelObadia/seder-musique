import 'server-only';
import type { Locale } from '@/i18n-config';

// We import the default dictionary to infer the type
import defaultDictionary from './dictionaries/fr.json';

// Type definition inferred from the default dictionary (French)
export type Dictionary = typeof defaultDictionary;

// Loader map
const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    fr: () => import('./dictionaries/fr.json').then((module) => module.default),
    he: () => import('./dictionaries/he.json').then((module) => module.default),
};

const artistDictionaries = {
    en: () => import('./dictionaries/artists/en.json').then((module) => module.default),
    fr: () => import('./dictionaries/artists/fr.json').then((module) => module.default),
    he: () => import('./dictionaries/artists/he.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    // Safe fallback to 'fr' if locale is somehow invalid or not found in map,
    // although middleware handles this.
    const loadDictionary = dictionaries[locale] || dictionaries.fr;
    return loadDictionary();
};

export const getArtistDictionary = async (locale: Locale) => {
    const loadDictionary = artistDictionaries[locale] || artistDictionaries.fr;
    return loadDictionary();
};
