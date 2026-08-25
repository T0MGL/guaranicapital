export type LeadType = 'INVERSION' | 'ADMINISTRACION';

// The lead sheet groups on this value, so it is stored independently of the
// language the visitor happened to browse in. The union derives from the tuple so
// a value can only be added or renamed in one place. Locale labels are keyed by
// these strings rather than positioned against them, so reordering a translation
// cannot change which bracket a lead lands in.
export const INVESTMENT_BUDGETS = [
  'USD 30.000 a 50.000',
  'USD 50.000 a 100.000',
  'Más de USD 100.000',
] as const;

export type InvestmentBudget = (typeof INVESTMENT_BUDGETS)[number];

export type InvestmentTimeframe =
  | 'De inmediato'
  | 'Próximos 3 meses'
  | 'Solo estoy evaluando';

export type RentalType =
  | 'Renta corta (Airbnb/Booking)'
  | 'No estoy seguro/a';

export type PropertyType =
  | 'Monoambiente'
  | '1 dormitorio'
  | '2 dormitorios'
  | 'Otro';

export type FurnishedStatus =
  | 'Sí'
  | 'No'
  | 'Parcialmente';

export type PublishedStatus =
  | 'Sí'
  | 'No';

export type StartTimeframe =
  | 'Inmediato'
  | 'Estoy evaluando';

export interface InvestmentFormData {
  type: 'INVERSION';
  fullName: string;
  email: string;
  phone: string;
  country: string;
  budget: InvestmentBudget;
  timeframe: InvestmentTimeframe;
  rentalType?: RentalType;
}

export interface ManagementFormData {
  type: 'ADMINISTRACION';
  fullName: string;
  email: string;
  phone: string;
  zone: string;
  propertyType: PropertyType;
  furnished: FurnishedStatus;
  published: PublishedStatus;
  startDate: StartTimeframe;
  photosLink?: string;
}

export type FormData = InvestmentFormData | ManagementFormData;

// A choice carries what the visitor reads and what the CRM stores, separately.
// They are the same string for every step except budget.
export interface FormChoice<V extends string = string> {
  value: V;
  label: string;
}

export interface FormStep {
  id: string;
  question: string;
  subtitle?: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'choice';
  options?: readonly FormChoice[];
  required: boolean;
  placeholder?: string;
  validation?: (value: string) => boolean | string;
}
