import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FormStep as FormStepType } from '../types';

interface FormStepProps {
  step: FormStepType;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
  stepNumber: number;
}

export const FormStep = ({
  step,
  value,
  onChange,
  onNext,
  onBack,
  showBack,
  stepNumber,
}: FormStepProps) => {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setError('');
    setTouched(false);
  }, [step.id]);

  const validateAndNext = () => {
    if (step.required && !value.trim()) {
      setError('Este campo es requerido');
      return;
    }

    if (step.validation) {
      const result = step.validation(value);
      if (result !== true) {
        setError(typeof result === 'string' ? result : 'Valor inválido');
        return;
      }
    }

    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step.type !== 'text') {
      e.preventDefault();
      validateAndNext();
    }
  };

  return (
    <motion.div
      className="form-step"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="step-content">
        <motion.div
          className="step-number"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stepNumber}
        </motion.div>

        <motion.h2
          className="step-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {step.question}
        </motion.h2>

        {step.subtitle && (
          <motion.p
            className="step-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {step.subtitle}
          </motion.p>
        )}

        <motion.div
          className="step-input-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {step.type === 'choice' && step.options ? (
            <div className="choice-grid">
              {step.options.map((option) => (
                <motion.button
                  key={option}
                  className={`choice-button ${value === option ? 'active' : ''}`}
                  onClick={() => {
                    onChange(option);
                    setTimeout(() => validateAndNext(), 300);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="choice-text">{option}</span>
                  <motion.div
                    className="choice-indicator"
                    initial={false}
                    animate={{
                      scale: value === option ? 1 : 0,
                      opacity: value === option ? 1 : 0,
                    }}
                  />
                </motion.button>
              ))}
            </div>
          ) : step.type === 'select' && step.options ? (
            <select
              className="form-select"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setTouched(true)}
              autoFocus
            >
              <option value="">Seleccionar...</option>
              {step.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={step.type}
              className="form-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyPress={handleKeyPress}
              placeholder={step.placeholder}
              autoFocus
            />
          )}

          <AnimatePresence>
            {error && touched && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {step.type !== 'choice' && (
          <motion.div
            className="step-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {showBack && (
              <button className="button-back" onClick={onBack}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Atrás
              </button>
            )}
            <button
              className="button-next"
              onClick={validateAndNext}
              disabled={!value.trim()}
            >
              Continuar
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
        )}

        <motion.p
          className="step-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Presioná <kbd>Enter ↵</kbd> para continuar
        </motion.p>
      </div>

      <style>{`
        .form-step {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl) var(--space-lg);
          min-height: 600px;
        }

        .step-content {
          max-width: 640px;
          width: 100%;
        }

        .step-number {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--space-md);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .step-question {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 600;
          line-height: 1.2;
          color: var(--color-text-primary);
          margin-bottom: var(--space-sm);
        }

        .step-subtitle {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-xl);
        }

        .step-input-container {
          margin-bottom: var(--space-lg);
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: var(--space-md) var(--space-lg);
          font-family: var(--font-body);
          font-size: 1.125rem;
          color: var(--color-text-primary);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
          outline: none;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 4px rgba(103, 61, 230, 0.1);
        }

        .form-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .choice-grid {
          display: grid;
          gap: var(--space-sm);
        }

        .choice-button {
          position: relative;
          padding: var(--space-lg) var(--space-xl);
          text-align: left;
          font-family: var(--font-body);
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--color-text-primary);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
          overflow: hidden;
        }

        .choice-button:hover {
          border-color: var(--color-primary);
          background: var(--color-gray-50);
        }

        .choice-button.active {
          border-color: var(--color-primary);
          background: var(--color-gray-50);
        }

        .choice-text {
          position: relative;
          z-index: 1;
        }

        .choice-indicator {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          width: 24px;
          height: 24px;
          background: var(--color-primary);
          border-radius: 50%;
        }

        .choice-indicator::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 12px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: translate(-50%, -60%) rotate(45deg);
        }

        .error-message {
          margin-top: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          font-size: 0.875rem;
          color: var(--color-alert);
          background: rgba(252, 81, 133, 0.1);
          border-radius: var(--radius-sm);
        }

        .step-actions {
          display: flex;
          gap: var(--space-md);
          align-items: center;
        }

        .button-back,
        .button-next {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-md) var(--space-xl);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
          border: none;
          outline: none;
        }

        .button-back {
          color: var(--color-text-secondary);
          background: transparent;
        }

        .button-back:hover {
          color: var(--color-text-primary);
        }

        .button-next {
          flex: 1;
          justify-content: center;
          color: white;
          background: linear-gradient(
            135deg,
            var(--color-primary) 0%,
            var(--color-primary-dark) 100%
          );
          box-shadow: var(--shadow-md);
        }

        .button-next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .button-next:active:not(:disabled) {
          transform: translateY(0);
        }

        .button-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .step-hint {
          margin-top: var(--space-lg);
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
          text-align: center;
        }

        .step-hint kbd {
          padding: 0.25rem 0.5rem;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          background: var(--color-neutral-light);
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }

        @media (max-width: 768px) {
          .form-step {
            padding: var(--space-xl) var(--space-md);
            min-height: auto; /* Remove fixed height on mobile */
          }

          .step-content {
            padding: var(--space-md) 0;
          }

          .step-question {
            font-size: 1.75rem;
          }

          .step-subtitle {
            font-size: 1rem;
          }

          .form-input,
          .form-select {
            font-size: 16px; /* Prevents zoom on iOS */
            padding: var(--space-md);
            min-height: 48px; /* Better touch target */
          }

          .choice-button {
            font-size: 1rem;
            padding: var(--space-md) var(--space-lg);
            min-height: 56px; /* Better touch target */
          }

          .button-back,
          .button-next {
            min-height: 48px;
            padding: var(--space-md) var(--space-lg);
          }

          .step-hint {
            display: none; /* Hide keyboard hint on mobile */
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .form-step {
            padding: var(--space-md) var(--space-sm);
          }

          .step-question {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
