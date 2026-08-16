import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const foundersMeta = [
  { id: 'daniel', name: 'Daniel Reese' },
  { id: 'nicole', name: 'Sehia Nicole' },
] as const;

export const TeamSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const whoRef = useRef(null);
  const whoInView = useInView(whoRef, { once: true, amount: 0.25 });

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

        <motion.div
          className="founders-block"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="founders-photo-wrapper">
            <img
              src="/team/ambos.webp"
              alt="Daniel Reese y Sehia Nicole, fundadores de Guaraní Capital"
              className="founders-photo"
              loading="lazy"
              width={1600}
              height={2399}
            />
          </div>

          <div className="founders-copy">
            <p className="statement-title">{t.team.statement.title}</p>
            <p className="statement-body">{t.team.statement.body}</p>

            <div className="founder-entries">
              {foundersMeta.map((f, i) => (
                <article key={f.id} className="founder-entry">
                  <p className="founder-role">{t.team.founders[i].role}</p>
                  <h3 className="founder-name">{f.name}</h3>
                  <p className="founder-bio">{t.team.founders[i].bio}</p>
                </article>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.figure
          ref={whoRef}
          className="team-who"
          initial={{ opacity: 0, y: 30 }}
          animate={whoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src="/team/equipo.webp"
            alt="Equipo de Guaraní Capital recorriendo un edificio residencial en Asunción"
            className="team-who-image"
            loading="lazy"
            width={1920}
            height={1072}
          />
          <figcaption className="team-who-copy">
            <p className="team-who-title">{t.team.who.title}</p>
            <p className="team-who-subtitle">{t.team.who.subtitle}</p>
          </figcaption>
        </motion.figure>
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

        /* Founders: one block, one photo */
        .founders-block {
          display: grid;
          grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.28fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
          max-width: 1120px;
          margin: 0 auto var(--space-3xl);
          padding: clamp(1.75rem, 4vw, 3rem);
          border-radius: var(--radius-lg);
          background: var(--color-gray-50);
          border: 1px solid var(--color-border);
        }

        .founders-photo-wrapper {
          aspect-ratio: 3 / 4;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-gray-100);
        }

        .founders-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 32%;
          display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .founders-block:hover .founders-photo {
          transform: scale(1.03);
        }

        .founders-copy {
          display: flex;
          flex-direction: column;
        }

        .statement-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.6vw, 2.125rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: var(--color-text-primary);
          margin: 0 0 10px;
        }

        .statement-body {
          font-family: var(--font-body);
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
          margin: 0 0 clamp(1.5rem, 3vw, 2.25rem);
          max-width: 52ch;
        }

        .founder-entries {
          display: flex;
          flex-direction: column;
          gap: clamp(1.25rem, 2.5vw, 1.75rem);
        }

        .founder-entry {
          padding-top: clamp(1.25rem, 2.5vw, 1.75rem);
          border-top: 1px solid var(--color-border);
        }

        .founder-role {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin: 0 0 8px;
        }

        .founder-name {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--color-text-primary);
          margin: 0 0 8px;
        }

        .founder-bio {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
          margin: 0;
          max-width: 56ch;
        }

        /* Who we are */
        .team-who {
          position: relative;
          margin: 0 auto;
          max-width: 1120px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-gray-100);
        }

        .team-who-image {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 8;
          object-fit: cover;
          display: block;
        }

        .team-who-copy {
          position: absolute;
          inset: auto 0 0 0;
          padding: clamp(1.5rem, 4vw, 2.75rem);
          background: linear-gradient(
            to top,
            rgba(15, 20, 25, 0.72) 0%,
            rgba(15, 20, 25, 0.35) 55%,
            transparent 100%
          );
        }

        .team-who-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 6px;
        }

        .team-who-subtitle {
          font-family: var(--font-body);
          font-size: clamp(0.9375rem, 1.6vw, 1.125rem);
          font-weight: 400;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        @media (max-width: 900px) {
          .founders-block {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }

          .founders-photo-wrapper {
            aspect-ratio: 4 / 5;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
          }

          .team-who-image {
            aspect-ratio: 4 / 3;
          }
        }

        @media (max-width: 640px) {
          .team-section {
            padding: var(--space-2xl) var(--space-md);
          }

          .team-header {
            margin-bottom: var(--space-2xl);
          }

          .founders-block {
            margin-bottom: var(--space-2xl);
            padding: var(--space-md);
          }

          .founders-photo-wrapper {
            max-width: 100%;
          }

          .team-who-image {
            aspect-ratio: 3 / 4;
          }
        }
      `}</style>
    </section>
  );
};
