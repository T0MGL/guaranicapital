import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider, documentLanguage } from './context/LanguageContext';
import { basePath, routePath } from './i18n/locales';

const container = document.getElementById('root')!;
const language = documentLanguage();

const tree = (
  <React.StrictMode>
    <LanguageProvider language={language}>
      <BrowserRouter basename={basePath(language)}>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);

/* The build prerenders the landing page of each language, and #root says which
   route the markup it holds belongs to. Hydrate only when that matches the
   route being opened. Everything else gets the landing document from the SPA
   rewrite, including /crm, so hydrating there would mean grafting the staff
   page onto a prerendered home page: React would throw the whole tree away
   after painting it, and the visitor would watch the landing page flash past
   on the way to a login. The dev server ships an empty root and lands here
   too. */
if (container.dataset.prerendered === routePath(language, window.location.pathname)) {
  hydrateRoot(container, tree);
} else {
  container.replaceChildren();
  createRoot(container).render(tree);
}
