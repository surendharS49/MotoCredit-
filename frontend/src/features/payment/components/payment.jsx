import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/layout';
import { Modal } from '../../../components/common';
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaMoneyBillWave, FaCalendarAlt, FaClock, FaHistory } from 'react-icons/fa';

const Payment = () => {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const [loanDetails, setLoanDetails] = useState(null);
    const [payments, setPayments] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [showAuditLogs, setShowAuditLogs] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentModal, setPaymentModal] = useState({
        isOpen: false,
        type: 'default',
        title: '',
        message: '',
        onConfirm: null,
        customContent: null,
    });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customPaymentMethod, setCustomPaymentMethod] = useState('');
    const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Other'];

    const showPaymentModal = (type, title, message, onConfirm = null, customContent = null) => {
        setPaymentModal({
            isOpen: true,
            type,
            title,
            message,
            onConfirm,
            customContent,
        });
    };

    const closePaymentModal = () => {
        setPaymentModal({
            isOpen: false,
            type: 'default',
            title: '',
            message: '',
            onConfirm: null,
            customContent: null,
        });
    };

    const fetchAuditLogs = async () => {
        if (!loanId) return;

        setLogsLoading(true);
        try {
            const response = await api.get(`/audit-logs/loan/${loanId}`);
            if (response.data.success) {
                console.log(response.data.data);
                setAuditLogs(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            setError('Failed to load payment history');
        } finally {
            setLogsLoading(false);
        }
    };

    const toggleAuditLogs = async () => {
        if (!showAuditLogs && auditLogs.length === 0) {
            await fetchAuditLogs();
        }
        setShowAuditLogs(!showAuditLogs);
    };

    const fetchLoanAndPayments = useCallback(async () => {
        if (!loanId) return;

        setLoading(true);
        setError('');

        try {
            const [loanResponse, paymentsResponse] = await Promise.all([
                api.get(`/loans/getloan/${loanId}`),
                api.get(`/payments/${loanId}`)
            ]);

            setLoanDetails(loanResponse.data);
            setPayments(paymentsResponse.data);

            await fetchAuditLogs();
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching loan details and payments');
        } finally {
            setLoading(false);
        }
    }, [loanId]);

    useEffect(() => {
        fetchLoanAndPayments();
    }, [loanId, fetchLoanAndPayments]);

    const checkAndCloseLoan = async () => {
        const allPaymentsMade = payments.length === calculatePaymentStats().totalInstallments;

        if (allPaymentsMade && loanDetails.status !== 'closed') {
            try {
                await api.patch(`/loans/updateloan/${loanId}`, {
                    status: 'closed'
                });

                setLoanDetails(prev => ({
                    ...prev,
                    status: 'closed'
                }));

                showPaymentModal(
                    'success',
                    'Loan Closed',
                    'All payments have been completed. The loan has been marked as closed.'
                );
            } catch (err) {
                showPaymentModal(
                    'error',
                    'Status Update Failed',
                    err.response?.data?.message || 'Failed to update loan status. Please try again.'
                );
            }
        }
    };

    const calculatePaymentStats = () => {
        if (!loanDetails) return {
            totalPaid: 0,
            totalPending: 0,
            paidInstallments: 0,
            pendingInstallments: 0,
            totalInstallments: 0
        };

        const totalAmount = parseFloat(loanDetails.loanAmount);
        const emiAmount = parseFloat(loanDetails.emiAmount);
        const totalInstallments = parseInt(loanDetails.tenure) || loanDetails.tenure;

        const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

        return {
            totalPaid: totalPaid,
            totalPending: totalAmount - totalPaid,
            paidInstallments: payments.length,
            pendingInstallments: totalInstallments - payments.length,
            totalInstallments,
            emiAmount
        };
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '₹0.00';

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    const handlePayment = async (installmentNumber) => {
        const { totalInstallments, emiAmount } = calculatePaymentStats();

        if (payments.length >= totalInstallments) {
            showPaymentModal('warning', 'Loan Completed', 'All installments have already been paid.');
            return;
        }

        const existingPayment = payments.find(p => p.installmentNumber === installmentNumber);
        if (existingPayment) {
            showPaymentModal('warning', 'Payment Exists', `A payment for installment #${installmentNumber} already exists. Please update the existing payment if needed.`);
            return;
        }

        const paymentAmount = emiAmount;

        const PaymentMethodSelector = (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Select Payment Method</label>
                <select
                    className="border rounded p-2"
                    value={paymentMethod}
                    onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        if (e.target.value !== 'Other') setCustomPaymentMethod('');
                    }}
                >
                    {paymentMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </select>
                {paymentMethod === 'Other' && (
                    <input
                        className="border rounded p-2"
                        type="text"
                        placeholder="Enter custom payment method"
                        value={customPaymentMethod}
                        onChange={(e) => setCustomPaymentMethod(e.target.value)}
                    />
                )}
            </div>
        );

        showPaymentModal(
            'warning',
            'Confirm Payment',
            `Are you sure you want to record a payment of ${formatCurrency(paymentAmount)} for installment #${installmentNumber}?`,
            async () => {
                const selectedMethod = paymentMethod === 'Other' && customPaymentMethod
                    ? customPaymentMethod
                    : paymentMethod;

                try {
                    const response = await api.post(`/payments/${loanId}`, {
                        installmentNumber,
                        amount: paymentAmount,
                        status: "paid",
                        paidDate: new Date().toISOString(),
                        dueDate: new Date().toISOString(),
                        paymentMethod: selectedMethod
                    });
                    console.log(response);

                    const paymentsResponse = await api.get(`/payments/${loanId}`);
                    setPayments(paymentsResponse.data);

                    showPaymentModal('success', 'Payment Successful', 'The payment has been recorded.');
                    checkAndCloseLoan();
                } catch (err) {
                    showPaymentModal('error', 'Payment Failed', err.response?.data?.message || 'There was an error recording the payment.');
                }
            },
            PaymentMethodSelector
        );
    };

    const handleRevertPayment = async (payment) => {
        const reason = prompt('Please provide a reason for reverting this payment:');

        if (reason) {
            showPaymentModal(
                'warning',
                'Confirm Revert',
                'Are you sure you want to revert this payment? This action cannot be undone.',
                async () => {
                    try {
                        const response = await api.delete(`/payments/revertpayment/${payment.paymentId}`, {
                            revertedBy: 'Admin', 
                            revertReason: reason,
                        });
                        console.log(response);
                        showPaymentModal('success', 'Payment Reverted', 'The payment has been reverted.');
                        await fetchLoanAndPayments();
                    } catch (err) {
                        showPaymentModal('error', 'Revert Failed', err.response?.data?.message || 'There was an error reverting the payment.');
                    }
                }
            );
        }
    };

    const calculateDueDate = (installmentNumber) => {
        if (!loanDetails) return null;
        const startDate = new Date(loanDetails.createdAt);
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + installmentNumber);
        return dueDate.toISOString();
    };

    const renderAuditLogs = () => {
        if (!showAuditLogs) return null;

        return (
            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaHistory className="mr-2" /> Payment History
                </h3>
                {logsLoading ? (
                    <div className="text-center py-4">Loading payment history...</div>
                ) : auditLogs.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No payment history found</div>
                ) : (
                    <div className="space-y-4">
                        {auditLogs.map((log, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">
                                            {log.action === 'PAYMENT_CREATED' ? 'Payment Received' : 'Payment Reverted'}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {log.details?.message || 'No additional details'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(log.performedAt).toLocaleString()}
                                    </div>
                                </div>
                                {log.details?.amount && (
                                    <div className="mt-1 text-sm">
                                        Amount: {formatCurrency(log.details.amount)}
                                    </div>
                                )}
                                <div className="text-xs text-gray-400 mt-1">
                                    By: {log.performedBy}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (error) {
        return (
            <div className="flex min-h-screen flex-col bg-slate-50">
                <Navbar />
                <div className="p-8">
                    <div className="rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
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
                        <div className="flex items-center gap-3 p-4">
                            <button 
                                onClick={() => navigate('/loans')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <FaArrowLeft size={14} />
                                Back to Loans
                            </button>
                            <h1 className="text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">
                                Payment History - Loan {loanId}
                            </h1>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                {loanDetails && (
                                    <>
                                        {loanDetails.status === 'closed' && (
                                            <div className="px-4 mb-4">
                                                <div className="rounded-lg bg-green-50 p-4 flex items-center gap-2">
                                                    <FaCheckCircle className="text-green-500" size={20} />
                                                    <p className="text-green-700 font-medium">
                                                        This loan has been fully paid and closed
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                            <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 p-6 shadow-md border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <FaMoneyBillWave className="text-blue-500" size={24} />
                                                    <p className="text-base font-medium leading-normal text-[#0e141b]">Total Amount</p>
                                                </div>
                                                <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">
                                                    {formatCurrency(loanDetails.loanAmount)}
                                                </p>
                                                <p className="text-sm text-[#4e7097]">
                                                    EMI: {formatCurrency(calculatePaymentStats().emiAmount)}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-6 shadow-md border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <FaCalendarAlt className="text-green-500" size={24} />
                                                    <p className="text-base font-medium leading-normal text-[#0e141b]">Amount Paid</p>
                                                </div>
                                                <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">
                                                    {formatCurrency(calculatePaymentStats().totalPaid)}
                                                </p>
                                                <p className="text-sm text-[#4e7097]">
                                                    {calculatePaymentStats().paidInstallments} of {calculatePaymentStats().totalInstallments} installments
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 shadow-md border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <FaClock className="text-yellow-500" size={24} />
                                                    <p className="text-base font-medium leading-normal text-[#0e141b]">Amount Pending</p>
                                                </div>
                                                <p className="text-2xl font-bold leading-tight tracking-light text-[#0e141b]">
                                                    {formatCurrency(calculatePaymentStats().totalPending)}
                                                </p>
                                                <p className="text-sm text-[#4e7097]">
                                                    {calculatePaymentStats().pendingInstallments} installments remaining
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-4 py-3">
                                            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-slate-50">
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Payment ID</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Installment #</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Amount</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Due Date</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Status</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Payment Date</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Payment Method</th>
                                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.from({ length: loanDetails.tenure }, (_, index) => {
                                                            const payment = payments.find(p => p.installmentNumber === index + 1);
                                                            const dueDate = calculateDueDate(index + 1);
                                                            const today = new Date();
                                                            const isDueDate = new Date(dueDate) < today;

                                                            return (
                                                                <tr key={index + 1} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">
                                                                        {payment?.paymentId || '-'}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">
                                                                        {formatCurrency(loanDetails.emiAmount)}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">
                                                                        {new Date(dueDate).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                            payment?.status === 'Paid'
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : isDueDate
                                                                                ? 'bg-red-100 text-red-700'
                                                                                : 'bg-yellow-100 text-yellow-700'
                                                                        }`}>
                                                                            {payment?.status || (isDueDate ? 'Overdue' : 'Pending')}
                                                                        </span>
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">
                                                                        {payment?.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">
                                                                        {payment?.paymentMethod || '-'}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                                        <div className="flex gap-2">
                                                                            {(!payment || (payment.status && payment.status.toLowerCase() !== 'paid')) && (
                                                                                <button
                                                                                    onClick={() => handlePayment(index + 1)}
                                                                                    className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition flex items-center gap-1"
                                                                                >
                                                                                    <FaMoneyBillWave size={12} />
                                                                                    Pay Now
                                                                                </button>
                                                                            )}
                                                                            {payment && payment.status && payment.status.toLowerCase() === 'paid' && (
                                                                                <button
                                                                                    onClick={() => handleRevertPayment(payment)}
                                                                                    className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition flex items-center gap-1"
                                                                                >
                                                                                    <FaExclamationCircle size={12} />
                                                                                    Revert
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button
                                                onClick={toggleAuditLogs}
                                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <FaHistory className="mr-2" />
                                                {showAuditLogs ? 'Hide Payment History' : 'View Payment History'}
                                            </button>
                                            {renderAuditLogs()}
                                        </div>

                                        {/* <div className="px-4 py-3">
                                            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold">Audit Log</h3>
                                                    <div className="text-sm text-gray-500">All times are in local timezone</div>
                                                </div>
                                                <div className="space-y-3">
                                                    {[...auditLogs].reverse().map((payment) => (
                                                        <React.Fragment key={payment.paymentId}>
                                                            <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
                                                                <div className="mt-1">
                                                                    {payment.status && payment.status.toLowerCase() === 'paid' ? (
                                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                                            <FaMoneyBillWave className="text-green-600" size={16} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                            <FaExclamationCircle className="text-red-600" size={16} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between">
                                                                        <div>
                                                                            <div className="font-medium text-[#0e141b]">
                                                                                {payment.status && payment.status.toLowerCase() === 'paid' ? 'Payment Received' : `Payment ${payment.status || 'Processed'}`}
                                                                            </div>
                                                                            <div className="text-sm text-gray-600">
                                                                                Installment #{payment.installmentNumber} - {formatCurrency(payment.amount)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {new Date(payment.paidDate || payment.createdAt).toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-2 text-sm text-gray-600">
                                                                        <div>Payment Method: {payment.paymentMethod || 'N/A'}</div>
                                                                        <div>Processed by: {payment.processedBy || 'Admin'}</div>
                                                                        {payment.notes && <div>Notes: {payment.notes}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {payment.revertedAt && (
                                                                <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-100 ml-6">
                                                                    <div className="mt-1">
                                                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                            <FaExclamationCircle className="text-red-600" size={16} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start justify-between">
                                                                            <div>
                                                                                <div className="font-medium text-red-700">Payment Reverted</div>
                                                                                <div className="text-sm text-red-600">
                                                                                    Original Payment #{payment.paymentId}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {new Date(payment.revertedAt).toLocaleString()}
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-2 text-sm text-red-600">
                                                                            <div>Reverted by: {payment.revertedBy || 'Admin'}</div>
                                                                            {payment.revertReason && <div>Reason: {payment.revertReason}</div>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                    {payments.length === 0 && (
                                                        <div className="text-center py-6 text-gray-500">
                                                            No payment activities recorded yet
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div> */}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={paymentModal.isOpen}
                onClose={closePaymentModal}
                title={paymentModal.title}
                type={paymentModal.type}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        {paymentModal.type === 'success' && (
                            <FaCheckCircle className="text-4xl text-green-500" />
                        )}
                        {paymentModal.type === 'error' && (
                            <FaExclamationCircle className="text-4xl text-red-500" />
                        )}
                        {paymentModal.type === 'warning' && (
                            <FaExclamationCircle className="text-4xl text-yellow-500" />
                        )}
                    </div>

                    <p className="text-center text-gray-600">
                        {paymentModal.message}
                    </p>

                    {paymentModal.customContent && (
                        <div className="my-4">
                            {paymentModal.customContent}
                        </div>
                    )}

                    <div className="flex justify-center gap-3">
                        {paymentModal.onConfirm ? (
                            <>
                                <button
                                    onClick={() => {
                                        if (paymentModal.onConfirm) paymentModal.onConfirm();
                                        closePaymentModal();
                                    }}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={closePaymentModal}
                                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={closePaymentModal}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Payment;
