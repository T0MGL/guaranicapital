import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { FormStateProvider } from './context/FormStateContext';
import { useLenis } from './hooks/useLenis';
import './styles/global.css';

// The CRM is a staff-only route behind a login and carries its own icon set.
// Nothing about the public landing page should be waiting on it to download.
const CRM = lazy(() => import('./pages/CRM').then((m) => ({ default: m.CRM })));

/* The router lives outside this component. There is one document per language
   and each is mounted under its own basename (/ for Spanish, /en, /pt), so the
   route paths below stay language agnostic and the entry that renders this
   tree picks the router: BrowserRouter in the browser, StaticRouter when the
   build prerenders the three documents. */
function App() {
  useLenis();

  return (
    <FormStateProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          <Route path="/crm" element={
            <Suspense fallback={null}>
              <CRM />
            </Suspense>
          } />
        </Routes>
      </div>
    </FormStateProvider>
  );
}

export default App;
