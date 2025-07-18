import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./dashboard.css";
import logo from "../assets/motocredit-logo.png";
import { FaUsers, FaMoneyCheckAlt, FaWallet, FaExclamationCircle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Customers } from "../features/customer/components";
import { Navbar } from "../components/layout";

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
  const [increasePercentage, setIncreasePercentage] = useState(0);
  const [loanCount, setLoanCount] = useState(0);
  const [allLoans, setAllLoans] = useState([]);
  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
  const [monthlyEmiData, setMonthlyEmiData] = useState([
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 0 },
    { month: 'Mar', value: 0 },
    { month: 'Apr', value: 0 },
    { month: 'May', value: 0 },
    { month: 'Jun', value: 0 },
    { month: 'Jul', value: 0 },
    { month: 'Aug', value: 0 },
    { month: 'Sep', value: 0 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Dec', value: 0 }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchOverdueEmis = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/loans');
      const data = await response.json();
      
      // Calculate overdue EMIs: loans whose nextPaymentDate is before today
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
      
      const overdueLoans = data.filter(loan => {
        if (!loan.nextPaymentDate) {
          return false;
        }
        const nextPaymentDate = new Date(loan.nextPaymentDate);
        nextPaymentDate.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
        const isOverdue = nextPaymentDate < today && loan.status !== 'Closed';
        return isOverdue;
      });
      
      const overdueLoansLength = overdueLoans.length;
      setOverdueEmis(overdueLoansLength);
    } catch (error) {
      console.error('Error fetching overdue EMIs:', error);
      setOverdueEmis(0);
    }
    };

  const fetchEmiData = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/payments');
      const data = await response.json();

      const updatedEmiData = monthlyEmiData.map(month => ({ ...month, value: 0 }));

      data.forEach(payment => {
        if (payment.paidDate) {
          const paidDate = new Date(payment.paidDate);
          const monthIndex = paidDate.getMonth();
          if (payment.amount) {
            updatedEmiData[monthIndex].value += Number(payment.amount);
          }
        }
      });

      setMonthlyEmiData(updatedEmiData);
    } catch (error) {
      console.error('Error fetching EMI data:', error);
    }
  };

  useEffect(() => {
    const fetchIncreasePercentage = async () => {
      try {
        const monthIndex = new Date().getMonth();
        let previousmonthearning = 0;
        let currentmonthearning = 0;

        if (Array.isArray(monthlyEmiData) && monthlyEmiData.length > 0) {
          if (monthIndex > 0 && monthlyEmiData[monthIndex - 1]) {
            previousmonthearning = Number(monthlyEmiData[monthIndex - 1].value) || 0;
          }
          if (monthlyEmiData[monthIndex]) {
            currentmonthearning = Number(monthlyEmiData[monthIndex].value) || 0;
          }
        }

        let increasePercentage = 0;
        if (previousmonthearning > 0) {
          increasePercentage = ((currentmonthearning - previousmonthearning) / previousmonthearning) * 100;
        } else if (currentmonthearning > 0) {
          increasePercentage = 100;
        } else {
          increasePercentage = 0;
        }
        setIncreasePercentage(increasePercentage.toFixed(2));
      } catch (error) {
        console.error('Error fetching increase percentage:', error);
        setIncreasePercentage(0);
      }
    };
    fetchIncreasePercentage();
  }, [monthlyEmiData]);

  useEffect(() => {
    const fetchTotalAmountCollected = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/payments');
        const data = await response.json();
        const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalAmountCollected(totalAmount);
      } catch (error) {
        console.error('Error fetching total amount collected:', error);
        setTotalAmountCollected(0);
      }
    };
    fetchTotalAmountCollected();
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    fetchOverdueEmis();
    fetchEmiData();
  }, []);

  useEffect(() => {
    const admin = localStorage.getItem('user');
    setAdminName(admin ? JSON.parse(admin).name : '');
  }, []);

  useEffect(() => {
    const fetchTotalDisbursedAmount = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/loans');
        const data = await response.json();
        const totalAmount = data.reduce((sum, loan) => sum + loan.loanAmount, 0);
        setTotalDisbursedAmount(totalAmount);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setTotalDisbursedAmount(0);
      }
    };

    fetchTotalDisbursedAmount();
  },[]);
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
      value: totalDisbursedAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      icon: <FaMoneyCheckAlt size={28} className="text-purple-500" />,
      gradient: 'from-purple-100 to-purple-50',
    },
    {
      label: 'Overdue EMIs',
      value: overdueEmis|| 0,
      icon: <FaExclamationCircle size={28} className="text-red-500" />,
      gradient: 'from-red-100 to-red-50',
    },
  ];

useEffect(()=>{
  fetchLoans();
},[]);
const fetchLoans=async()=>{
  try {
    const response = await fetch('http://localhost:3000/admin/loans');
    const data = await response.json();
    
    // Transform the data to match our table structure
    const transformedLoans = data.map(loan => ({
      loanId: loan.loanId,
      customerID: loan.customerId || 'N/A',
      loanAmount: Number(loan.loanAmount) || 0,
      tenure: loan.tenure || 0,
      createdAt: loan.createdAt || new Date().toISOString(),
      status: loan.status || 'Pending'
    }));
    
    setAllLoans(transformedLoans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    setAllLoans([]);
  }
}

  const statusColors = {
    Paid: 'bg-green-100 text-green-700',
    Active: 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
  };

  const tableHeaders = [
    { label: 'Loan ID', key: 'loanId' },
    { label: 'Customer ID', key: 'customerID' },
    { label: 'Amount', key: 'loanAmount' },
    { label: 'Months', key: 'tenure' },
    { label: 'Disbursed Date', key: 'createdAt' },
    { label: 'Status', key: 'status' }
  ];

  const filteredLoans = allLoans.filter(
    (loan) =>
      loan.loanId?.toLowerCase().includes(search.toLowerCase()) ||
      loan.customerID?.toLowerCase().includes(search.toLowerCase())
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
                  Amount
                </h2>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                  <div className="flex min-w-72 flex-1 flex-col gap-2">
                    <p className="text-base font-medium leading-normal text-[#0e141b]">Total Amount collected</p>
                    <p className="truncate text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">{totalAmountCollected.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    <div className="flex gap-1">
                      <p className="text-base font-normal leading-normal text-[#4e7097]">This Month</p>
                      <p className="text-base font-medium leading-normal text-[#07883b]">{increasePercentage}%</p>
                    </div>
                    <div className="w-full h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyEmiData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
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
                  {/* Table section */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {tableHeaders.map((header) => (
                            <th
                              key={header.key}
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLoans.map((loan) => (
                          <tr key={loan.loanId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {loan.loanId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {loan.customerID}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {loan.loanAmount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {loan.tenure}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(loan.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  statusColors[loan.status] || 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {loan.status}
                              </span>
                            </td>
                          </tr>
                        ))}
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

