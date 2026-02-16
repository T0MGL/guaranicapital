import { createContext, useContext, useState, ReactNode } from 'react';

type FormState = 'selection' | 'form' | 'success';

interface FormStateContextType {
  formState: FormState;
  setFormState: (state: FormState) => void;
}

const FormStateContext = createContext<FormStateContextType | undefined>(undefined);

export const FormStateProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<FormState>('selection');

  return (
    <FormStateContext.Provider value={{ formState, setFormState }}>
      {children}
    </FormStateContext.Provider>
  );
};

export const useFormState = () => {
  const context = useContext(FormStateContext);
  if (context === undefined) {
    throw new Error('useFormState must be used within a FormStateProvider');
  }
  return context;
};
