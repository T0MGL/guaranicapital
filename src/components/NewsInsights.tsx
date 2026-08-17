import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { scrollToSection } from '../hooks/useLenis';

const newsArticlesMeta = [
  {
    url: 'https://www.forbes.com.py/macroeconomia/paraguay-logra-su-segundo-grado-inversion-n83509',
    image: 'https://statics.forbes.com.py/2025/12/crop/694317fc3b312__980x549.webp',
  },
  {
    url: 'https://www.forbes.com.py/macroeconomia/paraguay-plena-construccion-real-estate-ha-convertido-nueva-fuerza-economica-pais-n82470',
    image: 'https://statics.forbes.com.py/2025/11/crop/69285acb7a69c__1366x766.webp',
  },
  {
    url: 'https://www.elinmobiliario.com.py/en/post/the-rise-of-foreigners-in-paraguay-what-real-estate-solutions-are-they-seeking',
    image: 'https://static.wixstatic.com/media/66d91e_fc73fb6e59564b66b328f767b187f49c~mv2.jpg/v1/fill/w_970,h_646,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/66d91e_fc73fb6e59564b66b328f767b187f49c~mv2.jpg',
  },
];

export const NewsInsights = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const advisoryRef = useRef(null);
  const advisoryInView = useInView(advisoryRef, { once: true, amount: 0.3 });

  const scrollToContact = () => {
    const target =
      document.getElementById('contact-form') ?? document.getElementById('contact');
    if (!target) return;
    // Center the form selection cards instead of landing on the heading (same as Hero).
    const rect = target.getBoundingClientRect();
    const centerOffset = Math.round((window.innerHeight - rect.height) / 2) * -1;
    scrollToSection(target, centerOffset);
  };

  return (
    <section id="news" className="news-insights">
      <div className="news-container">
        <motion.div
          ref={ref}
          className="news-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label">{t.news.label}</div>
          <h2 className="news-country-title">
            <span className="news-country-word">
              {t.news.titleCountry}
              <svg className="country-underline" viewBox="0 0 260 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 9 Q65 3 130 9 Q195 15 256 9" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="news-tagline">{t.news.titleTagline}</p>
        </motion.div>

        <div className="news-articles">
          {newsArticlesMeta.map((meta, index) => (
            <ArticleEmbed
              key={index}
              description={t.news.articles[index].description}
              url={meta.url}
              image={meta.image}
              readMore={t.news.readMore}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          ref={advisoryRef}
          className="advisory-panel"
          initial={{ opacity: 0, y: 30 }}
          animate={advisoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="advisory-copy">
            <h3 className="advisory-title">{t.news.advisory.title}</h3>
            <p className="advisory-lead">{t.news.advisory.lead}</p>
            <p className="advisory-body">{t.news.advisory.body}</p>
          </div>
          <div className="advisory-cta">
            <p className="advisory-cta-text">{t.news.advisory.ctaText}</p>
            <button type="button" className="advisory-button" onClick={scrollToContact}>
              {t.news.advisory.button}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .news-insights {
          padding: var(--space-3xl) var(--space-lg);
          background: var(--color-base-white);
        }

        .news-container {
          max-width: 1600px;
          margin: 0 auto;
        }

        .news-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--space-2xl);
        }

        .news-country-title {
          font-family: var(--font-display);
          font-size: clamp(3.5rem, 10vw, 7rem);
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1;
          margin-bottom: var(--space-md);
        }

        .news-country-word {
          position: relative;
          display: inline-block;
        }

        .country-underline {
          position: absolute;
          bottom: -0.15em;
          left: -2%;
          width: 104%;
          height: auto;
          color: var(--color-primary);
          pointer-events: none;
        }

        .news-tagline {
          font-family: var(--font-display);
          font-size: clamp(1.375rem, 3.5vw, 2.25rem);
          font-weight: 500;
          color: var(--color-text-secondary);
          line-height: 1.3;
          margin-top: var(--space-lg);
        }

        .news-articles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
        }

        /* Investment advisory */
        .advisory-panel {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
          max-width: 1120px;
          margin: var(--space-3xl) auto 0;
          padding: clamp(1.75rem, 4vw, 3rem);
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          box-shadow: var(--shadow-xl);
        }

        .advisory-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.8vw, 2.25rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 var(--space-sm);
        }

        .advisory-lead {
          font-family: var(--font-body);
          font-size: 1.0625rem;
          line-height: 1.7;
          margin: 0 0 var(--space-sm);
          opacity: 0.95;
        }

        .advisory-body {
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.7;
          margin: 0;
          opacity: 0.8;
        }

        .advisory-cta {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          padding: clamp(1.25rem, 2.5vw, 1.75rem);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }

        .advisory-cta-text {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.6;
          margin: 0;
          opacity: 0.9;
        }

        .advisory-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.85rem 1.8rem;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-primary-dark);
          background: #ffffff;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: box-shadow var(--transition-base), transform var(--transition-base);
          width: fit-content;
        }

        .advisory-button svg {
          transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .advisory-button:hover {
          box-shadow: 0 8px 24px rgba(26, 37, 47, 0.28);
          transform: translateY(-1px);
        }

        .advisory-button:hover svg {
          transform: translateX(3px);
        }

        .advisory-button:active {
          transform: translateY(0) scale(0.98);
        }

        .advisory-button:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 3px;
        }

        @media (max-width: 1200px) {
          .news-articles {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }
        }

        @media (max-width: 900px) {
          .advisory-panel {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
            margin-top: var(--space-2xl);
          }

          .advisory-button {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .news-insights {
            padding: var(--space-2xl) var(--space-md);
          }

          .news-header {
            margin-bottom: var(--space-xl);
          }

          .section-label {
            font-size: 0.8125rem;
          }

          .news-tagline {
            margin-top: var(--space-md);
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .news-insights {
            padding: var(--space-xl) var(--space-sm);
          }

          .news-header {
            margin-bottom: var(--space-lg);
          }

          .news-articles {
            gap: var(--space-lg);
          }
        }
      `}</style>
    </section>
  );
};

const ArticleEmbed = ({
  description,
  url,
  image,
  readMore,
  index,
  isInView,
}: {
  description: string;
  url: string;
  image: string;
  readMore: string;
  index: number;
  isInView: boolean;
}) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
    >
      <div className="article-image">
        <img src={image} alt="Article preview" />
      </div>
      <div className="card-content">
        <p className="article-description">{description}</p>
        <div className="read-more">
          {readMore}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <style>{`
        .article-card {
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .article-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }

        .article-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: var(--color-gray-50);
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .article-card:hover .article-image img {
          transform: scale(1.05);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          padding: var(--space-xl);
          flex: 1;
        }

        .article-description {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin-bottom: auto;
          flex: 1;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-primary);
          border-top: 1px solid var(--color-border);
        }

        @media (max-width: 768px) {
          .article-image {
            height: 180px;
          }

          .card-content {
            padding: var(--space-lg);
          }

          .article-description {
            font-size: 0.9375rem;
            line-height: 1.65;
          }

          .read-more {
            font-size: 0.875rem;
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .article-image {
            height: 160px;
          }

          .card-content {
            padding: var(--space-md);
          }

          .article-description {
            font-size: 0.875rem;
          }

          .read-more {
            margin-top: var(--space-md);
            padding-top: var(--space-sm);
          }
        }
      `}</style>
    </motion.a>
  );
};
