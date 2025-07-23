import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/utils/api/axiosConfig';
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiTrendingUp, 
  FiClock, 
  FiArrowUpRight, 
  FiArrowDownRight,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';
import Navbar from './navbar';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [selectedLoanIndex, setSelectedLoanIndex] = useState(0);
    const [loanSummary, setLoanSummary] = useState({
        totalLoan: 0,
        amountPaid: 0,
        remainingAmount: 0,
        emiAmount: 0,
        nextEmi: 0,
        dueDate: '',
        emiDay: 0,
        loanTenure: 0,
        emisPaid: 0,
        totalEmis: 0
    });
    const customerDetails = JSON.parse(localStorage.getItem('customerDetails'));
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchLoanData = async () => {
            try {
                const response = await api.get('/loans/getallloans');
                const customerLoans = response.data.filter((loan) => loan.customerId === customerDetails.customerId);
                setLoans(customerLoans);
                if (customerLoans.length > 0) {
                    setSelectedLoanIndex(0); // default to first loan
                }
            } catch (err) {
                console.error('Error fetching loan data:', err);
            }
        };
        fetchLoanData();
    }, [customerDetails.customerId]);

    // Update summary and payments when selectedLoanIndex or loans change
    useEffect(() => {
        const updateLoanSummaryAndPayments = async () => {
            if (loans.length === 0) return;
            const loanData = loans[selectedLoanIndex];
            setLoanSummary({
                totalLoan: parseFloat(loanData.loanAmount),
                amountPaid: parseFloat(loanData.amountPaid),
                emiAmount: parseFloat(loanData.emiAmount),
                remainingAmount: parseFloat(loanData.loanAmount) - parseFloat(loanData.amountPaid),
                nextEmi: parseFloat(loanData.emiAmount),
                dueDate: loanData.nextPaymentDate,
                emiDay: (new Date(loanData.nextPaymentDate).getDate()),
                loanTenure: loanData.tenure,
                emisPaid: loanData.payments.length,
                totalEmis: loanData.tenure
            });
            // Fetch payments/audit logs for this loan
            try {
                const auditogs = await api.get('audit-logs/loan/' + loanData.loanId);
                const mappedPayments = auditogs.data.data.map((log) => {
                    let type = '';
                    let description = '';
                    let status = '';
                    if (log.action === 'PAYMENT_CREATED') {
                        type = 'credit';
                        description = `EMI #${log.details.installmentNumber} Paid`;
                        status = 'completed';
                    } else if (log.action === 'PAYMENT_REVERTED') {
                        type = 'debit';
                        description = `EMI #${log.details.installmentNumber} Reverted`;
                        status = 'reverted';
                    }
                    return {
                        id: log._id,
                        type,
                        description,
                        date: new Date(log.performedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        amount: log.details.amount,
                        status
                    };
                });
                setPayments(mappedPayments);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setPayments([]);
            }
        };
        updateLoanSummaryAndPayments();
    }, [selectedLoanIndex, loans]);

    // Sample data - replace with actual data from your backend
    const customerData = customerDetails;
    useEffect(() => {
        const fetchpayments = async () => {
            try {
                const payments = await api.get('/loans/getallloans');
                const loan = payments.data.find((loan) => loan.customerId === customerDetails.customerId);
                console.log("loan:", loan);
                const loanData = loan;
                const auditogs = await api.get('audit-logs/loan/' + loanData.loanId);
                console.log("auditogs:", auditogs.data);

                // Transform audit log data to transaction format expected by UI
                const mappedPayments = auditogs.data.data.map((log) => {
                    let type = '';
                    let description = '';
                    let status = '';
                    if (log.action === 'PAYMENT_CREATED') {
                        type = 'credit';
                        description = `EMI #${log.details.installmentNumber} Paid`;
                        status = 'completed';
                    } else if (log.action === 'PAYMENT_REVERTED') {
                        type = 'debit';
                        description = `EMI #${log.details.installmentNumber} Reverted`;
                        status = 'reverted';
                    }
                    return {
                        id: log._id,
                        type,
                        description,
                        date: new Date(log.performedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        amount: log.details.amount,
                        status
                    };
                });
                setPayments(mappedPayments);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setPayments([]);
            }
        }
        fetchpayments();
    }, [customerDetails.customerId]);

    // Calculate loan progress percentage
    const loanProgress = Math.min(100, Math.round((loanSummary.emisPaid / loanSummary.totalEmis) * 100));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-blue-600">{customerData.name}</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>Account: {customerData.customerId}</span>
                        <span>•</span>
                        <span>Member since {customerData.createdAt.split('T')[0]}</span>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            {customerData.status}
                        </span>
                    </div>
                </div>
                {/* loan choices */}
                {loans.length > 1 && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Choose Loan</label>
                        <select
                            className="block w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedLoanIndex}
                            onChange={e => setSelectedLoanIndex(Number(e.target.value))}
                        >
                            {loans.map((loan, idx) => (
                                <option key={loan.loanId} value={idx}>
                                    {loan.loanType ? loan.loanType : `Loan #${idx + 1}`} - {loan.loanId} - ₹{loan.loanAmount} 
                                </option>
                            ))}
                        </select>
                    </div>
                )}
               
                {/* Alert Banner */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Your next EMI of <span className="font-semibold">₹{loanSummary.nextEmi}</span> is due on <span className="font-semibold">{loanSummary.dueDate}</span>.
                                <a onClick={() => navigate(`/customers/payment/${loans[selectedLoanIndex].loanId}/emi`)} className="font-medium text-yellow-700 underline hover:text-yellow-600 ml-2">
                                    Pay Now
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loan Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Total Loan Amount</p>
                        <p className="text-xl font-bold">{loanSummary.totalLoan}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                        <p className="text-xl font-bold text-green-600">{loanSummary.amountPaid}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Remaining Amount</p>
                        <p className="text-xl font-bold">{loanSummary.remainingAmount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">Next EMI Due</p>
                        <p className="text-xl font-bold">{loanSummary.nextEmi}</p>
                        <p className="text-xs text-gray-500">Due on {loanSummary.dueDate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1` lg:grid-cols-5 gap-6">
                    {/* Loan Progress */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Loan Repayment Progress</h2>
                                <span className="text-sm text-gray-500">{loanProgress}% Complete</span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${loanProgress}%` }}
                                ></div>
                            </div>
                            
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>EMI {loanSummary.emisPaid}/{loanSummary.totalEmis}</span>
                                <span>Tenure: {loanSummary.loanTenure}</span>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">EMI Amount</p>
                                    <p className="font-semibold">{loanSummary.emiAmount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">EMI Day</p>
                                    <p className="font-semibold">{loanSummary.emiDay}th of every month</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => navigate(`/customers/payment/${loans[selectedLoanIndex].loanId}/emi`)}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                            >
                                Pay EMI Now
                            </button>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                                <button 
                                    onClick={() => navigate('/customers/payment-history')}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {payments.map((txn) => (
                                    <div 
                                        key={txn.id} 
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${
                                                txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {txn.type === 'credit' ? 
                                                    <FiArrowDownRight className="w-4 h-4" /> : 
                                                    <FiArrowUpRight className="w-4 h-4" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium">{txn.description}</p>
                                                <p className="text-sm text-gray-500">{txn.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${
                                                txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                                            </p>
                                            <div className="flex items-center justify-end text-xs text-gray-500">
                                                { txn.status === 'completed' ? (
                                                    <>
                                                        <FiCheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                                        <span>Completed</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCheckCircle className="w-3 h-3 text-red-500 mr-1" />
                                                        <span>Reverted</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                      
                    
                       
                       

                        {/* Support Card */}
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                            <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-4">Our support team is here to help you with any questions about your loan or account.</p>
                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm" onClick={() => navigate('/customers/contact')}    >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;