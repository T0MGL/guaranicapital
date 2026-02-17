import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Property {
  id: number;
  name: string;
  location: string;
  airbnbUrl: string;
  image: string;
}

export const PropertyPortfolio = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const properties: Property[] = [
    {
      id: 1,
      name: 'Modern Luxury Apartment',
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1510892348329587039?guests=1&adults=1&s=67&unique_share_id=af00503d-ccd9-408c-8fd8-92adc2e267ea',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    },
    {
      id: 2,
      name: 'Premium Downtown Suite',
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1596370816314737099?guests=1&adults=1&s=67&unique_share_id=eaa45090-9abf-4aa1-abc8-14d2e65be82d',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    },
    {
      id: 3,
      name: 'Elegant City View',
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1608807788126038473?guests=1&adults=1&s=67&unique_share_id=09e47746-0165-43cb-8222-e96c5457b426',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    },
    {
      id: 4,
      name: 'Stylish Urban Retreat',
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1533698279104413114?guests=1&adults=1&s=67&unique_share_id=917c8005-2155-435e-a1be-67872c5ca045',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    },
    {
      id: 5,
      name: 'Contemporary Design Space',
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1596370816314737099?guests=1&adults=1&s=67&unique_share_id=f11bb26f-0a0c-4a83-a9a8-7e38bcaefa20',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    },
    {
      id: 6,
      name: 'Executive Apartment',
      location: 'Asunción',
      airbnbUrl: 'https://www.airbnb.co.uk/rooms/1271130534389738919?guests=1&adults=1&s=67&unique_share_id=f947fd63-5272-4789-9197-26c6182536fe',
      image: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&q=80',
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [properties.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section id="portfolio" className="portfolio">
      <div className="portfolio-container">
        <motion.div
          ref={ref}
          className="portfolio-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label">{t.portfolio.label}</div>
          <h2 className="section-title">
            {t.portfolio.title.line1}
            <br />
            {t.portfolio.title.line2}
          </h2>
          <p className="section-subtitle">{t.portfolio.subtitle}</p>
        </motion.div>

        <div
          className="carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button className="carousel-button carousel-button-prev" onClick={handlePrev} aria-label="Previous property">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="carousel-container">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="property-card"
              >
                <div className="property-image-wrapper">
                  <img
                    src={properties[currentIndex].image}
                    alt={properties[currentIndex].name}
                    className="property-image"
                  />
                  <div className="property-overlay" />
                </div>
                <div className="property-content">
                  <div className="property-info">
                    <h3 className="property-name">{properties[currentIndex].name}</h3>
                    <p className="property-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      {properties[currentIndex].location}
                    </p>
                  </div>
                  <a
                    href={properties[currentIndex].airbnbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="airbnb-button"
                  >
                    {t.portfolio.viewButton}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17L17 7M17 7H7M17 7v10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="carousel-button carousel-button-next" onClick={handleNext} aria-label="Next property">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {properties.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to property ${index + 1}`}
            />
          ))}
        </div>

        <motion.div
          className="profile-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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

        .carousel-wrapper {
          position: relative;
          max-width: 1000px;
          margin: 0 auto var(--space-xl);
        }

        .carousel-container {
          position: relative;
          width: 100%;
          height: 600px;
          overflow: hidden;
          border-radius: var(--radius-lg);
        }

        .property-card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          background: var(--color-surface);
        }

        .property-image-wrapper {
          position: relative;
          width: 100%;
          height: 70%;
          overflow: hidden;
        }

        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-image {
          transform: scale(1.05);
        }

        .property-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
        }

        .property-content {
          position: relative;
          padding: var(--space-xl);
          height: 30%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .property-info {
          flex: 1;
        }

        .property-name {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-sm);
          line-height: 1.2;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: 1rem;
          color: var(--color-text-secondary);
        }

        .property-location svg {
          color: var(--color-primary);
        }

        .airbnb-button {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: var(--color-primary);
          border: none;
          border-radius: var(--radius-full);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .airbnb-button:hover {
          background: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
          z-index: 10;
          color: var(--color-text-primary);
        }

        .carousel-button:hover {
          background: var(--color-primary);
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-button-prev {
          left: -24px;
        }

        .carousel-button-next {
          right: -24px;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: var(--space-sm);
          margin-top: var(--space-xl);
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-gray-300);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot:hover {
          background: var(--color-gray-400);
          transform: scale(1.2);
        }

        .dot.active {
          background: var(--color-primary);
          width: 32px;
          border-radius: 6px;
        }

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

        @media (max-width: 1024px) {
          .carousel-button-prev {
            left: 8px;
          }

          .carousel-button-next {
            right: 8px;
          }
        }

        @media (max-width: 768px) {
          .portfolio {
            padding: var(--space-2xl) var(--space-md);
          }

          .carousel-container {
            height: 500px;
          }

          .property-content {
            padding: var(--space-lg);
            flex-direction: column;
            align-items: stretch;
          }

          .property-name {
            font-size: 1.375rem;
          }

          .airbnb-button {
            width: 100%;
            justify-content: center;
            min-height: 48px;
          }

          .carousel-button {
            width: 40px;
            height: 40px;
          }

          .carousel-button-prev {
            left: 4px;
          }

          .carousel-button-next {
            right: 4px;
          }

          .profile-button {
            font-size: 0.875rem;
            padding: var(--space-sm) var(--space-md);
          }

          .profile-button-icon {
            width: 22px;
            height: 22px;
          }

          .profile-button-icon svg {
            width: 16px;
            height: 16px;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            height: 450px;
          }

          .property-image-wrapper {
            height: 65%;
          }

          .property-content {
            height: 35%;
            padding: var(--space-md);
          }

          .property-name {
            font-size: 1.25rem;
          }

          .property-location {
            font-size: 0.875rem;
          }

          .airbnb-button {
            font-size: 0.9375rem;
            padding: var(--space-sm) var(--space-md);
          }

          .profile-button {
            font-size: 0.875rem;
            padding: var(--space-sm) var(--space-md);
            width: 100%;
            max-width: 100%;
            justify-content: center;
          }

          .profile-button-icon {
            width: 20px;
            height: 20px;
          }

          .profile-button-icon svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </section>
  );
};
