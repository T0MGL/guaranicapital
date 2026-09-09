import { renderToString } from 'react-dom/server';
/* react-router 7 dropped the /server subpath export; StaticRouter is on the
   main entry now. Only this build time module imports it, so it never reaches
   the browser bundle. */
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { basePath, pathFor, type Language } from './i18n/locales';

/* Build time only. Vite compiles this into an SSR bundle that
   scripts/prerender.mjs runs in Node to produce one real HTML file per
   language, which is what puts the translated body copy in the served
   response instead of behind the bundle. */
export const renderLanguage = (language: Language, routePath = '/') =>
  renderToString(
    <LanguageProvider language={language}>
      <StaticRouter basename={basePath(language)} location={pathFor(language, routePath)}>
        <App />
      </StaticRouter>
    </LanguageProvider>,
  );

/* Re-exported so the prerender driver has a single import and cannot end up
   using a stale copy of the URL scheme. */
export { LANGUAGES, DEFAULT_LANGUAGE, pathFor, urlFor, meta } from './i18n/locales';
export { localeDocument, sitemapXml, robotsTxt } from './i18n/document';
