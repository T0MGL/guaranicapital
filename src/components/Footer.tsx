import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const contactInfo = {
    email: 'info@guaranicapital.com',
    phone: '+595 991 899050',
    whatsapp: '595991899050',
    location: 'Asunción, Paraguay',
    hours: 'Lun - Vie: 9:00 - 18:00',
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/guaranicapitalpy',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/guaranicapitalpy',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/guaranicapital',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/${contactInfo.whatsapp}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
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
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <Logo width={100} height={35} />
            </div>
            <p className="footer-tagline">
              {t.footer.tagline}
            </p>
            <div className="footer-social">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={link.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4 className="link-title">{t.footer.navigation}</h4>
              <button onClick={() => scrollToSection('home')} className="footer-link">
                {t.footer.links.home}
              </button>
              <button onClick={() => scrollToSection('about')} className="footer-link">
                {t.footer.links.about}
              </button>
              <button onClick={() => scrollToSection('services')} className="footer-link">
                {t.footer.links.services}
              </button>
              <button onClick={() => scrollToSection('contact')} className="footer-link">
                {t.footer.links.contact}
              </button>
            </div>

            <div className="link-group">
              <h4 className="link-title">{t.footer.servicesTitle}</h4>
              <button onClick={() => scrollToSection('services')} className="footer-link">
                {t.footer.links.fullManagement}
              </button>
              <button onClick={() => scrollToSection('services')} className="footer-link">
                {t.footer.links.digitalMarketing}
              </button>
              <button onClick={() => scrollToSection('services')} className="footer-link">
                {t.footer.links.support247}
              </button>
              <button onClick={() => scrollToSection('services')} className="footer-link">
                {t.footer.links.maintenance}
              </button>
            </div>

            <div className="link-group">
              <h4 className="link-title">{t.footer.contactTitle}</h4>
              <a href={`mailto:${contactInfo.email}`} className="footer-link footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {contactInfo.email}
              </a>
              <a href={`https://wa.me/${contactInfo.whatsapp}`} className="footer-link footer-contact-item" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {contactInfo.phone}
              </a>
              <p className="footer-text footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {t.footer.location}
              </p>
              <p className="footer-text footer-contact-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {t.footer.hours}
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright-group">
            <p className="footer-copyright">
              © {currentYear} Guaraní Capital. {t.footer.rights}
            </p>
            <span className="divider">•</span>
            <a
              href="http://thebrightidea.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="developed-by"
            >
              {t.footer.developedBy.split('Bright Idea')[0]}
              <span className="shimmer-text">Bright Idea</span>
            </a>
          </div>
          <div className="footer-legal">
            <a href="#" className="legal-link">{t.footer.legalLinks.terms}</a>
            <span className="divider">•</span>
            <a href="#" className="legal-link">{t.footer.legalLinks.privacy}</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: linear-gradient(180deg,
            var(--color-neutral-dark) 0%,
            #0f1419 100%
          );
          color: rgba(255, 255, 255, 0.8);
          padding: var(--space-xl) var(--space-lg) var(--space-lg);
          position: relative;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(212, 175, 55, 0.3) 50%,
            transparent 100%
          );
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--space-2xl);
          padding-bottom: var(--space-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: var(--space-md);
        }

        .footer-brand {
          max-width: 400px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          margin-bottom: var(--space-sm);
          filter: brightness(0) invert(1);
        }

        .footer-tagline {
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: var(--space-md);
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-social {
          display: flex;
          gap: var(--space-sm);
        }

        .social-link {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .social-link:hover {
          background: var(--color-primary);
          color: white;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
        }

        .link-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .link-title {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-xs);
        }

        .footer-link {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color var(--transition-base);
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 0;
        }

        .footer-link:hover {
          color: var(--color-primary);
        }

        .footer-text {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-contact-item svg {
          flex-shrink: 0;
          opacity: 0.6;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .footer-copyright-group {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .footer-copyright {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
          margin: 0;
        }

        .developed-by {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          transition: color var(--transition-base);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .developed-by:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        .developed-by:hover .shimmer-text {
          animation-duration: 1.5s;
        }

        .footer-legal {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .legal-link {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .legal-link:hover {
          color: var(--color-primary);
        }

        .divider {
          color: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }

          .footer-links {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer {
            padding: var(--space-2xl) var(--space-md) var(--space-lg);
          }

          .footer-brand {
            max-width: 100%;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: var(--space-lg);
          }

          .footer-link {
            font-size: 0.9375rem;
            padding: 0.25rem 0; /* Better touch spacing */
          }

          .footer-text {
            font-size: 0.9375rem;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: var(--space-md);
          }

          .footer-copyright-group {
            flex-direction: column;
            align-items: center;
            gap: var(--space-xs);
          }

          .footer-copyright {
            font-size: 0.8125rem;
          }

          .developed-by,
          .legal-link {
            font-size: 0.8125rem;
          }

          .footer-legal {
            flex-direction: column;
            align-items: center;
            gap: var(--space-xs);
          }

          .divider {
            display: none;
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .footer {
            padding: var(--space-xl) var(--space-sm) var(--space-md);
          }

          .footer-main {
            gap: var(--space-xl);
          }

          .link-title {
            font-size: 0.8125rem;
          }

          .social-link {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </footer>
  );
};
