/*
  Every document the build emits: the three HTML files, the sitemap and
  robots.txt. One module so the canonical, the hreflang set, the sitemap and
  the switcher can never disagree about a URL.

  The three HTML files are the same index.html with four regions swapped:
  <html lang>, the head metadata block, the static hero copy, and #root. The
  dev server runs the same swap per request (see the localeDocuments plugin in
  vite.config.ts), so a language reads the same in dev as it ships.
*/

import heroCopy from './hero.json';
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  PRIVATE_ROUTES,
  SITE_ORIGIN,
  type Language,
  meta,
  pathFor,
  urlFor,
} from './locales';

const SEO_START = '<!--seo:start-->';
const SEO_END = '<!--seo:end-->';
const HERO_START = '<!--hero:start-->';
const HERO_END = '<!--hero:end-->';
const ROOT_TAG = '<div id="root"></div>';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Replaces the region between two markers, exclusive. Throws rather than
   returning the input untouched: a marker that silently stopped matching would
   ship a Spanish head on the English document, which is the exact failure this
   module exists to prevent. */
const replaceRegion = (html: string, start: string, end: string, replacement: string) => {
  const from = html.indexOf(start);
  const to = html.indexOf(end);
  if (from === -1 || to === -1 || to < from) {
    throw new Error(`index.html is missing the ${start} ... ${end} region`);
  }
  return html.slice(0, from + start.length) + replacement + html.slice(to);
};

/* Reciprocal on all three documents: each one lists every language plus
   x-default on the Spanish root, which is what tells Google these are the same
   page in different languages rather than three thin pages. */
const alternates = (routePath: string) =>
  [
    ...LANGUAGES.map(
      (language) =>
        `<link rel="alternate" hreflang="${language}" href="${urlFor(language, routePath)}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANGUAGE, routePath)}" />`,
  ].join('\n    ');

export const headHtml = (language: Language, routePath = '/') => {
  const m = meta[language];
  const url = urlFor(language, routePath);
  const image = `${SITE_ORIGIN}/og-image.jpg`;
  const title = escapeHtml(m.title);
  const description = escapeHtml(m.description);
  const imageAlt = escapeHtml(m.imageAlt);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />

    <link rel="canonical" href="${url}" />
    ${alternates(routePath)}

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="Guaraní Capital" />
    <meta property="og:locale" content="${m.ogLocale}" />
    ${LANGUAGES.filter((other) => other !== language)
      .map((other) => `<meta property="og:locale:alternate" content="${meta[other].ogLocale}" />`)
      .join('\n    ')}
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${escapeHtml(m.twitterDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />
  `;
};

/* Matches an element carrying a copy key together with the text node that
   follows its opening tag, which is the same node the inline boot script
   rewrites at runtime. Both paths have to agree, so the shape is asserted at
   build time by assertHeroBootIsWired in vite.config.ts. */
const HERO_SLOT = /(<[a-z]+\b[^>]*\bdata-hb(-stat)?="([^"]+)"[^>]*>)([^<]*)/g;

const resolve = (source: unknown, path: string) => {
  const value = path
    .split('.')
    .reduce<unknown>((current, key) => (current as Record<string, unknown> | undefined)?.[key], source);
  return typeof value === 'string' ? value : null;
};

/* The static hero ships baked in Spanish. This produces the same markup with
   the other language's copy, so the served HTML of /en/ and /pt/ carries no
   Spanish at all and needs no JavaScript to become correct. */
export const localiseHero = (markup: string, language: Language) => {
  const copy = heroCopy[language];

  return markup.replace(HERO_SLOT, (_match, openTag: string, _stat, path: string, text: string) => {
    const value = resolve(copy, path);
    if (value === null) throw new Error(`hero.json ${language} has no string at "${path}"`);
    if (text.trim().length === 0) {
      throw new Error(`hero-boot.html has no text to localise on "${path}"`);
    }
    /* The primary CTA carries an arrow after its label, so the label keeps the
       space that separates it from the icon. */
    const spaced = openTag.includes('data-hb-intent') ? `${escapeHtml(value)} ` : escapeHtml(value);
    return `${openTag}${spaced}`;
  });
};

export const localeDocument = (
  html: string,
  language: Language,
  appHtml = '',
  routePath = '/',
) => {
  const lang = html.match(/<html lang="([^"]*)"/);
  if (!lang) throw new Error('index.html is missing <html lang="...">');

  let out = html.replace(lang[0], `<html lang="${meta[language].htmlLang}"`);
  out = replaceRegion(out, SEO_START, SEO_END, headHtml(language));

  const heroFrom = out.indexOf(HERO_START);
  const heroTo = out.indexOf(HERO_END);
  if (heroFrom === -1 || heroTo === -1) throw new Error('index.html is missing the hero region');
  const hero = out.slice(heroFrom + HERO_START.length, heroTo);
  out = replaceRegion(out, HERO_START, HERO_END, localiseHero(hero, language));

  if (appHtml) {
    if (!out.includes(ROOT_TAG)) throw new Error(`index.html is missing ${ROOT_TAG}`);
    /* Which route this markup is. Only the landing page is prerendered, so a
       deep link like /en/crm is served this document and the client has to
       render from scratch instead of hydrating someone else's page. */
    /* A replacer function, not a string: `$&` and friends inside the rendered
       copy would otherwise be read as substitution patterns. */
    out = out.replace(
      ROOT_TAG,
      () => `<div id="root" data-prerendered="${routePath}">${appHtml}</div>`,
    );
  }

  return out;
};

export const sitemapXml = () => {
  const entries = LANGUAGES.map(
    (language) => `  <url>
    <loc>${urlFor(language)}</loc>
${LANGUAGES.map(
  (other) =>
    `    <xhtml:link rel="alternate" hreflang="${other}" href="${urlFor(other)}" />`,
).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANGUAGE)}" />
  </url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
};

export const robotsTxt = () => {
  const disallow = LANGUAGES.flatMap((language) =>
    PRIVATE_ROUTES.map((route) => `Disallow: ${pathFor(language, route)}`),
  ).join('\n');

  return `User-agent: *
Allow: /
${disallow}

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
};
