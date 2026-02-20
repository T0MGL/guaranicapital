import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

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

        @media (max-width: 1200px) {
          .news-articles {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
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
