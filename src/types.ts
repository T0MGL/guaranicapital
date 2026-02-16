export type LeadType = 'INVERSION' | 'ADMINISTRACION';

export type InvestmentBudget =
  | 'USD 30.000–50.000'
  | 'USD 50.000–100.000'
  | 'Más de USD 100.000';

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

export interface FormStep {
  id: string;
  question: string;
  subtitle?: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'choice';
  options?: string[];
  required: boolean;
  placeholder?: string;
  validation?: (value: string) => boolean | string;
}
