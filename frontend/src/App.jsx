import { Routes, Route } from 'react-router-dom';
import Login from "./components/auth/Login";
import AdminLogin from "./components/auth/AdminLogin";
import ForgotPassword from "./components/auth/ForgotPassword";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
export default App;