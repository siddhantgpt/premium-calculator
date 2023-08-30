import './App.css';
import AppContent from './components/AppContent';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Switch, Routes, useNavigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { useEffect } from 'react';
import Auth from './components/Auth';

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/auth/login')
    }
  }, [location.pathname])

  return (
    <div className="App">
      <Header/>
        <Routes>       
          <Route path="/auth/*" element={<Auth />} />
          <Route path="/app/*" element={<AppContent />} />
        </Routes>
    </div>
  );
}
export default App;
