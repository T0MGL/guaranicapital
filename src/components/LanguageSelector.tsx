import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

const languages: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇵🇹' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
};

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

export const LanguageSelector = ({ isScrolled = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const currentLanguage = languages[language];

  return (
    <div className="language-selector" ref={selectorRef}>
      <motion.button
        className={`language-button ${isScrolled ? 'scrolled' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flag">{currentLanguage.flag}</span>
        <span className="language-code">{language.toUpperCase()}</span>
        <motion.span
          className="chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="language-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(languages).map(([code, { name, flag }]) => (
              <motion.button
                key={code}
                className={`language-option ${language === code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(code as Language)}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flag">{flag}</span>
                <span className="language-name">{name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .language-selector {
          position: relative;
          display: flex;
          align-items: center;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .language-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .language-button.scrolled {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: var(--color-text-primary);
        }

        .language-button.scrolled:hover {
          background: rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 0, 0, 0.15);
        }

        .flag {
          font-size: 1.125rem;
          line-height: 1;
        }

        .language-code {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .chevron {
          font-size: 0.625rem;
          display: inline-block;
          margin-left: 0.125rem;
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 180px;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 1000;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.875rem 1rem;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-body);
        }

        .language-option:not(:last-child) {
          border-bottom: 1px solid var(--color-border);
        }

        .language-option.active {
          background: rgba(0, 0, 0, 0.03);
          font-weight: 600;
        }

        .language-option .language-name {
          color: var(--color-text-primary);
          font-size: 0.9375rem;
        }

        .language-option:hover .language-name {
          color: var(--color-primary);
        }

        @media (max-width: 767px) {
          .language-button {
            padding: 0.4rem 0.6rem;
            gap: 0.375rem;
          }

          .language-code {
            display: none;
          }

          .flag {
            font-size: 1.25rem;
          }

          .language-dropdown {
            min-width: 160px;
          }
        }
      `}</style>
    </div>
  );
};
