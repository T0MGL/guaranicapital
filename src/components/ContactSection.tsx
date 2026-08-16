import { GuaraniForm } from './GuaraniForm';
import { useLanguage } from '../context/LanguageContext';

// Embed por query: no requiere API key y geocodifica a la oficina real (-25.27796, -57.56659).
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=Cecilio+Da+Silva+Lovera+1257,+Asunci%C3%B3n,+Paraguay&output=embed&z=16';

const MAP_LINK_URL =
  'https://www.google.com/maps/search/?api=1&query=Cecilio+Da+Silva+Lovera+1257,+Asunci%C3%B3n,+Paraguay';

export const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact-section">
      {/* Background Image */}
      <div className="contact-background">
        <div
          className="background-image"
          style={{
            backgroundImage: 'url(https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/YrDaMkEJyRuwgKZM/whatsapp-image-2025-07-05-at-16.52.33-mP4MOvw8lytel6KE.jpeg)'
          }}
        ></div>
        <div className="background-overlay"></div>
      </div>

      {/* Form Content */}
      <div className="contact-content">
        <GuaraniForm />

        <div className="contact-location">
          <div className="location-card">
            <div className="location-info">
              <p className="location-label">{t.contact.locationLabel}</p>
              <p className="location-address">{t.contact.address}</p>
              <a
                href={MAP_LINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="location-link"
              >
                Google Maps
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
            <div className="location-map">
              <iframe
                src={MAP_EMBED_URL}
                title={t.contact.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          position: relative;
          background: var(--color-bg);
          overflow: hidden;
        }

        .contact-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 1;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.88) 0%,
            rgba(250, 250, 250, 0.85) 50%,
            rgba(255, 255, 255, 0.88) 100%
          );
        }

        .contact-content {
          position: relative;
          z-index: 1;
        }

        /* Office location */
        .contact-location {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 var(--space-lg) var(--space-3xl);
        }

        .location-card {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .location-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: clamp(1.75rem, 4vw, 3rem);
        }

        .location-label {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin: 0;
        }

        .location-address {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 2.2vw, 1.625rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.3;
          color: var(--color-text-primary);
          margin: 0;
          max-width: 20ch;
        }

        .location-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-primary);
          text-decoration: none;
          transition: color var(--transition-base);
          width: fit-content;
        }

        .location-link svg {
          transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .location-link:hover {
          color: var(--color-primary-dark);
        }

        .location-link:hover svg {
          transform: translate(2px, -2px);
        }

        .location-map {
          min-height: 340px;
        }

        .location-map iframe {
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
        }

        @media (max-width: 768px) {
          .contact-location {
            padding: 0 var(--space-md) var(--space-2xl);
          }

          .location-card {
            grid-template-columns: 1fr;
          }

          .location-info {
            padding: var(--space-lg);
          }

          .location-map {
            min-height: 260px;
          }
        }
      `}</style>
    </section>
  );
};
