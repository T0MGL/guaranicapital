import { createContext, useContext, useMemo, ReactNode } from 'react';
import { translations } from '../i18n/translations';
import { DEFAULT_LANGUAGE, isLanguage, type Language } from '../i18n/locales';

/*
  The language is decided by the URL and baked into the document that URL
  serves. This provider reads it and hands it down; it never picks one.

  There is deliberately no setter, no localStorage and no navigator.language.
  Each of those was a second opinion about what language the visitor is
  reading, and every one of them could win over an explicit /en/ request: a
  link to the English site opened in Spanish for anyone whose device had ever
  used the old switcher. The URL is the state, so switching language is a
  navigation (see LanguageSelector), and the document that comes back is the
  only thing that decides.
*/

interface LanguageContextType {
  language: Language;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/* <html lang> is written by the build, one document per language, so it is
   readable on the very first client render and cannot disagree with the copy
   that is already painted. */
export const documentLanguage = (): Language => {
  const declared = document.documentElement.lang;
  return isLanguage(declared) ? declared : DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) => {
  const value = useMemo(() => ({ language, t: translations[language] }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
