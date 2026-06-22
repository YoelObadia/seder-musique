import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18n } from './i18n-config';

function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    // @ts-ignore
    const locales: string[] = i18n.locales;
    try {
        return matchLocale(languages, locales, i18n.defaultLocale);
    } catch (e) {
        console.warn('Locale matching failed, falling back to default:', e);
        return i18n.defaultLocale;
    }
}

// Regex pour bloquer les bots agressifs et scrapers qui consomment du CPU
const badBotRegex = /Baiduspider|YandexBot|AhrefsBot|SemrushBot|MJ12bot|DotBot|MegaIndex|BLEXBot|PetalBot|ZoominfoBot|DataForSeoBot|Omgilibot|Bytespider|CCBot|Amazonbot|ClaudeBot|GPTBot/i;

// Regex pour les bots classiques (Google, Bing, etc.)
const goodBotRegex = /bot|crawler|spider|googlebot|bingbot|facebookexternalhit|twitterbot/i;

export function middleware(request: NextRequest) {
    // 1. Ignorer les requêtes non-GET (ex: POST formulaires, Server Actions)
    // Cela évite de calculer la langue et d'exécuter du code pour rien
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return NextResponse.next();
    }

    const userAgent = request.headers.get("user-agent") || "";

    // 2. Bloquer immédiatement les mauvais bots (coût CPU quasi-nul)
    if (badBotRegex.test(userAgent)) {
        return new NextResponse(null, { status: 403 });
    }

    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // 3. Si c'est un bot classique, on évite Negotiator (très gourmand en CPU)
        if (goodBotRegex.test(userAgent)) {
            return NextResponse.redirect(
                new URL(
                    `/${i18n.defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                    request.url
                )
            );
        }

        const locale = getLocale(request);

        // Redirect to the same path with locale
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    // Matcher excluding API, static files, images, and bot probes (wp-admin)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|wp-admin|wp-login|.*\\..*).*)'],
};
