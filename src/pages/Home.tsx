import { Hero } from '../components/Hero';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { PropertyPortfolio } from '../components/PropertyPortfolio';
import { Services } from '../components/Services';
import { NewsInsights } from '../components/NewsInsights';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { FormStateProvider } from '../context/FormStateContext';

export function Home() {
  return (
    <FormStateProvider>
      <Hero />
      <WhyChooseUs />
      <PropertyPortfolio />
      <Services />
      <NewsInsights />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </FormStateProvider>
  );
}
