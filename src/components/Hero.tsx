import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { scrollToSection } from '../hooks/useLenis';
import { HeroVideo } from './HeroVideo';

/*
  This component renders the hero in its resting state, with no entrance of its
  own. The visible entrance already ran in the static hero that ships inside
  index.html (see hero-boot.html and hero-boot.css markers in vite.config.ts),
  which paints from the markup instead of waiting for this bundle. By the time
  React gets here the cascade is over, so animating again would replay it a
  second late. Styles live in Hero.css, which the build inlines into <head> so
  both copies of the hero are laid out by the exact same rules.
*/

const useBootHeroHandover = () => {
  useEffect(() => {
    const boot = document.getElementById('hero-boot');
    if (!boot) return;

    // Two heroes are on the page for a moment. Only one should be reachable.
    boot.setAttribute('aria-hidden', 'true');
    boot.setAttribute('inert', '');

    const info = window.__heroBoot;
    const elapsed = info ? performance.now() - info.t0 : Number.POSITIVE_INFINITY;
    const remaining = Math.max(0, (info?.settleMs ?? 0) - elapsed);

    const timer = window.setTimeout(() => boot.remove(), remaining);
    return () => window.clearTimeout(timer);
  }, []);
};

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="stat-item">
    <span className="stat-number">{number}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export const Hero = () => {
  const { t } = useLanguage();
  useBootHeroHandover();

  const scrollToContact = () => {
    const form = document.getElementById('contact-form');
    const fallback = document.getElementById('contact');
    const target = form ?? fallback;
    if (!target) return;
    // Center the selection cards in the viewport instead of landing on the heading.
    const rect = target.getBoundingClientRect();
    const centerOffset = Math.round((window.innerHeight - rect.height) / 2) * -1;
    scrollToSection(target, centerOffset);
  };

  const scrollToServices = () => {
    scrollToSection('services', -80);
  };

  return (
    <section id="home" className="hero">
      <div className="hero-video-wrapper">
        <HeroVideo />
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>{t.hero.eyebrow}</span>
            <span className="eyebrow-line"></span>
          </div>

          <h1 className="hero-title">
            {t.hero.title.line1}
            <br />
            <span className="title-light">{t.hero.title.line2}</span>
            <br />
            {t.hero.title.line3}
          </h1>

          <p className="hero-subtitle">{t.hero.subtitle}</p>

          <div className="hero-cta">
            <button className="cta-primary" onClick={scrollToContact}>
              {t.hero.cta.primary}
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="cta-ghost" onClick={scrollToServices}>
              {t.hero.cta.secondary}
            </button>
          </div>

          <div className="hero-stats">
            <StatItem
              number={t.hero.stats.properties.number}
              label={t.hero.stats.properties.label}
            />
            <div className="stat-divider"></div>
            <StatItem
              number={t.hero.stats.support.number}
              label={t.hero.stats.support.label}
            />
            <div className="stat-divider"></div>
            <StatItem
              number={t.hero.stats.experience.number}
              label={t.hero.stats.experience.label}
            />
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};
