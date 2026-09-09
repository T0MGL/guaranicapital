import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

/* React escapes the text child of <script> and <style> exactly as it escapes
   body copy, so both have to be handed over verbatim. For JSON-LD only "<"
   matters: it is the sequence that could close the tag early, and \u003c is
   valid inside a JSON string, so the payload a parser sees is unchanged. */
const escapeForScript = (json: string) => json.replace(/</g, '\\u003c');

const FAQ_CSS = {
  __html: `
        .faq {
          padding: var(--space-3xl) var(--space-lg);
          background: linear-gradient(
            180deg,
            var(--color-base-white) 0%,
            var(--color-gray-50) 50%,
            var(--color-base-white) 100%
          );
        }

        .faq-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .faq-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--space-2xl);
        }

        .faq-list {
          max-width: 820px;
          margin: 0 auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .faq-item + .faq-item {
          border-top: 1px solid var(--color-border);
        }

        .faq-question-heading {
          margin: 0;
          font-size: inherit;
          font-weight: inherit;
        }

        .faq-question {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-md);
          width: 100%;
          padding: var(--space-md) var(--space-lg);
          min-height: 56px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 500;
          line-height: 1.5;
          color: var(--color-text-primary);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .faq-question:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: -3px;
        }

        .faq-question[aria-expanded='true'] {
          color: var(--color-primary);
        }

        @media (hover: hover) and (pointer: fine) {
          .faq-question:hover {
            background: var(--color-gray-50);
          }
        }

        .faq-question:active {
          background: var(--color-gray-100);
        }

        .faq-question-text {
          flex: 1;
        }

        .faq-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 24px;
          height: 1.5em;
          color: var(--color-text-tertiary);
        }

        .faq-question[aria-expanded='true'] .faq-chevron {
          color: var(--color-primary);
        }

        .faq-panel {
          overflow: hidden;
        }

        .faq-answer {
          max-width: 68ch;
          padding: 0 var(--space-lg) var(--space-lg);
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        @media (max-width: 768px) {
          .faq {
            padding: var(--space-2xl) var(--space-md);
          }

          .faq-header {
            margin-bottom: var(--space-xl);
          }

          .faq-question {
            padding: var(--space-md);
            font-size: 1.0625rem;
            gap: var(--space-sm);
          }

          .faq-answer {
            padding: 0 var(--space-md) var(--space-md);
            font-size: 1rem;
          }
        }

        @media (max-width: 375px) {
          .faq {
            padding: var(--space-xl) var(--space-sm);
          }

          .faq-list {
            border-radius: var(--radius-md);
          }

          .faq-question {
            font-size: 1rem;
          }
        }
      `,
};

const chevron = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FAQ = () => {
  const { t, language } = useLanguage();
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const items = t.faq.items;

  /* Structured data for crawlers and answer engines, not for rich results:
     Google restricted FAQPage snippets to government and health sites in 2023.
     Built during render rather than appended to document.head from an effect,
     because appending only happens in a browser: the three prerendered files
     would have shipped without it, which is the one place a crawler reads. */
  const faqSchema = escapeForScript(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: language,
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    })
  );

  const toggle = (index: number) => {
    setOpenItems((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index]
    );
  };

  return (
    <section id="faq" className="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <div className="faq-container">
        <motion.div
          ref={headerRef}
          className="faq-header"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label">{t.faq.label}</div>
          <h2 className="section-title">
            {t.faq.title.line1}{' '}
            <span className="title-br"><br /></span>
            {t.faq.title.line2}
          </h2>
          <p className="section-subtitle">{t.faq.subtitle}</p>
        </motion.div>

        <div className="faq-list">
          {items.map((item, index) => {
            const isOpen = openItems.includes(index);
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-question-${index}`;

            return (
              <div className="faq-item" key={item.question}>
                <h3 className="faq-question-heading">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <motion.span
                      className="faq-chevron"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.26, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {chevron}
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={panelId}
                      className="faq-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.26,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <p className="faq-answer">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={FAQ_CSS} />
    </section>
  );
};
