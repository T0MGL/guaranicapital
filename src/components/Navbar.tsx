import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useFormState } from '../context/FormStateContext';

export const Navbar = () => {
  const { t } = useLanguage();
  const { formState } = useFormState();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navbar should be in scrolled state when form is active OR when page is scrolled
  const navbarScrolled = formState === 'form' || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 50;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: t.navbar.home, id: 'home' },
    { label: t.navbar.about, id: 'about' },
    { label: t.navbar.services, id: 'services' },
    { label: t.navbar.contact, id: 'contact' },
  ];

  return (
    <motion.nav
      className={`navbar ${navbarScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <button onClick={() => scrollToSection('home')} className="logo-button">
            <motion.div
              animate={{
                scale: navbarScrolled ? 0.75 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Logo width={100} height={32} />
            </motion.div>
          </button>
        </div>

        <div className="navbar-menu desktop">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className="nav-link"
              onClick={() => scrollToSection(item.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        <div className="navbar-actions">
          <LanguageSelector isScrolled={navbarScrolled} />
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-content">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className="mobile-nav-link"
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="mobile-language-selector">
                <LanguageSelector isScrolled={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          border-bottom-color: var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.5rem var(--space-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled .navbar-container {
          padding: 0.3rem var(--space-lg);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
        }

        .logo-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #ffffff;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .logo-button img {
          filter: brightness(0) invert(1);
          transition: filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled .logo-button {
          color: var(--color-text-primary);
        }

        .navbar.scrolled .logo-button img {
          filter: none;
        }

        .logo-button:hover {
          opacity: 0.8;
        }

        .navbar-menu.desktop {
          display: none;
          gap: var(--space-lg);
        }

        .nav-link {
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .navbar.scrolled .nav-link {
          color: var(--color-text-secondary);
        }

        .navbar.scrolled .nav-link:hover {
          color: var(--color-primary);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .mobile-menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hamburger {
          width: 24px;
          height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .hamburger span {
          width: 100%;
          height: 2px;
          background: #ffffff;
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled .hamburger span {
          background: var(--color-text-primary);
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translateY(9px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translateY(-9px);
        }

        .mobile-menu {
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          overflow: hidden;
        }

        .mobile-nav-link {
          display: block;
          width: 100%;
          padding: var(--space-md) var(--space-lg);
          font-family: var(--font-body);
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-base);
          border-bottom: 1px solid var(--color-border);
        }

        .mobile-nav-link:hover {
          color: var(--color-primary);
          background: var(--color-gray-50);
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
        }

        .mobile-language-selector {
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .navbar-menu.desktop {
            display: flex;
          }

          .mobile-menu-toggle {
            display: none;
          }

          .mobile-language-selector {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .navbar-container {
            padding: 0.4rem var(--space-md);
          }

          .navbar.scrolled .navbar-container {
            padding: 0.25rem var(--space-md);
          }

          .logo-text,
          .logo-accent {
            font-size: 1.25rem;
          }

          .mobile-menu-toggle {
            padding: 0.75rem; /* Larger touch target */
            min-width: 48px;
            min-height: 48px;
          }

          .mobile-nav-link {
            padding: var(--space-lg);
            font-size: 1.0625rem;
            min-height: 56px; /* Better touch target */
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .navbar-container {
            padding: 0.4rem var(--space-sm);
          }

          .navbar.scrolled .navbar-container {
            padding: 0.25rem var(--space-sm);
          }
        }
      `}</style>
    </motion.nav>
  );
};
