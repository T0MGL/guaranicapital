import { useEffect, useRef, useState } from 'react';
import { GuaraniForm } from './GuaraniForm';
import { useLanguage } from '../context/LanguageContext';

// Embed por query: no requiere API key y geocodifica a la oficina real (-25.27796, -57.56659).
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=Cecilio+Da+Silva+Lovera+1257,+Asunci%C3%B3n,+Paraguay&output=embed&z=16';

const MAP_LINK_URL =
  'https://www.google.com/maps/search/?api=1&query=Cecilio+Da+Silva+Lovera+1257,+Asunci%C3%B3n,+Paraguay';

export const ContactSection = () => {
  const { t } = useLanguage();
  /* El embed pesa 678 KB en 38 pedidos a seis hosts de Google, medidos en
     Chrome sobre el build servido. loading="lazy" ya evita cargarlo antes de
     que la seccion entre en viewport, pero el visitante que baja al formulario
     lo paga igual sin haber pedido el mapa. Montamos el iframe recien cuando
     lo activa, asi el que nunca abre el mapa no toca Google. Por eso tampoco
     hay preconnect ni dns-prefetch: adelantar la conexion en hover anularia
     justamente lo que esto compra. */
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapFrameRef = useRef<HTMLIFrameElement>(null);

  /* El boton se desmonta al activarlo y con el se va el foco del teclado, que
     volveria al principio del documento. Lo llevamos al mapa recien montado. */
  useEffect(() => {
    if (!mapLoaded) return;
    mapFrameRef.current?.focus();
  }, [mapLoaded]);

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
              {mapLoaded ? (
                <iframe
                  ref={mapFrameRef}
                  src={MAP_EMBED_URL}
                  title={t.contact.mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  data-map-trigger
                  className="map-facade"
                  onClick={() => setMapLoaded(true)}
                >
                  <span className="map-facade-stack">
                    <svg
                      className="map-facade-pin"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2a7 7 0 0 0-7 7c0 5.314 7 12 7 12s7-6.686 7-12a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                      />
                    </svg>
                    <span className="map-facade-cta">{t.contact.mapCta}</span>
                    <span className="map-facade-hint">{t.contact.mapHint}</span>
                  </span>
                </button>
              )}
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
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: transform 200ms ease-out, box-shadow 200ms ease-out;
        }

        .location-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
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

        .location-link:focus-visible {
          outline: 2px solid var(--color-primary-dark);
          outline-offset: 3px;
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

        /* Facade del mapa. La trama es una abstraccion propia dibujada en CSS,
           no una captura del render de Google: la imagen de un mapa ajeno no es
           nuestra para publicar, y la Static Maps API pide key y facturacion.
           Las dos avenidas se cruzan abajo a la izquierda, no en el centro: un
           cruce centrado lee como mira telescopica y ademas parte la linea de
           ayuda al medio. El realce radial va arriba de todo para que el pin y
           las dos lineas de texto caigan sobre campo limpio. */
        .map-facade {
          --facade-line: var(--color-border);
          --facade-avenue: var(--color-gray-200);

          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          border: 0;
          font: inherit;
          color: inherit;
          cursor: pointer;
          text-align: center;
          background:
            radial-gradient(66% 60% at 50% 50%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.88) 36%, rgba(255, 255, 255, 0) 80%),
            linear-gradient(var(--facade-avenue), var(--facade-avenue)) 0 79% / 100% 2px no-repeat,
            linear-gradient(var(--facade-avenue), var(--facade-avenue)) 21% 0 / 2px 100% no-repeat,
            repeating-linear-gradient(0deg, var(--facade-line) 0 1px, transparent 1px 40px),
            repeating-linear-gradient(90deg, var(--facade-line) 0 1px, transparent 1px 40px),
            var(--color-gray-50);
        }

        .map-facade:hover,
        .map-facade:focus-visible {
          --facade-line: var(--color-gray-200);
          --facade-avenue: var(--color-gray-300);
        }

        .map-facade:focus-visible {
          /* Hacia adentro: el boton va al ras del borde de la tarjeta, que
             recorta con overflow hidden lo que se dibuje por fuera. */
          outline: 2px solid var(--color-primary-dark);
          outline-offset: -3px;
        }

        .map-facade-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 100%;
          padding: var(--space-lg);
        }

        .map-facade-pin {
          color: var(--color-accent);
        }

        .map-facade-cta {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-primary);
        }

        .map-facade-hint {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
          /* Da para una sola linea en los tres idiomas: la mas larga es la
             inglesa con 39 caracteres. Abajo de 320px de ancho corta sola. */
          max-width: 40ch;
        }

        /* Con movimiento reducido el hover sigue siendo visible: la trama se
           refuerza igual, lo unico que se cae es el desplazamiento del pin. */
        @media (prefers-reduced-motion: no-preference) {
          .map-facade {
            transition: background 200ms ease-out;
          }

          .map-facade-pin {
            transition: transform 200ms ease-out;
          }

          .map-facade:hover .map-facade-pin,
          .map-facade:focus-visible .map-facade-pin {
            transform: translateY(-2px);
          }
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
