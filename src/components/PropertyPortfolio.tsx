import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PropertyMeta {
  id: number;
  location: string;
  airbnbUrl: string;
  image: string;
}

export const PropertyPortfolio = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [offset, setOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  const propertiesMeta: PropertyMeta[] = [
    {
      id: 1,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1510892348329587039?guests=1&adults=1&s=67&unique_share_id=af00503d-ccd9-408c-8fd8-92adc2e267ea',
      image: '/airbnb1.webp',
    },
    {
      id: 2,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1596370816314737099?guests=1&adults=1&s=67&unique_share_id=eaa45090-9abf-4aa1-abc8-14d2e65be82d',
      image: '/airbnb2.webp',
    },
    {
      id: 3,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1608807788126038473?guests=1&adults=1&s=67&unique_share_id=09e47746-0165-43cb-8222-e96c5457b426',
      image: '/airbnb3.webp',
    },
    {
      id: 4,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1533698279104413114?guests=1&adults=1&s=67&unique_share_id=917c8005-2155-435e-a1be-67872c5ca045',
      image: '/airbnb4.webp',
    },
    {
      id: 5,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1271130534389738919?guests=1&adults=1&s=67&unique_share_id=f947fd63-5272-4789-9197-26c6182536fe',
      image: '/airbnb5.webp',
    },
  ];

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const N = propertiesMeta.length;
  const maxOffset = Math.max(0, N - visibleCount);

  useEffect(() => {
    setOffset((prev) => Math.min(prev, maxOffset));
  }, [maxOffset]);

  const handleNext = () => setOffset((prev) => Math.min(prev + 1, maxOffset));
  const handlePrev = () => setOffset((prev) => Math.max(prev - 1, 0));

  return (
    <section id="portfolio" className="portfolio">
      <div className="portfolio-container">
        <motion.div
          ref={ref}
          className="portfolio-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">{t.portfolio.label}</div>
          <h2 className="section-title">
            {t.portfolio.title.line1}{' '}
            <span className="title-br"><br /></span>
            {t.portfolio.title.line2}
          </h2>
          <p className="section-subtitle">{t.portfolio.subtitle}</p>
        </motion.div>

        <motion.div
          className="gallery-section"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="gallery-viewport">
            <motion.div
              className="gallery-track"
              animate={{ x: `${-offset * (100 / N)}%` }}
              transition={{ type: 'spring', stiffness: 320, damping: 38, mass: 0.9 }}
              style={{ width: `${(N / visibleCount) * 100}%` }}
            >
              {propertiesMeta.map((prop, index) => (
                <a
                  key={prop.id}
                  href={prop.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-card"
                  style={{ width: `${100 / N}%` }}
                >
                  <div className="card-image-box">
                    <img
                      src={prop.image}
                      alt={t.portfolio.properties[index].name}
                      className="card-img"
                      loading="lazy"
                    />
                    <div className="card-hover-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 17L17 7M17 7H7M17 7v10"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="card-footer">
                    <p className="card-name">{t.portfolio.properties[index].name}</p>
                    <p className="card-location">{prop.location}</p>
                  </div>
                </a>
              ))}
            </motion.div>
          </div>

          <div className="gallery-nav">
            <div className="nav-progress">
              {Array.from({ length: maxOffset + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`progress-pip ${i === offset ? 'active' : ''}`}
                  onClick={() => setOffset(i)}
                  aria-label={`Go to position ${i + 1}`}
                />
              ))}
            </div>
            <div className="nav-arrows">
              <button
                className="nav-arrow"
                onClick={handlePrev}
                disabled={offset === 0}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M5 12l7 7M5 12l7-7"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="nav-arrow"
                onClick={handleNext}
                disabled={offset === maxOffset}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="profile-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <a
            href="https://www.airbnb.co.uk/users/profile/1463908670640126740?previous_page_name=PdpHomeMarketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-button"
          >
            <span className="profile-button-label">{t.portfolio.profileButton}</span>
            <div className="profile-button-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H7M17 7v10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        </motion.div>
      </div>

      <style>{`
        .portfolio {
          padding: var(--space-3xl) var(--space-lg);
          background: var(--color-base-white);
          overflow: hidden;
        }

        .portfolio-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .portfolio-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--space-3xl);
        }

        /* Gallery */
        .gallery-section {
          margin-bottom: var(--space-xl);
        }

        .gallery-viewport {
          overflow: hidden;
        }

        .gallery-track {
          display: flex;
        }

        .gallery-card {
          flex: none;
          padding: 0 10px;
          text-decoration: none;
          color: inherit;
          display: block;
          cursor: pointer;
        }

        .card-image-box {
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 6px;
          background: var(--color-gray-100);
          position: relative;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gallery-card:hover .card-img {
          transform: scale(1.045);
        }

        .card-hover-icon {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .gallery-card:hover .card-hover-icon {
          opacity: 1;
          transform: scale(1);
        }

        .card-footer {
          padding: 12px 2px 0;
        }

        .card-name {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text-primary);
          margin: 0 0 3px;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .card-location {
          font-family: var(--font-body);
          font-size: 0.725rem;
          color: var(--color-text-secondary);
          margin: 0;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Navigation */
        .gallery-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
        }

        .nav-progress {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .progress-pip {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-gray-300);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .progress-pip.active {
          width: 18px;
          border-radius: 3px;
          background: var(--color-text-primary);
        }

        .progress-pip:hover:not(.active) {
          background: var(--color-gray-400);
        }

        .nav-arrows {
          display: flex;
          gap: 8px;
        }

        .nav-arrow {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-text-primary);
          transition: all 0.2s ease;
          padding: 0;
        }

        .nav-arrow:hover:not(:disabled) {
          border-color: var(--color-text-primary);
          background: var(--color-text-primary);
          color: white;
        }

        .nav-arrow:disabled {
          opacity: 0.22;
          cursor: not-allowed;
        }

        /* Profile CTA */
        .profile-cta {
          text-align: center;
          margin-top: var(--space-2xl);
        }

        .profile-button {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text-primary);
          background: white;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .profile-button:hover {
          border-color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .profile-button-label {
          letter-spacing: -0.01em;
        }

        .profile-button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--color-gray-100);
          border-radius: 50%;
          transition: all 0.25s ease;
        }

        .profile-button-icon svg {
          color: var(--color-text-secondary);
          transition: color 0.25s ease;
        }

        .profile-button:hover .profile-button-icon {
          background: var(--color-primary);
          transform: rotate(45deg);
        }

        .profile-button:hover .profile-button-icon svg {
          color: white;
        }

        @media (max-width: 768px) {
          .portfolio {
            padding: var(--space-2xl) var(--space-md);
          }

          .portfolio-header {
            margin-bottom: var(--space-2xl);
          }

          .gallery-card {
            padding: 0 6px;
          }

          .gallery-nav {
            justify-content: center;
          }

          .profile-button {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 480px) {
          .profile-button {
            width: 100%;
            max-width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
