import { Routes, Route } from 'react-router-dom';
import { Login, AdminLogin, ForgotPassword, ProtectedRoute } from "./features/auth/components";
import DashboardPage from "./pages/DashboardPage";
import { LoanPage, CreateLoan, ViewLoan } from "./features/loan/components";
import { Customers, CreateCustomer, EditCustomer } from "./features/customer/components";
import { Vehicle, EditVehicle, AddVehicle } from "./features/vehicle/components";
import { Reports } from "./features/reports/components";
import { Payment } from "./features/payment/components";
import { Settings } from "./features/settings/components";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/customers" element={<Customers />} />
      <Route path="/admin/create-customer" element={<CreateCustomer />} />
      <Route path="/admin/customers/create" element={<CreateCustomer />} />
      <Route path="/admin/customers/:customerId/edit" element={<EditCustomer />} />
      <Route path="/admin/loans" element={<LoanPage />} />
      <Route path="/admin/create-loan" element={<CreateLoan />} />
      <Route path="/admin/loans/create" element={<CreateLoan />} />
      <Route path="/admin/loans/:loanId" element={<ViewLoan />} />
      <Route path="/admin/vehicles" element={<Vehicle />} />
      <Route path="/admin/vehicles/add" element={<AddVehicle />} />
      <Route path="/admin/vehicles/:vehicleId/edit" element={<EditVehicle />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/payments/:loanId" element={<Payment />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;