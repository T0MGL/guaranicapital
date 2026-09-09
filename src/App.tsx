import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { FormStateProvider } from './context/FormStateContext';
import { useLenis } from './hooks/useLenis';
import './styles/global.css';

// The CRM is a staff-only route behind a login and carries its own icon set.
// Nothing about the public landing page should be waiting on it to download.
const CRM = lazy(() => import('./pages/CRM').then((m) => ({ default: m.CRM })));

function App() {
  useLenis();

  return (
    <FormStateProvider>
      <Router>
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
      </Router>
    </FormStateProvider>
  );
}

export default App;
