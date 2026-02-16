import { motion } from 'framer-motion';
import type { LeadType } from '../types';

interface FormSuccessProps {
  leadType: LeadType;
  onReset: () => void;
}

export const FormSuccess = ({ leadType, onReset }: FormSuccessProps) => {
  return (
    <motion.div
      className="success-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <motion.div
        className="success-icon"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="var(--color-success)" fillOpacity="0.1" />
          <path
            d="M20 32L28 40L44 24"
            stroke="var(--color-success)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <motion.h2
        className="success-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        ¡Listo! Te contactamos pronto
      </motion.h2>

      <motion.p
        className="success-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Recibimos tu solicitud de{' '}
        <strong>{leadType === 'INVERSION' ? 'inversión' : 'administración'}</strong>.
        <br />
        Respondemos en menos de 24 horas.
      </motion.p>

      <motion.button
        className="success-button"
        onClick={onReset}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Volver al inicio
      </motion.button>

      <style>{`
        .success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-3xl) var(--space-lg);
          min-height: 600px;
        }

        .success-icon {
          margin-bottom: var(--space-lg);
        }

        .success-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          line-height: 1.2;
          color: var(--color-text-primary);
          margin-bottom: var(--space-md);
        }

        .success-description {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          max-width: 500px;
          margin-bottom: var(--space-xl);
        }

        .success-description strong {
          color: var(--color-primary);
          font-weight: 600;
        }

        .success-button {
          padding: var(--space-md) var(--space-xl);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .success-button:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
      `}</style>
    </motion.div>
  );
};
