import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaPhone, FaUser } from 'react-icons/fa';
import logo from '../src/assets/motocredit-logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/customers/dashboard', label: 'Dashboard' },
    { path: '/customers/customers', label: 'Customers' },
    { path: '/customers/payment-history', label: 'Payment History' },
    { path: '/customers/vehicles', label: 'Vehicles' },
    { path: '/customers/settings', label: 'Settings' }
  ];

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="MotoCredit" className="h-10 w-10" />
          <span className="text-xl font-semibold">MotoCredit</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <li
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded-md transition ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>

        {/* Profile + Hamburger */}
        <div className="flex items-center gap-4">
          {/* Profile */}
          <div className="relative">
            <div
              className="h-10 w-10 rounded-full bg-center bg-cover border-2 border-gray-300 hover:border-blue-500 cursor-pointer"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqqDd8lRt8um7x-iQsfUULf2Tkv1q-TLO9vhqiZ9oZeZ9_dqi8cBgreXbFI1eu6VpIDlOb7NC86jX1BFkFQVw3k_Cdg9CEetu_srDBE6c8Vg8_fSadRdvn02G0YpcpXs5muh0STp_337eQMF9o291kkb-zg2U_uGmSekyKrpphvkV9imP2PtKbQtls93erFBTIteAZzhk5nHhVTyHTFWTgUv58NwltR1mq7zAAT18wIXlMVmahY3M4i7yrwX6dm4WyWv65aoMJSY0")',
              }}
              onClick={() => setDropdownOpen((v) => !v)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 text-sm">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-left ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
