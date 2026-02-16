import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PillarData {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  stats: { value: string; label: string };
}

const revenueIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path
      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 12V24L32 28"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const managementIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect
      x="6"
      y="10"
      width="36"
      height="28"
      rx="3"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <path
      d="M6 18H42"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M16 10V18M32 10V18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const supportIcon = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <path
      d="M20 18L28 26L20 34"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 24H28"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M42 24C42 33.9411 33.9411 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const FeatureCard = ({ pillar, index, isInView }: { pillar: PillarData; index: number; isInView: boolean }) => {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
    >
      <div className="feature-icon">{pillar.icon}</div>
      <h3 className="feature-title">{pillar.title}</h3>
      <p className="feature-description">{pillar.description}</p>
      <div className="feature-stats">
        <div className="stat-value">{pillar.stats.value}</div>
        <div className="stat-label">{pillar.stats.label}</div>
      </div>
    </motion.div>
  );
};

export const WhyChooseUs = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const pillars: PillarData[] = [
    {
      id: 'revenue',
      title: t.whyChooseUs.pillars.revenue.title,
      description: t.whyChooseUs.pillars.revenue.description,
      icon: revenueIcon,
      stats: {
        value: t.whyChooseUs.pillars.revenue.stats.value,
        label: t.whyChooseUs.pillars.revenue.stats.label,
      },
    },
    {
      id: 'management',
      title: t.whyChooseUs.pillars.management.title,
      description: t.whyChooseUs.pillars.management.description,
      icon: managementIcon,
      stats: {
        value: t.whyChooseUs.pillars.management.stats.value,
        label: t.whyChooseUs.pillars.management.stats.label,
      },
    },
    {
      id: 'support',
      title: t.whyChooseUs.pillars.support.title,
      description: t.whyChooseUs.pillars.support.description,
      icon: supportIcon,
      stats: {
        value: t.whyChooseUs.pillars.support.stats.value,
        label: t.whyChooseUs.pillars.support.stats.label,
      },
    },
  ];

  return (
    <section id="about" className="why-choose-us">
      <div className="why-container">
        <motion.div
          ref={ref}
          className="why-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label">{t.whyChooseUs.label}</div>
          <h2 className="section-title">
            {t.whyChooseUs.title.line1}
            <br />
            {t.whyChooseUs.title.line2}
          </h2>
          <p className="section-subtitle">
            {t.whyChooseUs.subtitle}
          </p>
        </motion.div>

        <div className="features-grid">
          {pillars.map((pillar, index) => (
            <FeatureCard key={pillar.id} pillar={pillar} index={index} isInView={isInView} />
          ))}
        </div>
      </div>

      <style>{`
        .why-choose-us {
          padding: var(--space-3xl) var(--space-lg);
          background: var(--color-base-white);
        }

        .why-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .why-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--space-3xl);
        }

        .section-label {
          display: inline-block;
          padding: var(--space-xs) var(--space-md);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          background: var(--color-gray-100);
          border-radius: var(--radius-full);
          margin-bottom: var(--space-lg);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 600;
          line-height: 1.2;
          color: var(--color-text-primary);
          margin-bottom: var(--space-md);
        }

        .section-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: var(--space-xl);
        }

        .feature-card {
          position: relative;
          padding: var(--space-xl);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-50);
          color: var(--color-primary);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          background: var(--color-primary);
          color: white;
        }

        .feature-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-md);
        }

        .feature-description {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-lg);
        }

        .feature-stats {
          padding-top: var(--space-lg);
          border-top: 1px solid var(--color-border);
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--color-primary);
          line-height: 1;
          margin-bottom: var(--space-xs);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .why-choose-us {
            padding: var(--space-2xl) var(--space-md);
          }

          .why-header {
            margin-bottom: var(--space-2xl);
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }

          .feature-card {
            padding: var(--space-lg);
          }

          .feature-icon {
            width: 64px;
            height: 64px;
          }

          .feature-icon svg {
            width: 36px;
            height: 36px;
          }

          .feature-title {
            font-size: 1.5rem;
          }

          .stat-value {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};
