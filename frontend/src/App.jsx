import { Routes, Route } from 'react-router-dom';
import Login from "./components/Auth/Login";
import AdminLogin from "./components/Auth/AdminLogin";
import ForgotPassword from "./components/Auth/ForgotPassword";
import DashboardPage from "./pages/DashboardPage";
import LoanPage from "./components/loan/loan";
import Customers from "./components/customers/customers";
import CreateCustomer from "./components/customers/CreateCustomer";
import Vehicle from "./components/vehicle/Vehicle";
import Reports from "./components/reports/Reports";
import AddVehicle from "./components/vehicle/AddVehicle";
import CreateLoan from "./components/loan/createloan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/customers" element={<Customers />} />
      <Route path="/admin/loans" element={<LoanPage />} />
      <Route path="/admin/loans/create" element={<CreateLoan />} />
      <Route path="/admin/vehicles" element={<Vehicle />} />
      <Route path="/admin/vehicles/create" element={<AddVehicle />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/create-customer" element={<CreateCustomer />} />
    </Routes>
  );
}

export default App;