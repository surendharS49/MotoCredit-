import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../../../components/layout';
import { FaPlus, FaSearch } from 'react-icons/fa';
import ViewLoan from './ViewLoan';

const LoanPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loanData, setLoanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/getloans');
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        const data = await response.json();
        setLoanData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching loans:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Closed': 'bg-green-100 text-green-700'
  };

  const handleCreateLoan = () => {
    navigate('/admin/loans/create');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const filteredLoans = loanData.filter(loan =>
    (loan.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (loan.loanId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="p-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        
        <div className="p-8">
          <div className="layout-content-container container mx-auto flex flex-1 flex-col">
            {/* Page Title and Actions */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">
                Loans
              </p>
              <button
                onClick={handleCreateLoan}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <FaPlus className="text-white" />
                Create New Loan
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Loan ID or Customer Name..."
                  className="w-full max-w-md rounded-lg border border-[#d0dbe7] pl-10 pr-4 py-2 text-sm focus:border-blue-400 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Loans Table */}
            <div className="px-4 py-3">
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Loan ID</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Customer Name</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Vehicle Number</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Vehicle Model</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Amount</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">EMI</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Months</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Disbursed Date</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Status</th>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                          Loading loans...
                        </td>
                      </tr>
                    ) : filteredLoans.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                          No loans found
                        </td>
                      </tr>
                    ) : (
                      filteredLoans.map((loan) => (
                        <tr key={loan.loanId} className="border-t border-slate-200">
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{loan.loanId}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#0e141b]">{loan.customerName}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{loan.vehicleDetails.split(' - ')[0]}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{loan.vehicleDetails.split(' - ')[1]}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{formatCurrency(loan.loanAmount)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{formatCurrency(loan.emiAmount)}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{loan.tenure}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{loan.disbursedDate}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[loan.status]}`}>
                              {loan.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <button
                              onClick={() => navigate(`/admin/loans/${loan.loanId}`)}
                              className="text-blue-600 hover:text-blue-800 text-center"
                            >
                             <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097] text-center">View</td>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPage;
