import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ServiceData {
  title: string;
  description: string;
  features: string[];
}

export const Services = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const services: ServiceData[] = [
    {
      title: t.services.items.setup.title,
      description: t.services.items.setup.description,
      features: t.services.items.setup.features,
    },
    {
      title: t.services.items.operations.title,
      description: t.services.items.operations.description,
      features: t.services.items.operations.features,
    },
    {
      title: t.services.items.optimization.title,
      description: t.services.items.optimization.description,
      features: t.services.items.optimization.features,
    },
    {
      title: t.services.items.furnishing.title,
      description: t.services.items.furnishing.description,
      features: t.services.items.furnishing.features,
    },
  ];

  return (
    <section id="services" className="services">
      <div className="services-container">
        <motion.div
          ref={ref}
          className="services-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label">{t.services.label}</div>
          <h2 className="section-title">
            {t.services.title.line1}{' '}
            <span className="title-br"><br /></span>
            {t.services.title.line2}
          </h2>
          <p className="section-subtitle">
            {t.services.subtitle}
          </p>

          <motion.a
            href="https://drive.google.com/uc?export=download&id=1xvGb-AnXObHB2K492LVYCZzGp0N9Wkle"
            target="_blank"
            rel="noopener noreferrer"
            className="brochure-download"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.services.brochure}
          </motion.a>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} isInView={isInView} />
          ))}
        </div>

        <motion.div
          className="services-cta"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="cta-content">
            <h3 className="cta-title">{t.services.cta.title}</h3>
            <p className="cta-text">
              {t.services.cta.text}
            </p>
            <a href="#contact" className="cta-button">
              <div className="cta-button-content">
                <div className="cta-button-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 11l3 3L22 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="cta-button-text">
                  <span className="cta-button-primary">{t.services.cta.button}</span>
                  <span className="cta-button-secondary">{t.services.cta.buttonSubtext}</span>
                </div>
                <div className="cta-button-arrow">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="cta-button-shimmer"></div>
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        .services {
          padding: var(--space-3xl) var(--space-lg);
          background: linear-gradient(
            180deg,
            var(--color-base-white) 0%,
            var(--color-gray-50) 50%,
            var(--color-base-white) 100%
          );
        }

        .services-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .services-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--space-3xl);
        }

        .brochure-download {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-xl);
          padding: var(--space-sm) var(--space-lg);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-primary);
          background: transparent;
          border: 1px solid var(--color-primary);
          border-radius: var(--radius-full);
          text-decoration: none;
          transition: background-color 0.3s ease, color 0.3s ease;
          cursor: pointer;
        }

        .brochure-download:hover {
          background: var(--color-primary);
          color: white;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-xl);
          margin-bottom: var(--space-3xl);
        }

        .services-cta {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--space-3xl);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          border-radius: var(--radius-lg);
          text-align: center;
          color: white;
          box-shadow: var(--shadow-xl);
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: var(--space-md);
        }

        .cta-text {
          font-size: 1.125rem;
          line-height: 1.6;
          opacity: 0.95;
          margin-bottom: var(--space-xl);
        }

        .cta-button {
          position: relative;
          display: inline-block;
          overflow: hidden;
          border-radius: var(--radius-lg);
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }

        .cta-button:active {
          transform: translateY(0);
        }

        .cta-button-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: 1.25rem 2rem;
          background: white;
          z-index: 1;
        }

        .cta-button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          border-radius: var(--radius-md);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .cta-button-icon svg {
          color: white;
        }

        .cta-button:hover .cta-button-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .cta-button-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          text-align: left;
        }

        .cta-button-primary {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.2;
        }

        .cta-button-secondary {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--color-text-secondary);
          line-height: 1.2;
        }

        .cta-button-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--color-gray-100);
          border-radius: 50%;
          flex-shrink: 0;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .cta-button-arrow svg {
          color: var(--color-primary);
        }

        .cta-button:hover .cta-button-arrow {
          transform: translateX(4px);
          background: var(--color-gray-200);
        }

        .cta-button-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 3s infinite;
          pointer-events: none;
          z-index: 2;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @media (max-width: 768px) {
          .services {
            padding: var(--space-2xl) var(--space-md);
          }

          .services-header {
            margin-bottom: var(--space-2xl);
          }

          .brochure-download {
            font-size: 0.875rem;
            padding: var(--space-sm) var(--space-md);
            min-height: 44px; /* Better touch target */
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
            margin-bottom: var(--space-2xl);
          }

          .services-cta {
            padding: var(--space-xl) var(--space-lg);
          }

          .cta-button {
            width: 100%;
          }

          .cta-button-content {
            padding: 1rem 1.5rem;
            gap: var(--space-sm);
          }

          .cta-button-icon {
            width: 40px;
            height: 40px;
          }

          .cta-button-icon svg {
            width: 20px;
            height: 20px;
          }

          .cta-button-primary {
            font-size: 1rem;
          }

          .cta-button-secondary {
            font-size: 0.75rem;
          }

          .cta-button-arrow {
            width: 28px;
            height: 28px;
          }

          .cta-button-arrow svg {
            width: 16px;
            height: 16px;
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .services {
            padding: var(--space-xl) var(--space-sm);
          }

          .services-header {
            margin-bottom: var(--space-xl);
          }

          .services-cta {
            padding: var(--space-lg) var(--space-md);
          }

          .cta-title {
            font-size: 1.5rem;
          }

          .cta-text {
            font-size: 1rem;
          }

          .cta-button-content {
            padding: 0.875rem 1.25rem;
          }

          .cta-button-icon {
            width: 36px;
            height: 36px;
          }

          .cta-button-primary {
            font-size: 0.9375rem;
          }

          .cta-button-secondary {
            font-size: 0.6875rem;
          }

          .cta-button-arrow {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </section>
  );
};

const ServiceCard = ({
  service,
  index,
  isInView,
}: {
  service: ServiceData;
  index: number;
  isInView: boolean;
}) => {
  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
    >
      <div className="service-number">{String(index + 1).padStart(2, '0')}</div>
      <h3 className="service-title">{service.title}</h3>
      <p className="service-description">{service.description}</p>
      <ul className="service-features">
        {service.features.map((feature, i) => (
          <li key={i} className="service-feature">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.333 4L6 11.333L2.667 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <style>{`
        .service-card {
          padding: var(--space-xl);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .service-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }

        .service-number {
          display: inline-block;
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 300;
          color: var(--color-gray-200);
          line-height: 1;
          margin-bottom: var(--space-md);
        }

        .service-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-sm);
        }

        .service-description {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-lg);
        }

        .service-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .service-feature {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.9375rem;
          color: var(--color-text-primary);
        }

        .service-feature svg {
          color: var(--color-success);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .service-card {
            padding: var(--space-lg);
          }

          .service-number {
            font-size: 2.5rem;
          }

          .service-title {
            font-size: 1.25rem;
          }

          .service-description {
            font-size: 0.9375rem;
          }

          .service-feature {
            font-size: 0.875rem;
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .service-card {
            padding: var(--space-md);
          }

          .service-number {
            font-size: 2rem;
          }

          .service-title {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
