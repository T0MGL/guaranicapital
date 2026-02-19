import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CRM } from './pages/CRM';
import { Navbar } from './components/Navbar';
import { useLenis } from './hooks/useLenis';
import './styles/global.css';

function App() {
  useLenis();

  return (
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
  );
}

export default App;
