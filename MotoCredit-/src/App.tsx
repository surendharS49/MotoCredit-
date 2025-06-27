import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Customers from './components/customer/Customers';
import Vehicles from './components/vehicle/Vehicles';
import Loans from './components/loan/Loans';
import EMITracking from './components/emi/EMITracking';
import Documents from './components/documents/Documents';
import Settings from './components/layout/Settings';
import NotFound from './components/layout/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Check theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Router>
      <div className={theme}>
        <Toaster position="top-right" />
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          
          {/* Protected Routes */}
          {isAuthenticated ? (
            <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers/*" element={<Customers />} />
              <Route path="/vehicles/*" element={<Vehicles />} />
              <Route path="/loans/*" element={<Loans />} />
              <Route path="/emi-tracking/*" element={<EMITracking />} />
              <Route path="/documents/*" element={<Documents />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 