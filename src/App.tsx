import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PropertyPortfolio } from './components/PropertyPortfolio';
import { Services } from './components/Services';
import { NewsInsights } from './components/NewsInsights';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { FormStateProvider } from './context/FormStateContext';
import { useLenis } from './hooks/useLenis';
import './styles/global.css';

function App() {
  useLenis();

  return (
    <FormStateProvider>
      <div className="app">
        <Navbar />
        <Hero />
        <WhyChooseUs />
        <PropertyPortfolio />
        <Services />
        <NewsInsights />
        <ContactSection />
        <Footer />
        <WhatsAppButton />
      </div>
    </FormStateProvider>
  );
}

export default App;
