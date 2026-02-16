import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="hero">
      {/* Video Background */}
      <div className="hero-video-wrapper">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/videos/11554614/pexels-photo-11554614.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=720&w=1280"
        >
          <source
            src="https://videos.pexels.com/video-files/11554614/11554614-hd_1280_720_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="eyebrow-line"></span>
            <span>{t.hero.eyebrow}</span>
            <span className="eyebrow-line"></span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t.hero.title.line1}
            <br />
            <span className="title-light shimmer-text">{t.hero.title.line2}</span>
            <br />
            {t.hero.title.line3}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <motion.button
              className="cta-primary"
              onClick={scrollToContact}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.hero.cta.primary}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
            <motion.button
              className="cta-ghost"
              onClick={scrollToServices}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.hero.cta.secondary}
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <div className="stat-item">
              <span className="stat-number">{t.hero.stats.properties.number}</span>
              <span className="stat-label">{t.hero.stats.properties.label}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{t.hero.stats.support.number}</span>
              <span className="stat-label">{t.hero.stats.support.label}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{t.hero.stats.experience.number}</span>
              <span className="stat-label">{t.hero.stats.experience.label}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="scroll-line"></div>
      </motion.div>

      <style>{`
        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(0, 0, 0, 0.55) 50%,
            rgba(0, 0, 0, 0.65) 100%
          );
        }

        .hero-container {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 var(--space-lg);
          text-align: center;
        }

        .hero-content {
          max-width: 780px;
          margin: 0 auto;
        }

        /* Eyebrow */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1.5rem;
        }

        .eyebrow-line {
          display: block;
          width: 32px;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
        }

        /* Title */
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 600;
          line-height: 1.18;
          color: #ffffff;
          margin-bottom: 1.2rem;
          letter-spacing: -0.025em;
        }

        .title-light {
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Subtitle */
        .hero-subtitle {
          font-family: var(--font-body);
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          font-weight: 300;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2rem;
          letter-spacing: 0.01em;
        }

        .desktop-br {
          display: block;
        }

        /* CTAs */
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
          margin-bottom: 3rem;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 500;
          color: #0d0d0d;
          background: #ffffff;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
          letter-spacing: 0.01em;
        }

        .cta-primary:hover {
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
        }

        .cta-ghost {
          display: inline-flex;
          align-items: center;
          padding: 0.85rem 1.8rem;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
          letter-spacing: 0.01em;
        }

        .cta-ghost:hover {
          border-color: rgba(255, 255, 255, 0.5);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        /* Stats */
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding-top: 1.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.45);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.12);
        }

        /* Scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        .scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          animation: scrollPulse 2.5s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.5); transform-origin: top; }
          50% { opacity: 0.8; transform: scaleY(1); transform-origin: top; }
        }

        @media (max-width: 768px) {
          .hero {
            min-height: 100svh; /* Use svh for better mobile support */
          }

          .hero-container {
            padding: 0 var(--space-md);
          }

          .hero-eyebrow {
            font-size: 0.7rem;
            gap: 0.6rem;
            margin-bottom: 1.2rem;
          }

          .eyebrow-line {
            width: 20px;
          }

          .hero-title {
            font-size: 2rem;
            line-height: 1.22;
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
            margin-bottom: 1.8rem;
          }

          .desktop-br {
            display: none;
          }

          .hero-cta {
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 2.5rem;
          }

          .cta-primary,
          .cta-ghost {
            width: 100%;
            justify-content: center;
            min-height: 48px; /* Better touch target */
            padding: 1rem 2rem;
          }

          .hero-stats {
            gap: 1rem;
            padding-top: 1.5rem;
          }

          .stat-number {
            font-size: 1.2rem;
          }

          .stat-label {
            font-size: 0.7rem; /* Increased from 0.65rem for better readability */
          }

          .stat-divider {
            height: 28px;
          }

          .scroll-indicator {
            bottom: 1.5rem;
          }
        }

        /* Extra small devices (320px - 375px) */
        @media (max-width: 375px) {
          .hero-container {
            padding: 0 var(--space-sm);
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .hero-subtitle {
            font-size: 0.875rem;
          }

          .hero-stats {
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .stat-item {
            flex: 0 0 auto;
          }

          .stat-number {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
};
