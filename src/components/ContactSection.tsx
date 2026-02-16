import { GuaraniForm } from './GuaraniForm';

export const ContactSection = () => {
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
      `}</style>
    </section>
  );
};
