// This makes process.env available in the browser
const process = { env: { NODE_ENV: 'development' } };

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Login, AdminLogin, ForgotPassword, ProtectedRoute } from "./features/auth/components";
import DashboardPage from "./pages/DashboardPage";
import { LoanPage, CreateLoan, ViewLoan } from "./features/loan/components";
import { Customers, CreateCustomer, EditCustomer } from "./features/customer/components";
import { Vehicle, EditVehicle, AddVehicle } from "./features/vehicle/components";
import { Reports } from "./features/reports/components";
import { Payment } from "./features/payment/components";
import { Settings } from "./features/settings/components";
import { setupAuthHeaders, isAuthenticated } from './utils/api/auth';

// Debug component to track auth state
const AuthDebug = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('adminToken'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        <div>Auth Token: {token ? 'Present' : 'Missing'}</div>
        <div>isAuthenticated:'Yes' {/*{isAuthenticated() ? 'Yes' : 'No'*/}</div>
      </div>
    );
  }
  return null;
};

function App() {
  // Initialize auth headers on app load
  useEffect(() => {
    console.log('App mounted, setting up auth headers');
    setupAuthHeaders();
    
    // Log auth state on mount
    console.log('Initial auth state:', {
      hasToken: !!localStorage.getItem('adminToken'),
      isAuthenticated: isAuthenticated()
    });
  }, []);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/admin" element={<AdminLogin />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/create" element={<CreateCustomer />} />
          <Route path="/customers/:customerId/edit" element={<EditCustomer />} />
          <Route path="/loans" element={<LoanPage />} />
          <Route path="/loans/create" element={<CreateLoan />} />
          <Route path="/loans/:loanId" element={<ViewLoan />} />
          <Route path="/vehicles" element={<Vehicle />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          <Route path="/vehicles/:vehicleId/edit" element={<EditVehicle />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payments/:loanId" element={<Payment />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<Login />} />
      </Routes>
      <AuthDebug />
    </>
  );
}

export default App;