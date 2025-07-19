// This makes process.env available in the browser
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Login, AdminLogin, ForgotPassword, ProtectedRoute } from "./features/auth/components";
import DashboardPage from "./pages/DashboardPage";
import { LoanPage, CreateLoan, ViewLoan } from "./features/loan/components";
import { Customers, CreateCustomer, EditCustomer } from "./features/customer/components";
import { Vehicle, EditVehicle, AddVehicle } from "./features/vehicle/components";
import { Reports } from "./features/reports/components";
import { Payment } from "./features/payment/components";
import { Settings } from "./features/settings/components";
import { setupAuthHeaders, isAuthenticated } from './utils/api/auth';

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
    </>
  );
}

export default App;