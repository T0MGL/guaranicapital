import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormStep } from './FormStep';
import { ProgressBar } from './ProgressBar';
import { FormSuccess } from './FormSuccess';
import { useFormState } from '../context/FormStateContext';
import type { LeadType, FormStep as FormStepType } from '../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s+()-]+$/;

export const GuaraniForm = () => {
  const { formState, setFormState } = useFormState();
  const [leadType, setLeadType] = useState<LeadType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const investmentSteps: FormStepType[] = [
    {
      id: 'fullName',
      question: '¿Cuál es tu nombre completo?',
      type: 'text',
      required: true,
      placeholder: 'Juan Pérez',
    },
    {
      id: 'email',
      question: '¿Cuál es tu email?',
      type: 'email',
      required: true,
      placeholder: 'juan@ejemplo.com',
      validation: (value) =>
        emailRegex.test(value) || 'Por favor ingresá un email válido',
    },
    {
      id: 'phone',
      question: '¿Cuál es tu número de WhatsApp?',
      subtitle: 'Incluí el código de país',
      type: 'tel',
      required: true,
      placeholder: '+595 991 899050',
      validation: (value) =>
        phoneRegex.test(value) || 'Por favor ingresá un número válido',
    },
    {
      id: 'country',
      question: '¿Desde qué país nos contactás?',
      type: 'text',
      required: true,
      placeholder: 'Paraguay',
    },
    {
      id: 'budget',
      question: '¿Cuál es tu presupuesto aproximado?',
      type: 'choice',
      required: true,
      options: [
        'USD 30.000–50.000',
        'USD 50.000–100.000',
        'Más de USD 100.000',
      ],
    },
    {
      id: 'timeframe',
      question: '¿Cuándo estás pensando invertir?',
      type: 'choice',
      required: true,
      options: ['De inmediato', 'Próximos 3 meses', 'Solo estoy evaluando'],
    },
    {
      id: 'rentalType',
      question: '¿Qué tipo de renta te interesa?',
      subtitle: 'Este campo es opcional',
      type: 'choice',
      required: false,
      options: ['Renta corta (Airbnb/Booking)', 'No estoy seguro/a'],
    },
  ];

  const managementSteps: FormStepType[] = [
    {
      id: 'fullName',
      question: '¿Cuál es tu nombre completo?',
      type: 'text',
      required: true,
      placeholder: 'Juan Pérez',
    },
    {
      id: 'email',
      question: '¿Cuál es tu email?',
      type: 'email',
      required: true,
      placeholder: 'juan@ejemplo.com',
      validation: (value) =>
        emailRegex.test(value) || 'Por favor ingresá un email válido',
    },
    {
      id: 'phone',
      question: '¿Cuál es tu número de WhatsApp?',
      subtitle: 'Incluí el código de país',
      type: 'tel',
      required: true,
      placeholder: '+595 991 899050',
      validation: (value) =>
        phoneRegex.test(value) || 'Por favor ingresá un número válido',
    },
    {
      id: 'zone',
      question: '¿En qué zona o edificio está tu propiedad?',
      type: 'text',
      required: true,
      placeholder: 'Ej: Villa Morra, Torre Champagne',
    },
    {
      id: 'propertyType',
      question: '¿Qué tipo de propiedad es?',
      type: 'choice',
      required: true,
      options: ['Monoambiente', '1 dormitorio', '2 dormitorios', 'Otro'],
    },
    {
      id: 'furnished',
      question: '¿Está amoblado?',
      type: 'choice',
      required: true,
      options: ['Sí', 'No', 'Parcialmente'],
    },
    {
      id: 'published',
      question: '¿Ya está publicado en Airbnb o Booking?',
      type: 'choice',
      required: true,
      options: ['Sí', 'No'],
    },
    {
      id: 'startDate',
      question: '¿Desde cuándo te gustaría empezar?',
      type: 'choice',
      required: true,
      options: ['Inmediato', 'Estoy evaluando'],
    },
    {
      id: 'photosLink',
      question: '¿Tenés fotos de la propiedad?',
      subtitle: 'Podés compartir un link a Google Drive o similar (opcional)',
      type: 'text',
      required: false,
      placeholder: 'https://drive.google.com/...',
    },
  ];

  const steps = leadType === 'INVERSION' ? investmentSteps : managementSteps;
  const currentStep = steps[currentStepIndex];

  const handleLeadTypeSelection = (type: LeadType) => {
    setLeadType(type);
    setFormState('form');
    setCurrentStepIndex(0);
    setFormData({});
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

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
      leadType,
      timestamp: new Date().toISOString(),
    };

    console.log('Form submitted:', submitData);

    // Aquí iría la lógica de envío real (email, CRM, etc.)
    // Por ahora solo simulamos el envío

    setFormState('success');
  };

  const handleReset = () => {
    setFormState('selection');
    setLeadType(null);
    setCurrentStepIndex(0);
    setFormData({});
  };

  return (
    <div className="guarani-form">
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
                  Schedule a free consultation
                </h1>
                <p className="selection-subtitle">
                  Tell us about your case and we'll send you a simulation at no cost.
                </p>
              </motion.div>

              <motion.div
                className="selection-question"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                How can we help you?
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
                    <h3 className="button-title">I want to invest</h3>
                    <p className="button-description">
                      You're looking to buy an apartment for Airbnb-style rental
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
                    <h3 className="button-title">I want management</h3>
                    <p className="button-description">
                      You already have an apartment and want us to manage it
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
                We respond in less than 24 hours
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
              Cambiar selección
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
