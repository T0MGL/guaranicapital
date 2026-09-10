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
  const [mapActivated, setMapActivated] = useState(false);
  const mapFrameRef = useRef<HTMLIFrameElement>(null);

  /* El boton se desmonta al activarlo y con el se va el foco del teclado, que
     volveria al principio del documento. Lo llevamos al mapa recien montado. */
  useEffect(() => {
    if (!mapActivated) return;
    mapFrameRef.current?.focus();
  }, [mapActivated]);

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
              {mapActivated ? (
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
                  className="map-facade"
                  onClick={() => setMapActivated(true)}
                >
                  {/* Las calles van irregulares a proposito: una grilla de paso
                      fijo lee como papel cuadriculado, que es la huella que
                      esto evita. Las coordenadas son porcentajes del plato. */}
                  <svg
                    className="map-facade-plan"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <g className="map-facade-plan-line" stroke="currentColor" strokeWidth={1}>
                      <line x1="8" y1="0" x2="8" y2="100" />
                      <line x1="39" y1="0" x2="39" y2="100" />
                      <line x1="47" y1="0" x2="47" y2="100" />
                      <line x1="64" y1="0" x2="64" y2="100" />
                      <line x1="81" y1="0" x2="81" y2="100" />
                      <line x1="92" y1="0" x2="92" y2="100" />
                      <line x1="0" y1="11" x2="100" y2="11" />
                      <line x1="0" y1="26" x2="100" y2="26" />
                      <line x1="0" y1="41" x2="100" y2="41" />
                      <line x1="0" y1="58" x2="100" y2="58" />
                    </g>
                    <g className="map-facade-plan-avenue" stroke="currentColor" strokeWidth={2}>
                      <line x1="21" y1="0" x2="21" y2="100" />
                      <line x1="0" y1="79" x2="100" y2="79" />
                    </g>
                    {/* El realce cuelga por debajo del centro del plato porque
                        el bloque de texto tambien: el pin ocupa la parte de
                        arriba. Centrado y redondo dejaba la linea de ayuda
                        sobre la avenida de x=21. */}
                    <radialGradient id="mapFacadePlanFade">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.97" />
                      <stop offset="0.65" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                    <ellipse cx="50" cy="56" rx="62" ry="26" fill="url(#mapFacadePlanFade)" />
                  </svg>
                  <span className="map-facade-stack">
                    <svg
                      className="map-facade-pin"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
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

        /* Facade del mapa. El plano es una abstraccion propia, no una captura
           del render de Google: la imagen de un mapa ajeno no es nuestra para
           publicar, y la Static Maps API pide key y facturacion. Las dos
           avenidas se cruzan abajo a la izquierda, no en el centro: un cruce
           centrado lee como mira telescopica y ademas parte la linea de ayuda
           al medio. El realce radial cierra el svg para que el pin y las dos
           lineas de texto caigan sobre campo limpio. */
        .map-facade {
          --facade-line: var(--color-border);
          --facade-avenue: var(--color-gray-200);

          position: relative;
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
          background: var(--color-gray-50);
        }

        .map-facade-plan {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* preserveAspectRatio none estira los dos ejes por separado, y sin esto
           el mismo trazo sale con distinto grosor en cada uno. */
        .map-facade-plan line {
          vector-effect: non-scaling-stroke;
        }

        /* El hover sigue moviendo las dos custom properties de siempre: los
           grupos las leen por currentColor. */
        .map-facade-plan-line {
          color: var(--facade-line);
        }

        .map-facade-plan-avenue {
          color: var(--facade-avenue);
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
          position: relative;
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
          /* Lo que cambia en hover ahora es el color de los dos grupos del
             plano, no el fondo del boton, asi que la transicion los sigue. */
          .map-facade-plan-line,
          .map-facade-plan-avenue {
            transition: color 200ms ease-out;
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
