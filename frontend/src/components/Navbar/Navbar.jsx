import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/motocredit-logo.png';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/customers', label: 'Customers' },
    { path: '/admin/loans', label: 'Loans' },
    { path: '/admin/vehicles', label: 'Vehicles' },
    { path: '/admin/reports', label: 'Reports' },
    { path: '/admin/settings', label: 'Settings' }
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] px-10 py-3">
      {/* Logo Section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#0e141b]">
          <img src={logo} alt="MotoCredit logo" className="h-10 w-10" />
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">MotoCredit</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right Section - Profile */}
      <div className="flex items-center gap-8">
        <div className="relative">
          <div
            className="aspect-square size-10 rounded-full bg-center bg-cover bg-no-repeat cursor-pointer border-2 border-slate-200 hover:border-blue-400 transition"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqqDd8lRt8um7x-iQsfUULf2Tkv1q-TLO9vhqiZ9oZeZ9_dqi8cBgreXbFI1eu6VpIDlOb7NC86jX1BFkFQVw3k_Cdg9CEetu_srDBE6c8Vg8_fSadRdvn02G0YpcpXs5muh0STp_337eQMF9o291kkb-zg2U_uGmSekyKrpphvkV9imP2PtKbQtls93erFBTIteAZzhk5nHhVTyHTFWTgUv58NwltR1mq7zAAT18wIXlMVmahY3M4i7yrwX6dm4WyWv65aoMJSY0")',
            }}
            onClick={() => setDropdownOpen((v) => !v)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg border z-50 animate-fade-in">
              <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100">
                Profile
              </button>
              <button className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 