import { Routes, Route } from 'react-router-dom';
import Login from "./components/auth/login";
import AdminLogin from "./components/auth/AdminLogin";
import ForgotPassword from "./components/auth/ForgotPassword";
import DashboardPage from "./pages/DashboardPage.jsx";
import Customers from "./components/customers/customers";
import CreateCustomer from "./components/customers/CreateCustomer";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/customers" element={<Customers />} />
      <Route path="/admin/create-customer" element={<CreateCustomer />} />
    </Routes>
  );
}
export default App;