import { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { pathFor, type Language } from '../i18n/locales';

/*
  Each option is a real link to that language's URL, not a state setter. The
  language lives in the URL and in the document it serves, so switching is a
  navigation: it is crawlable, it can be middle clicked or copied, and back and
  forward move between languages the way a visitor expects. A setter here would
  have put the app back in the state where the address bar and the copy on
  screen could disagree.

  The hrefs are relative on purpose. They have to keep working on localhost and
  on preview deployments, and a same origin link never reaches the apex, which
  is served by Hostinger and 301s every path to the www root.
*/

const languages: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇧🇷' },
};

/* Object.keys drops the key type, but the record above is Record<Language, ...>
   so it is exhaustive by construction: a new language cannot be added to the
   site without appearing here, and the declaration order is the display order. */
const ORDER = Object.keys(languages) as Language[];

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

export const LanguageSelector = ({ isScrolled = false }: LanguageSelectorProps) => {
  const { language, t } = useLanguage();
  const { pathname, search, hash } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /* The navbar mounts this twice, once in the actions row and once inside the
     mobile menu, so a literal id would put two of them in the document and
     point both triggers at the same dropdown. */
  const dropdownId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      // Closing while focus is on an option would otherwise drop the keyboard
      // user at the top of the document.
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentLanguage = languages[language];

  // useLocation strips the router basename, so this is the same route in
  // whichever language, not a path that already carries a prefix.
  const hrefFor = (target: Language) => `${pathFor(target, pathname)}${search}${hash}`;

  return (
    <div className="language-selector" ref={selectorRef}>
      <motion.button
        ref={triggerRef}
        type="button"
        className={`language-button ${isScrolled ? 'scrolled' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-label={`${t.navbar.language}: ${currentLanguage.name}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flag" aria-hidden="true">{currentLanguage.flag}</span>
        <span className="language-code">{language.toUpperCase()}</span>
        <motion.span
          className="chevron"
          aria-hidden="true"
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
            id={dropdownId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {ORDER.map((code) => (
              <motion.a
                key={code}
                href={hrefFor(code)}
                hrefLang={code}
                lang={code}
                rel="alternate"
                aria-current={language === code ? 'page' : undefined}
                className={`language-option ${language === code ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flag" aria-hidden="true">{languages[code].flag}</span>
                <span className="language-name">{languages[code].name}</span>
              </motion.a>
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
          text-decoration: none;
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

        .language-option:focus-visible {
          /* Inset instead of outward outline: the dropdown clips at its own
             rounded corners (overflow: hidden), so an outward ring gets cut
             off on every side for a full-width option. */
          outline: none;
          box-shadow: inset 0 0 0 2px var(--color-primary-dark);
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
