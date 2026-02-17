import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">
          {current} de {total}
        </span>
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </div>
      <style>{`
        .progress-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--color-surface);
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--color-border);
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xs);
        }

        .progress-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          letter-spacing: 0.02em;
        }

        .progress-track {
          height: 3px;
          background: var(--color-neutral-light);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--color-primary) 0%,
            var(--color-secondary) 100%
          );
          border-radius: var(--radius-full);
        }

        @media (max-width: 768px) {
          .progress-container {
            padding: var(--space-sm) var(--space-md);
          }

          .progress-text {
            font-size: 0.8125rem;
          }

          .progress-track {
            height: 4px; /* Slightly thicker for better visibility on mobile */
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .progress-container {
            padding: var(--space-xs) var(--space-sm);
          }

          .progress-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};
