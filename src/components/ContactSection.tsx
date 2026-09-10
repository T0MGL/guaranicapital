import { GuaraniForm } from './GuaraniForm';
import { useLanguage } from '../context/LanguageContext';

/* Lo que el visitante quiere de este bloque es llegar, no mirar un mapa: el
   plano ya esta en la tarjeta, asi que el unico control abre las indicaciones
   con la oficina puesta como destino. */
const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Cecilio+Da+Silva+Lovera+1257%2C+Asunci%C3%B3n%2C+Paraguay';

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
            </div>
            <div className="location-map">
              {/* El plano lo dibuja scripts/build-office-map.mjs sobre datos de
                  OpenStreetMap y viaja versionado como SVG, asi que la seccion
                  no le pide un byte a un tercero. */}
              <a
                className="map-open"
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <picture>
                  <source media="(max-width: 768px)" srcSet="/map/office-tall.svg" />
                  {/* alt vacio a proposito: la direccion vive al lado como texto
                      real, y asi el nombre accesible del enlace queda siendo
                      exactamente su etiqueta visible. Sin width ni height: los
                      dos recortes tienen relacion de aspecto distinta y un par
                      fijo le pondria la equivocada a uno de los dos. La caja la
                      define el CSS, asi que no hay salto de layout. */}
                  <img src="/map/office-wide.svg" alt="" loading="lazy" decoding="async" />
                </picture>
                <span className="map-open-label">
                  {t.contact.directionsCta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path
                      d="M7 17L17 7M17 7H7M17 7v10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
              {/* Hermano del enlace, no hijo: un interactivo dentro de otro es
                  markup invalido. La ODbL pide el aviso de procedencia sobre la
                  obra derivada y las pautas de la OSMF piden esta forma exacta,
                  visible y con "OpenStreetMap" enlazado al copyright. Queda en
                  ingles en los tres idiomas porque es la nota de licencia, no
                  copy de interfaz, y el lang lo marca asi para que un lector de
                  pantalla no lo pronuncie en castellano o en portugues. */}
              <p className="map-credit" lang="en">
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  © OpenStreetMap
                </a>
                {' contributors'}
              </p>
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

        /* Sin hover: la tarjeta no es un control, y levantarla prometia un clic que no existe. */
        .location-card {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.94);
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

        .location-map {
          position: relative;
          min-height: 340px;
          /* Que la etiqueta y el aviso choquen depende del ancho del plano, no
             del de la ventana: en desktop el plano es poco mas de la mitad de
             la tarjeta. Por eso el umbral se consulta contra este contenedor. */
          container-type: inline-size;
          container-name: map;
          /* El plano trae tierra propia (#e9ecf0), asi que la tarjeta deja de
             ser blanco sobre blanco y el corte entre las dos mitades pide una
             linea de pelo. */
          border-left: 1px solid var(--color-border);
        }

        .map-open {
          position: absolute;
          inset: 0;
          display: block;
          overflow: hidden;
          /* Las esquinas de la tarjeta que le tocan al plano. Sin esto el anillo
             de foco es un rectangulo y la tarjeta, que recorta, se come sus
             puntas. */
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
        }

        .map-open img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .map-open:focus-visible {
          /* Hacia adentro: el enlace va al ras del borde de la tarjeta, que
             recorta con overflow hidden lo que se dibuje por fuera. */
          outline: 2px solid var(--color-primary-dark);
          outline-offset: -3px;
        }

        .map-open-label {
          position: absolute;
          left: var(--space-md);
          bottom: var(--space-md);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 0.9375rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          background: var(--color-base-white);
          box-shadow: var(--shadow-md);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          white-space: nowrap;
          color: var(--color-primary);
          transition: color 200ms ease, border-color 200ms ease;
        }

        .map-open:hover .map-open-label,
        .map-open:focus-visible .map-open-label {
          color: var(--color-primary-dark);
          border-color: var(--color-gray-200);
        }

        .map-credit {
          position: absolute;
          right: var(--space-md);
          bottom: var(--space-md);
          /* Por encima del enlace, que ocupa el plano entero: debajo, el aviso
             seria texto muerto y su enlace no se podria pulsar. */
          z-index: 2;
          margin: 0;
          padding: 2px 7px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.82);
          font-family: var(--font-body);
          font-size: 0.6875rem;
          line-height: 1.5;
          white-space: nowrap;
          color: var(--color-text-secondary);
        }

        .map-credit a {
          /* A cuerpo 11 el texto solo mide 16px de alto y esta apoyado sobre el
             enlace que cubre todo el plano: errarle por poco abria las
             indicaciones. El padding lleva el blanco a 24px y el margen
             negativo lo devuelve, asi la linea no se mueve. */
          display: inline-block;
          padding: 4px 0;
          margin: -4px 0;
          color: inherit;
          text-decoration: none;
        }

        .map-credit a:hover {
          text-decoration: underline;
        }

        .map-credit a:focus-visible {
          outline: 2px solid var(--color-primary-dark);
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Debajo de este ancho las dos piezas no entran en la misma linea, asi
           que la etiqueta sube una fila. El umbral sale de medir la peor
           combinacion: la etiqueta inglesa contra el aviso completo. */
        @container map (max-width: 440px) {
          .map-open-label {
            bottom: calc(var(--space-md) + 1.875rem);
          }
        }

        /* Solo el desplazamiento entra aca. El cambio de color y de borde queda
           afuera: con movimiento reducido la etiqueta responde igual. */
        @media (prefers-reduced-motion: no-preference) {
          .map-open-label {
            transition: color 200ms ease, border-color 200ms ease,
              transform 200ms cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 200ms cubic-bezier(0.23, 1, 0.32, 1);
          }

          .map-open:focus-visible .map-open-label {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
        }

        /* En tactil el hover queda pegado despues del tap: el visitante vuelve
           de la pestana de indicaciones y la etiqueta sigue levantada. */
        @media (prefers-reduced-motion: no-preference) and (hover: hover) {
          .map-open:hover .map-open-label {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
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
            /* La grilla colapsa a una columna: el corte pasa a ser horizontal. */
            border-left: 0;
            border-top: 1px solid var(--color-border);
          }

          .map-open {
            border-radius: 0 0 var(--radius-lg) var(--radius-lg);
          }
        }
      `}</style>
    </section>
  );
};
