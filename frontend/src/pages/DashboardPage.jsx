import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './dashboard.css';
import { Link } from 'react-router-dom';
import logo from '../assets/motocredit-logo.png';
import { FaUsers, FaMoneyCheckAlt, FaWallet, FaExclamationCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Customers from '../components/customers/customers';
import Navbar from '../components/Navbar/Navbar';

const adminName = () => {
  const admin = localStorage.getItem('user');
  return admin ? JSON.parse(admin).name : '';
};

const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [totalDisbursedAmount, setTotalDisbursedAmount] = useState(0);
  const [overdueEmis, setOverdueEmis] = useState(0);
  const [adminName, setAdminName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);
  const [loanCount, setLoanCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const admin = localStorage.getItem('user');
    setAdminName(admin ? JSON.parse(admin).name : '');
  }, []);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/customers');
        const data = await response.json();
        setCustomerCount(data.length);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomerCount(0);
      }
    };

    fetchCustomerCount();
  }, []);

  useEffect(() => {
    const fetchLoanCount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/loans');
        const data = await response.json();
        setLoanCount(data.length);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoanCount(0);
      }
    };

    fetchLoanCount(); 
  }, []);

  const kpiData = [
    {
      label: 'Total Customers',
      value: customerCount,
      icon: <FaUsers size={28} className="text-blue-500" />,
      gradient: 'from-blue-100 to-blue-50',
    },
    {
      label: 'Active Loans',
      value: loanCount,
      icon: <FaWallet size={28} className="text-green-500" />,
      gradient: 'from-green-100 to-green-50',
    },
    {
      label: 'Total Disbursed Amount',
      value: '$5,500,000',
      icon: <FaMoneyCheckAlt size={28} className="text-purple-500" />,
      gradient: 'from-purple-100 to-purple-50',
    },
    {
      label: 'Overdue EMIs',
      value: '32',
      icon: <FaExclamationCircle size={28} className="text-red-500" />,
      gradient: 'from-red-100 to-red-50',
    },
  ];

  const emiData = [
    { month: 'Jan', value: 5000 },
    { month: 'Feb', value: 6000 },
    { month: 'Mar', value: 10000 },
    { month: 'Apr', value: 3000 },
    { month: 'May', value: 9000 },
    { month: 'Jun', value: 4000 },
    { month: 'Jul', value: 7000 },
    { month: 'Aug', value: 8000 },
  ];

  const allLoans = [
    {
      id: 'LN00123',
      name: 'Emily Carter',
      amount: '$10,000',
      date: '2023-08-15',
      status: 'Active',
    },
    {
      id: 'LN00124',
      name: 'David Lee',
      amount: '$5,000',
      date: '2023-09-01',
      status: 'Paid',
    },
    {
      id: 'LN00125',
      name: 'Olivia Brown',
      amount: '$7,500',
      date: '2023-09-15',
      status: 'Active',
    },
    {
      id: 'LN00126',
      name: 'Ethan Clark',
      amount: '$12,000',
      date: '2023-10-01',
      status: 'Active',
    },
    {
      id: 'LN00127',
      name: 'Sophia Green',
      amount: '$8,000',
      date: '2023-10-15',
      status: 'Paid',
    },
  ];

  const statusColors = {
    Paid: 'bg-green-100 text-green-700',
    Active: 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
  };

  const filteredLoans = allLoans.filter(
    (loan) =>
      loan.id.toLowerCase().includes(search.toLowerCase()) ||
      loan.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        {/* Main content */}
        <div className="p-8">
          <div className="layout-content-container container mx-auto flex flex-1 flex-col">
            {/* Dashboard content */}
            <>
              {/* Greeting */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="min-w-72 text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">
                  {adminName ? `Welcome back, ${adminName}` : "Welcome back,"}
                </p>
              </div>

                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
                  {kpiData.map((kpi) => (
                    <div
                      key={kpi.label}
                      className={`flex flex-col gap-2 rounded-xl bg-gradient-to-br ${kpi.gradient} p-6 shadow-md border border-slate-200 hover:shadow-lg transition`}
                    >
                      <div className="flex items-center gap-3">
                        {kpi.icon}
                        <p className="text-base font-medium leading-normal text-[#0e141b]">{kpi.label}</p>
                      </div>
                      <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                {/* EMI Due chart */}
                <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#0e141b]">
                  EMI Due
                </h2>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                  <div className="flex min-w-72 flex-1 flex-col gap-2">
                    <p className="text-base font-medium leading-normal text-[#0e141b]">EMI Due</p>
                    <p className="truncate text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">12,500</p>
                    <div className="flex gap-1">
                      <p className="text-base font-normal leading-normal text-[#4e7097]">This Month</p>
                      <p className="text-base font-medium leading-normal text-[#07883b]">+5%</p>
                    </div>
                    <div className="w-full h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={emiData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4e7097" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Loans table */}
                <h2 className="px-4 pb-3 pt-5 text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#0e141b]">
                  Recent Loans
                </h2>
                <div className="px-4 py-3 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Search by Loan ID or Customer Name..."
                    className="mb-2 w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                    <table className="recent-loans-table flex-1">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="w-[200px] px-4 py-3 text-left text-sm font-medium leading-normal text-[#0e141b]">
                            Loan ID
                          </th>
                          <th className="w-[200px] px-4 py-3 text-left text-sm font-medium leading-normal text-[#0e141b]">
                            Customer Name
                          </th>
                          <th className="w-[200px] px-4 py-3 text-left text-sm font-medium leading-normal text-[#0e141b]">
                            Loan Amount
                          </th>
                          <th className="w-[200px] px-4 py-3 text-left text-sm font-medium leading-normal text-[#0e141b]">
                            Disbursed Date
                          </th>
                          <th className="w-60 px-4 py-3 text-left text-sm font-medium leading-normal text-[#0e141b]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLoans.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-6 text-slate-400">No loans found.</td>
                          </tr>
                        ) : (
                          filteredLoans.map((loan) => (
                            <tr key={loan.id} className="border-t border-t-[#d0dbe7]">
                              <td className="w-[200px] px-4 py-2 text-sm font-normal leading-normal text-[#4e7097]">
                                {loan.id}
                              </td>
                              <td className="w-[200px] px-4 py-2 text-sm font-normal leading-normal text-[#0e141b]">
                                {loan.name}
                              </td>
                              <td className="w-[200px] px-4 py-2 text-sm font-normal leading-normal text-[#4e7097]">
                                {loan.amount}
                              </td>
                              <td className="w-[200px] px-4 py-2 text-sm font-normal leading-normal text-[#4e7097]">
                                {loan.date}
                              </td>
                              <td className="w-60 px-4 py-2 text-sm font-normal leading-normal">
                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[loan.status] || 'bg-slate-200 text-slate-700'}`}>
                                  {loan.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

