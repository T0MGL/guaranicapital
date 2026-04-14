import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FounderMeta {
  id: 'daniel' | 'nicole';
  name: string;
  image: string;
}

const foundersMeta: FounderMeta[] = [
  { id: 'daniel', name: 'Daniel Reese', image: '/team/dani.webp' },
  { id: 'nicole', name: 'Sehia Nicole', image: '/team/nicole.webp' },
];

export const TeamSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="team" className="team-section">
      <div className="team-container">
        <motion.div
          ref={ref}
          className="team-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">{t.team.label}</div>
          <h2 className="section-title">
            {t.team.title.line1}{' '}
            <span className="title-br">
              <br />
            </span>
            {t.team.title.line2}
          </h2>
          <p className="section-subtitle">{t.team.subtitle}</p>
        </motion.div>

        <div className="founders-grid">
          {foundersMeta.map((f, i) => (
            <motion.article
              key={f.id}
              className="founder-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.75, delay: 0.15 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="founder-image-wrapper">
                <img
                  src={f.image}
                  alt={`${f.name}, ${t.team.founders[i].role}, Guaraní Capital`}
                  className="founder-image"
                  loading="lazy"
                  width={1600}
                  height={2399}
                />
                <span className="founder-badge" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <div className="founder-info">
                <p className="founder-role">{t.team.founders[i].role}</p>
                <h3 className="founder-name">{f.name}</h3>
                <div className="founder-rule" aria-hidden="true" />
                <p className="founder-bio">{t.team.founders[i].bio}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.aside
          className="team-statement"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="statement-image-wrapper">
            <img
              src="/team/ambos.webp"
              alt="Daniel Reese y Sehia Nicole, founding partners de Guaraní Capital"
              className="statement-image"
              loading="lazy"
              width={1600}
              height={2399}
            />
          </div>
          <div className="statement-copy">
            <p className="statement-eyebrow">{t.team.statement.eyebrow}</p>
            <p className="statement-title">{t.team.statement.title}</p>
            <p className="statement-body">{t.team.statement.body}</p>
            <p className="statement-meta">{t.team.statement.meta}</p>
          </div>
        </motion.aside>
      </div>

      <style>{`
        .team-section {
          padding: var(--space-3xl) var(--space-lg);
          background: var(--color-base-white);
          overflow: hidden;
        }

        .team-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .team-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto var(--space-3xl);
        }

        .founders-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(2rem, 4vw, 4rem);
          margin-bottom: var(--space-3xl);
          max-width: 880px;
          margin-inline: auto;
        }

        .founder-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .founder-image-wrapper {
          position: relative;
          aspect-ratio: 2 / 3;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-gray-100);
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .founder-card:hover .founder-image-wrapper {
          box-shadow: var(--shadow-lg);
        }

        .founder-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .founder-card:hover .founder-image {
          transform: scale(1.04);
        }

        .founder-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-text-primary);
        }

        .founder-info {
          padding: 0 2px;
        }

        .founder-role {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin: 0 0 10px;
        }

        .founder-name {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.4vw, 1.875rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--color-text-primary);
          margin: 0;
        }

        .founder-rule {
          width: 40px;
          height: 2px;
          background: var(--color-text-primary);
          margin: 18px 0 18px;
          opacity: 0.9;
        }

        .founder-bio {
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
          margin: 0;
          max-width: 42ch;
        }

        /* Closing statement block */
        .team-statement {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
          padding: clamp(1.75rem, 4vw, 3rem);
          border-radius: var(--radius-lg);
          background: var(--color-gray-50);
          border: 1px solid var(--color-border);
        }

        .statement-image-wrapper {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-gray-100);
        }

        .statement-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .statement-copy {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .statement-eyebrow {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin: 0;
        }

        .statement-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.6vw, 2.125rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: var(--color-text-primary);
          margin: 0;
        }

        .statement-body {
          font-family: var(--font-body);
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
          margin: 0;
          max-width: 52ch;
        }

        .statement-meta {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          margin: 10px 0 0;
        }

        @media (max-width: 900px) {
          .founders-grid {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
            max-width: 420px;
          }

          .team-statement {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }

          .statement-image-wrapper {
            aspect-ratio: 3 / 4;
            max-width: 360px;
            width: 100%;
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .team-section {
            padding: var(--space-2xl) var(--space-md);
          }

          .team-header {
            margin-bottom: var(--space-2xl);
          }

          .founders-grid {
            margin-bottom: var(--space-2xl);
          }

          .founder-badge {
            top: 12px;
            left: 12px;
            padding: 5px 10px;
            font-size: 0.625rem;
          }

          .founder-rule {
            margin: 14px 0;
          }
        }
      `}</style>
    </section>
  );
};
