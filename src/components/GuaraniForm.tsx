import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormStep } from './FormStep';
import { ProgressBar } from './ProgressBar';
import { FormSuccess } from './FormSuccess';
import { useFormState } from '../context/FormStateContext';
import { useLanguage } from '../context/LanguageContext';
import type { LeadType, FormStep as FormStepType } from '../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s+()-]+$/;

export const GuaraniForm = () => {
  const { formState, setFormState } = useFormState();
  const { t } = useLanguage();
  const f = t.form;
  const [leadType, setLeadType] = useState<LeadType | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const investmentSteps: FormStepType[] = [
    {
      id: 'fullName',
      question: f.investment.fullName.question,
      type: 'text',
      required: true,
      placeholder: f.investment.fullName.placeholder,
    },
    {
      id: 'email',
      question: f.investment.email.question,
      type: 'email',
      required: true,
      placeholder: f.investment.email.placeholder,
      validation: (value) =>
        emailRegex.test(value) || f.ui.emailInvalid,
    },
    {
      id: 'phone',
      question: f.investment.phone.question,
      subtitle: f.investment.phone.subtitle,
      type: 'tel',
      required: true,
      placeholder: f.investment.phone.placeholder,
      validation: (value) =>
        phoneRegex.test(value) || f.ui.phoneInvalid,
    },
    {
      id: 'country',
      question: f.investment.country.question,
      type: 'text',
      required: true,
      placeholder: f.investment.country.placeholder,
    },
    {
      id: 'budget',
      question: f.investment.budget.question,
      type: 'choice',
      required: true,
      options: f.investment.budget.options,
    },
    {
      id: 'timeframe',
      question: f.investment.timeframe.question,
      type: 'choice',
      required: true,
      options: f.investment.timeframe.options,
    },
    {
      id: 'rentalType',
      question: f.investment.rentalType.question,
      subtitle: f.investment.rentalType.subtitle,
      type: 'choice',
      required: false,
      options: f.investment.rentalType.options,
    },
  ];

  const managementSteps: FormStepType[] = [
    {
      id: 'fullName',
      question: f.management.fullName.question,
      type: 'text',
      required: true,
      placeholder: f.management.fullName.placeholder,
    },
    {
      id: 'email',
      question: f.management.email.question,
      type: 'email',
      required: true,
      placeholder: f.management.email.placeholder,
      validation: (value) =>
        emailRegex.test(value) || f.ui.emailInvalid,
    },
    {
      id: 'phone',
      question: f.management.phone.question,
      subtitle: f.management.phone.subtitle,
      type: 'tel',
      required: true,
      placeholder: f.management.phone.placeholder,
      validation: (value) =>
        phoneRegex.test(value) || f.ui.phoneInvalid,
    },
    {
      id: 'zone',
      question: f.management.zone.question,
      type: 'text',
      required: true,
      placeholder: f.management.zone.placeholder,
    },
    {
      id: 'propertyType',
      question: f.management.propertyType.question,
      type: 'choice',
      required: true,
      options: f.management.propertyType.options,
    },
    {
      id: 'furnished',
      question: f.management.furnished.question,
      type: 'choice',
      required: true,
      options: f.management.furnished.options,
    },
    {
      id: 'published',
      question: f.management.published.question,
      type: 'choice',
      required: true,
      options: f.management.published.options,
    },
    {
      id: 'startDate',
      question: f.management.startDate.question,
      type: 'choice',
      required: true,
      options: f.management.startDate.options,
    },
    {
      id: 'photosLink',
      question: f.management.photosLink.question,
      subtitle: f.management.photosLink.subtitle,
      type: 'text',
      required: false,
      placeholder: f.management.photosLink.placeholder,
    },
  ];

  const steps = leadType === 'INVERSION' ? investmentSteps : managementSteps;
  const currentStep = steps[currentStepIndex];

  const handleLeadTypeSelection = (type: LeadType) => {
    setLeadType(type);
    setFormState('form');
    setCurrentStepIndex(0);
    setFormData({});

    // Scroll to the top of the form container to avoid jumping to footer
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Show success immediately — don't block UX on API response
    setFormState('success');

    // Capture current data before any state reset
    const snapshot = { ...formData };
    const snapshotLeadType = leadType;

    // Fire CRM submission in background
    (async () => {
      try {
        const { createLead } = await import('../lib/api');

        const mappedLead = {
          id: crypto.randomUUID(),
          Fecha: new Date().toLocaleString('es-PY'),
          Nombre: snapshot.fullName || '',
          Whatsapp: snapshot.phone || '',
          Email: snapshot.email || '',
          Ubicacion: snapshot.country || snapshot.zone || '',
          Presupuesto: snapshot.budget || '',
          Tipo: snapshot.propertyType || snapshot.rentalType || '',
          Interes: snapshotLeadType || '',
          Fuente: 'Landing Page Form',
          Detalles: [
            snapshot.timeframe ? `Plazo: ${snapshot.timeframe}` : '',
            snapshot.furnished ? `Amoblado: ${snapshot.furnished}` : '',
            snapshot.published ? `Publicado: ${snapshot.published}` : '',
            snapshot.startDate ? `Inicio: ${snapshot.startDate}` : '',
            snapshot.photosLink ? `Fotos: ${snapshot.photosLink}` : ''
          ].filter(Boolean).join(' | '),
          contacted: false,
          converted: false,
          lost: false
        };

        await createLead(mappedLead);
      } catch (e) {
        console.error('Failed to submit lead to CRM:', e);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const handleReset = () => {
    setFormState('selection');
    setLeadType(null);
    setCurrentStepIndex(0);
    setFormData({});
  };

  return (
    <div className="guarani-form" ref={formContainerRef}>
      <AnimatePresence mode="wait">
        {formState === 'selection' && (
          <motion.div
            key="selection"
            className="selection-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="selection-content">
              <motion.div
                className="selection-header"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="selection-title">
                  {f.selection.title}
                </h1>
                <p className="selection-subtitle">
                  {f.selection.subtitle}
                </p>
              </motion.div>

              <motion.div
                className="selection-question"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {f.selection.question}
              </motion.div>

              <motion.div
                className="selection-buttons"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.button
                  className="selection-button"
                  onClick={() => handleLeadTypeSelection('INVERSION')}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="button-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M6 24L12 18L18 22L26 14"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 14H26V18"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="16"
                        cy="8"
                        r="2"
                        fill="currentColor"
                      />
                      <circle
                        cx="22"
                        cy="6"
                        r="1.5"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="button-content">
                    <h3 className="button-title">{f.selection.investTitle}</h3>
                    <p className="button-description">
                      {f.selection.investDescription}
                    </p>
                  </div>
                  <div className="button-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.button>

                <motion.button
                  className="selection-button"
                  onClick={() => handleLeadTypeSelection('ADMINISTRACION')}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="button-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect
                        x="6"
                        y="6"
                        width="20"
                        height="20"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M6 12H26"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 6V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M20 6V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="button-content">
                    <h3 className="button-title">{f.selection.managementTitle}</h3>
                    <p className="button-description">
                      {f.selection.managementDescription}
                    </p>
                  </div>
                  <div className="button-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.button>
              </motion.div>

              <motion.p
                className="selection-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {f.selection.footer}
              </motion.p>
            </div>
          </motion.div>
        )}

        {formState === 'form' && currentStep && (
          <>
            <motion.button
              className="reset-selection-button"
              onClick={handleReset}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ x: -4 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {f.selection.changeSelection}
            </motion.button>
            <ProgressBar
              current={currentStepIndex + 1}
              total={steps.length}
            />
            <FormStep
              key={currentStep.id}
              step={currentStep}
              value={formData[currentStep.id] || ''}
              onChange={(value) =>
                setFormData({ ...formData, [currentStep.id]: value })
              }
              onNext={handleNext}
              onBack={handleBack}
              showBack={currentStepIndex > 0}
              stepNumber={currentStepIndex + 1}
            />
          </>
        )}

        {formState === 'success' && leadType && (
          <FormSuccess leadType={leadType} onReset={handleReset} />
        )}
      </AnimatePresence>

      <style>{`
        .guarani-form {
          background: transparent;
          padding: var(--space-3xl) 0;
        }

        .selection-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl) var(--space-lg);
        }

        .selection-content {
          max-width: 800px;
          width: 100%;
        }

        .selection-header {
          text-align: center;
          margin-bottom: var(--space-3xl);
        }

        .selection-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 600;
          line-height: 1.1;
          color: var(--color-text-primary);
          margin-bottom: var(--space-md);
        }

        .selection-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .selection-question {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 600;
          text-align: center;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xl);
        }

        .selection-buttons {
          display: grid;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .selection-button {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-xl);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: left;
        }

        .selection-button:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);
        }

        .button-icon {
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-50);
          color: var(--color-primary);
          border-radius: var(--radius-md);
        }

        .button-content {
          flex: 1;
        }

        .button-title {
          font-family: var(--font-body);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xs);
        }

        .button-description {
          font-size: 1rem;
          line-height: 1.5;
          color: var(--color-text-secondary);
        }

        .button-arrow {
          flex-shrink: 0;
          color: var(--color-text-tertiary);
          transition: transform var(--transition-base);
        }

        .selection-button:hover .button-arrow {
          transform: translateX(4px);
        }

        .selection-footer {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
          padding: var(--space-md);
          background: var(--color-gray-50);
          border-radius: var(--radius-md);
        }

        .reset-selection-button {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          margin: var(--space-lg) auto 0;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }

        .reset-selection-button:hover {
          color: var(--color-text-primary);
          border-color: var(--color-primary);
          background: var(--color-gray-50);
        }

        .reset-selection-button svg {
          transition: transform var(--transition-base);
        }

        .reset-selection-button:hover svg {
          transform: translateX(-2px);
        }

        @media (max-width: 768px) {
          .guarani-form {
            padding: var(--space-2xl) 0;
          }

          .selection-screen {
            padding: var(--space-xl) var(--space-md);
          }

          .selection-header {
            margin-bottom: var(--space-xl);
          }

          .selection-title {
            font-size: 2rem;
          }

          .selection-button {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: var(--space-lg);
            min-height: auto;
            gap: var(--space-md);
          }

          .button-icon {
            width: 56px;
            height: 56px;
          }

          .button-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-xs);
          }

          .button-title {
            font-size: 1.25rem;
          }

          .button-description {
            font-size: 0.9375rem;
            text-align: center;
          }

          .button-arrow {
            display: none;
          }
        }

        /* Extra small devices */
        @media (max-width: 375px) {
          .selection-screen {
            padding: var(--space-md);
          }

          .selection-title {
            font-size: 1.75rem;
          }

          .selection-subtitle {
            font-size: 1rem;
          }

          .selection-question {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};
