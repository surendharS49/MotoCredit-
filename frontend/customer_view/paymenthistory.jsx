import React, { useState, useEffect } from 'react';
import api from '../src/utils/api/axiosConfig';
import { 
    FiAlertCircle,
    FiAlertTriangle,
    FiArrowUpRight, 
    FiArrowDownRight,
    FiCheckCircle
} from 'react-icons/fi';
import Navbar from './navbar';

const PaymentHistory = () => {
    const [loans, setLoans] = useState([]);
    const [loanSummary, setLoanSummary] = useState(null);
    const [payments, setPayments] = useState([]);
    const [selectedLoanIndex, setSelectedLoanIndex] = useState(0);
    const customerDetails = JSON.parse(localStorage.getItem('customerDetails'));

    useEffect(() => {
        const fetchLoansAndPayments = async () => {
            try {
                const loansRes = await api.get('/loans/getallloans');
                // Filter all loans for this customer
                const customerLoans = loansRes.data.filter(loan => loan.customerId === customerDetails.customerId);
                setLoans(customerLoans);
                if (customerLoans.length > 0) {
                    setSelectedLoanIndex(0); // Default select first loan
                }
            } catch (err) {
                console.error('Error fetching loans:', err);
            }
        };
        if (customerDetails && customerDetails.customerId) {
            fetchLoansAndPayments();
        } else {
            console.error('Customer details not found');
        }
    }, [customerDetails?.customerId]);
    console.log(loanSummary);

    // Fetch payments and summary when selectedLoanIndex or loans changes
    useEffect(() => {
        const fetchPayments = async () => {
            if (!loans || loans.length === 0) return;
            const loan = loans[selectedLoanIndex];
            if (!loan) return;
            setLoanSummary({
                totalLoan: parseFloat(loan.loanAmount),
                amountPaid: parseFloat(loan.amountPaid),
                remainingAmount: parseFloat(loan.loanAmount) - parseFloat(loan.amountPaid),
                nextEmi: parseFloat(loan.emiAmount),
                dueDate: loan.nextPaymentDate,
                emiDay: (new Date(loan.nextPaymentDate).getDate()),
                loanTenure: loan.tenure,
                emisPaid: loan.payments.length,
                totalEmis: loan.tenure,
                loanType: loan.loanType,
                loanId: loan.loanId,
                loanAmount: loan.loanAmount
            });
            try {
                const auditLogsRes = await api.get('audit-logs/loan/' + loan.loanId);
                const mappedPayments = (auditLogsRes.data.data || []).map((log) => {
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
                        date: log.performedAt,
                        amount: log.details.amount,
                        status
                    };
                });
                const sortedPayments = mappedPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPayments(sortedPayments);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setPayments([]);
            }
        };
        if (loans.length > 0 && selectedLoanIndex >= 0) {
            fetchPayments();
        } else {
            setLoanSummary(null);
            setPayments([]);
        }
    }, [loans, selectedLoanIndex]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Payment History
                    </h1>
                    <p className="text-gray-600 mt-2 mb-2 text-sm font-semibold">
                        View your payment history here.
                    </p>
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
                    <div className="grid grid-cols-1 gap-2 mt-4 mb-4">
                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <FiAlertTriangle className="w-8 h-8 mb-2 text-yellow-500" />
                                <span className="font-semibold">No payment history found.</span>
                            </div>
                        ) : (
                            payments.map((txn) => (
                                <li
                                    key={txn.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0"
                                >
                                    {/* Left: Icon and Details */}
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${
                                            txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {txn.type === 'credit'
                                                ? <FiArrowDownRight className="w-4 h-4" />
                                                : <FiArrowUpRight className="w-4 h-4" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-medium">{txn.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(txn.date).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Right: Amount and Status */}
                                    <div className="flex flex-col items-end min-w-[100px] text-right">
                                        <p className={`font-medium ${
                                            txn.type === 'credit'
                                                ? 'text-green-600'
                                                : txn.type === 'debit'
                                                ? 'text-red-600'
                                                : 'text-gray-900'
                                        }`}>
                                            {txn.type === 'credit' ? '+' : txn.type === 'debit' ? '-' : ' '}
                                            {txn.amount}
                                        </p>
                                        <div className="flex items-center justify-end text-xs mt-1">
                                            {txn.status === 'completed' ? (
                                                <>
                                                    <FiCheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                                    <span className="text-green-500">Completed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiAlertCircle className="w-3 h-3 text-red-500 mr-1" />
                                                    <span className="text-red-500 capitalize">{txn.status}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentHistory;