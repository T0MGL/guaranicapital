import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, MouseEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PropertyMeta {
  id: number;
  location: string;
  airbnbUrl: string;
  images: string[];
}

interface PropertyCardProps {
  prop: PropertyMeta;
  name: string;
  widthPercent: number;
}

const PropertyCard = ({ prop, name, widthPercent }: PropertyCardProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const total = prop.images.length;
  const hasMultiple = total > 1;

  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const goPrev = (e: MouseEvent) => {
    stop(e);
    setImgIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = (e: MouseEvent) => {
    stop(e);
    setImgIndex((prev) => (prev + 1) % total);
  };

  return (
    <a
      href={prop.airbnbUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gallery-card"
      style={{ width: `${widthPercent}%` }}
    >
      <div className="card-image-box">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={imgIndex}
            src={prop.images[imgIndex]}
            alt={`${name} ${imgIndex + 1}/${total}`}
            className="card-img"
            loading={imgIndex === 0 ? 'lazy' : 'eager'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              className="card-arrow card-arrow-left"
              onClick={goPrev}
              onMouseDown={stop}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className="card-arrow card-arrow-right"
              onClick={goNext}
              onMouseDown={stop}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="card-dots">
              {prop.images.map((_, i) => (
                <span
                  key={i}
                  className={`card-dot ${i === imgIndex ? 'active' : ''}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </>
        )}

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
        <p className="card-name">{name}</p>
        <p className="card-location">{prop.location}</p>
      </div>
    </a>
  );
};

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
      airbnbUrl: 'https://www.airbnb.com/rooms/1417165514634453334?guests=1&adults=1&s=67&unique_share_id=deaa0f70-ad23-4e7e-af37-961dfa40a9b4',
      images: [
        '/properties/1/1.webp',
        '/properties/1/2.webp',
        '/properties/1/3.webp',
      ],
    },
    {
      id: 2,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.com/rooms/1629236974528724403?guests=1&adults=1&s=67&unique_share_id=06aef2a2-874c-4019-8630-fbe794fee849',
      images: [
        '/properties/2/1.webp',
        '/properties/2/2.webp',
        '/properties/2/3.webp',
      ],
    },
    {
      id: 3,
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.com/rooms/1271130534389738919?guests=1&adults=1&s=67&unique_share_id=3344b8c8-9375-4cde-8a1b-af4a39a35f61',
      images: [
        '/properties/3/1.webp',
        '/properties/3/2.webp',
        '/properties/3/3.webp',
      ],
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
                <PropertyCard
                  key={prop.id}
                  prop={prop}
                  name={t.portfolio.properties[index].name}
                  widthPercent={100 / N}
                />
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
          position: absolute;
          inset: 0;
          transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .gallery-card:hover .card-img {
          transform: scale(1.045);
        }

        .card-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(6px);
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          opacity: 0;
          transition: opacity 0.22s ease, background 0.2s ease, transform 0.22s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.14);
          z-index: 2;
        }

        .card-arrow-left {
          left: 12px;
        }

        .card-arrow-right {
          right: 12px;
        }

        .gallery-card:hover .card-arrow {
          opacity: 1;
        }

        .card-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.06);
        }

        .card-arrow:active {
          transform: translateY(-50%) scale(0.94);
        }

        .card-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        .card-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
          transition: background 0.22s ease, transform 0.22s ease;
        }

        .card-dot.active {
          background: #fff;
          transform: scale(1.15);
        }

        @media (hover: none) {
          .card-arrow {
            opacity: 1;
            background: rgba(255, 255, 255, 0.88);
          }
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
