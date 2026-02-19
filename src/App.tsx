import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CRM } from './pages/CRM';
import { Navbar } from './components/Navbar';
import { FormStateProvider } from './context/FormStateContext';
import { useLenis } from './hooks/useLenis';
import './styles/global.css';

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
            <Route path="/crm" element={<CRM />} />
          </Routes>
        </div>
      </Router>
    </FormStateProvider>
  );
}

export default App;
