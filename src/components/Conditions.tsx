import { useLanguage } from '../context/LanguageContext';

/* React escapes the text child of <style> the same way it escapes body copy,
   and scripts/prerender.mjs fails the build when it finds an entity in one.
   Handing the CSS over verbatim is the fix the prerender comment prescribes. */
const CONDITIONS_CSS = {
  __html: `
        .conditions {
          padding: var(--space-3xl) var(--space-lg);
          background: var(--color-gray-50);
        }

        .conditions-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .conditions-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--space-2xl);
        }

        /* One sheet, two terms, a rule between them. The page already spends
           three sections on card grids, so the money reads as a document. */
        .conditions-panel {
          max-width: 900px;
          margin: 0 auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .conditions-term {
          display: grid;
          gap: var(--space-sm);
          padding: var(--space-xl) var(--space-lg);
        }

        .term-body {
          display: grid;
          gap: var(--space-sm);
        }

        .conditions-term + .conditions-term {
          border-top: 1px solid var(--color-border);
        }

        /* The number is the section. Tabular figures so 15% and USD 150 sit on
           the same left edge instead of drifting by a glyph width. */
        .term-amount {
          font-family: var(--font-display);
          font-size: clamp(2.75rem, 10vw, 3.75rem);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--color-primary);
          font-variant-numeric: tabular-nums;
        }

        .term-basis {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 500;
          line-height: 1.45;
          color: var(--color-text-primary);
          text-wrap: balance;
        }

        .term-detail {
          max-width: 62ch;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        .term-includes {
          display: grid;
          gap: var(--space-xs);
          margin-top: var(--space-xs);
          list-style: none;
        }

        .term-includes li {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
        }

        .conditions-notes {
          display: grid;
          gap: var(--space-lg);
          max-width: 900px;
          margin: var(--space-xl) auto 0;
        }

        .note-title {
          font-family: var(--font-display);
          font-size: 1.0625rem;
          font-weight: 600;
          line-height: 1.4;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xs);
        }

        .note-body {
          max-width: 52ch;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        @media (min-width: 768px) {
          .conditions-term {
            grid-template-columns: minmax(0, 210px) minmax(0, 1fr);
            align-items: start;
            column-gap: var(--space-xl);
            padding: var(--space-2xl);
          }

          .term-includes {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--space-lg);
            row-gap: var(--space-sm);
          }

          .conditions-notes {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--space-2xl);
          }

          .conditions-note + .conditions-note {
            padding-left: var(--space-2xl);
            border-left: 1px solid var(--color-border);
          }
        }

        /* Scroll driven rather than mounted from JavaScript, so the copy is
           painted by the prerendered HTML with no inline opacity on it: a
           crawler, a reader with JavaScript off, and a browser without this
           feature all get the finished section, and Chromium gets the settle.
           Runs off the main thread, which is where Lenis already is. */
        @keyframes conditions-settle {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          @supports (animation-timeline: view()) {
            .conditions-panel,
            .conditions-notes {
              animation: conditions-settle 1s var(--ease-entrance) both;
              animation-timeline: view();
              animation-range: entry 5% cover 25%;
            }

            .conditions-notes {
              animation-range: entry 5% cover 32%;
            }
          }
        }

        @media (max-width: 767px) {
          .conditions {
            padding: var(--space-2xl) var(--space-md);
          }

          .conditions-header {
            margin-bottom: var(--space-xl);
          }

          .conditions-term {
            padding: var(--space-lg) var(--space-md);
          }
        }

        @media (max-width: 375px) {
          .conditions {
            padding: var(--space-xl) var(--space-sm);
          }

          .conditions-panel {
            border-radius: var(--radius-md);
          }
        }
      `,
};

export const Conditions = () => {
  const { t } = useLanguage();
  const { commission, setup } = t.conditions.terms;

  return (
    <section id="conditions" className="conditions">
      <div className="conditions-container">
        <div className="conditions-header">
          <div className="section-label">{t.conditions.label}</div>
          <h2 className="section-title">
            {t.conditions.title.line1}{' '}
            <span className="title-br"><br /></span>
            {t.conditions.title.line2}
          </h2>
          <p className="section-subtitle">{t.conditions.subtitle}</p>
        </div>

        <div className="conditions-panel">
          <div className="conditions-term">
            <p className="term-amount">{commission.amount}</p>
            <div className="term-body">
              <p className="term-basis">{commission.basis}</p>
              <p className="term-detail">{commission.detail}</p>
            </div>
          </div>

          <div className="conditions-term">
            <p className="term-amount">{setup.amount}</p>
            <div className="term-body">
              <p className="term-basis">{setup.basis}</p>
              <p className="term-detail">{setup.detail}</p>
              <ul className="term-includes">
                {setup.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* The worked example belongs here, between the terms and the notes:
            a reader who has just been told "15% of net billing" wants to see
            one month of it in guaraníes. It is not written because what the
            net excludes is not defined yet, and inventing that number would
            put a figure on the page the settlement cannot honour. */}

        <div className="conditions-notes">
          {t.conditions.notes.map((note) => (
            <div className="conditions-note" key={note.title}>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-body">{note.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={CONDITIONS_CSS} />
    </section>
  );
};
