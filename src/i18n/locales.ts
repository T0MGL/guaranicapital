/*
  The URL scheme and the per language head metadata, in one place.

  Spanish owns the root. `https://www.guaranicapital.com/` is the indexed,
  canonical URL for the property and Paraguay is the primary market, so moving
  it to /es/ would 301 the highest authority URL on the site for no ranking
  gain. English and Portuguese live under a prefix.

  Everything a crawler reads is absolute on the www host. The apex is served by
  Hostinger, not by us, and it 301s to https://www.guaranicapital.com with the
  path thrown away, so a relative canonical or hreflang resolved from there
  would point at the wrong document. Verified 2026-09-09: `server: hcdn`.
*/

export type Language = 'es' | 'en' | 'pt';

export const LANGUAGES: readonly Language[] = ['es', 'en', 'pt'];

export const DEFAULT_LANGUAGE: Language = 'es';

export const SITE_ORIGIN = 'https://www.guaranicapital.com';

export const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);

/* What react-router mounts under. The default language has no prefix, so its
   basename is the root and every route path stays as authored. */
export const basePath = (language: Language) =>
  language === DEFAULT_LANGUAGE ? '/' : `/${language}`;

/* The document URL for a path already resolved against the router basename.
   `/` keeps its trailing slash so /en/ and / are the same shape as the
   canonical, the sitemap and the hreflang set. */
export const pathFor = (language: Language, routePath = '/') => {
  const base = language === DEFAULT_LANGUAGE ? '' : `/${language}`;
  /* The switcher builds its hrefs from the current pathname, which the visitor
     controls. Two leading slashes make a protocol relative URL, so
     guaranicapital.com//evil.com would turn the Spanish option into a link off
     the site. Collapsing runs of slashes is what stops that being a question. */
  const path = routePath.replace(/\/{2,}/g, '/');
  return path === '/' ? `${base}/` : `${base}${path}`;
};

/* The inverse of pathFor: the route a document URL resolves to once its
   language prefix is removed. /en/crm and /crm are both the /crm route. */
export const routePath = (language: Language, pathname: string) => {
  const base = language === DEFAULT_LANGUAGE ? '' : `/${language}`;
  const rest = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return rest.replace(/\/+$/, '') || '/';
};

export const urlFor = (language: Language, routePath = '/') =>
  `${SITE_ORIGIN}${pathFor(language, routePath)}`;

/* The language a request path belongs to. Anything without a known prefix is
   the default, which is what makes / Spanish. Used by the dev server. */
export const languageForPath = (pathname: string): Language => {
  const first = pathname.split('/')[1];
  return isLanguage(first) && first !== DEFAULT_LANGUAGE ? first : DEFAULT_LANGUAGE;
};

interface LanguageMeta {
  /* BCP 47 value for <html lang> and the hreflang set. Kept to the bare
     language: the alternates are one per language, not one per region. */
  readonly htmlLang: Language;
  readonly ogLocale: string;
  readonly title: string;
  readonly description: string;
  /* Twitter truncates around 200 characters and the card shows no more than
     two lines, so the long tail of the meta description is dead weight there. */
  readonly twitterDescription: string;
  readonly imageAlt: string;
}

export const meta: Record<Language, LanguageMeta> = {
  es: {
    htmlLang: 'es',
    ogLocale: 'es_PY',
    title: 'Guaraní Capital · Gestión profesional de Airbnb en Paraguay',
    description:
      'Gestión integral de Airbnb en Paraguay. Soporte 24/7 y +100 propiedades activas en Asunción. Convertí tu propiedad en ingreso pasivo sin tener que hacer nada.',
    twitterDescription:
      'Gestión integral de Airbnb en Paraguay. Soporte 24/7 y +100 propiedades activas en Asunción.',
    imageAlt: 'Departamento en Asunción gestionado por Guaraní Capital en Airbnb',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Guaraní Capital · Airbnb Property Management in Paraguay',
    description:
      'Full service Airbnb management in Paraguay. 24/7 guest support and 100+ active listings in Asunción. Turn your apartment into passive income without lifting a finger.',
    twitterDescription:
      'Full service Airbnb management in Paraguay. 24/7 guest support and 100+ active listings in Asunción.',
    imageAlt: 'Apartment in Asunción managed by Guaraní Capital on Airbnb',
  },
  pt: {
    htmlLang: 'pt',
    ogLocale: 'pt_BR',
    title: 'Guaraní Capital · Gestão de Airbnb no Paraguai',
    description:
      'Gestão completa de Airbnb no Paraguai. Atendimento 24/7 e mais de 100 imóveis ativos em Assunção. Seu imóvel virando renda passiva sem você precisar fazer nada.',
    twitterDescription:
      'Gestão completa de Airbnb no Paraguai. Atendimento 24/7 e mais de 100 imóveis ativos em Assunção.',
    imageAlt: 'Apartamento em Assunção gerenciado pela Guaraní Capital no Airbnb',
  },
};

/* Staff route: a lead pipeline holding names and phone numbers. Listed here so
   robots.txt and the sitemap cannot fall out of step. The noindex headers are
   hand written in vercel.json and do not read this, so a route added here needs
   an entry added there too. */
export const PRIVATE_ROUTES = ['/crm'] as const;
