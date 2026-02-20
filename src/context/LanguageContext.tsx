import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED: Language[] = ['en', 'es', 'pt', 'de'];

function detectLanguage(): Language {
  const saved = localStorage.getItem('language');
  if (saved && SUPPORTED.includes(saved as Language)) {
    return saved as Language;
  }
  // Fall back to browser language on first visit
  const browserLang = (navigator.language || '').split('-')[0].toLowerCase();
  if (browserLang === 'es') return 'es';
  if (browserLang === 'pt') return 'pt';
  if (browserLang === 'de') return 'de';
  return 'en';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
