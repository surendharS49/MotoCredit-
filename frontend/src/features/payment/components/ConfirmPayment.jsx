import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/formatCurrency';
import '../../../features/payment/components/payment.css';
import { Navbar } from '../../../components/layout';
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaMoneyBillWave, FaCalendarAlt, FaClock, FaHistory } from 'react-icons/fa';

const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Other'];

const ConfirmPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Payment details should be passed via state
  const {
    installmentNumber,
    paymentAmount: initialPaymentAmount,
    paymentMethod: initialPaymentMethod,
    customPaymentMethod: initialCustomPaymentMethod,
    dueDate,
    loanId
  } = location.state || {};
  
 
  const [paymentAmount, setPaymentAmount] = useState(initialPaymentAmount || '');
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [defaultPenalty, setDefaultPenalty] = useState(0);
  const [showPenaltyWarning, setShowPenaltyWarning] = useState(false);
  const [penaltyOverrideConfirmed, setPenaltyOverrideConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || paymentMethods[0]);
  const [customPaymentMethod, setCustomPaymentMethod] = useState(initialCustomPaymentMethod || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const PENALTY_PER_DAY = 75;
  const CURRENT_DATE = new Date().toISOString().split('T')[0];
useEffect(() => {
    const calculateDefaultPenalty = (dueDate) => {
      if (!dueDate) return 0;
      const due = new Date(dueDate);
      const now = new Date(CURRENT_DATE);
      if (now > due) {
        const diffTime = now.setHours(0, 0, 0, 0) - due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * PENALTY_PER_DAY;
      }
      return 0;
    };
    const calculated = calculateDefaultPenalty(dueDate);
    setPenaltyAmount(calculated);
    setDefaultPenalty(calculated);
    setShowPenaltyWarning(false);
    setPenaltyOverrideConfirmed(false);
  }, [dueDate]);
  if (!installmentNumber || !paymentAmount || !paymentMethod || !loanId) {
    return (
      <div className="page-container bg-slate-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="payment-container flex flex-1 items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Invalid Payment Data</h2>
            <p>Missing payment details. Please go back and try again.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    const selectedMethod = paymentMethod === 'Other' && customPaymentMethod
      ? customPaymentMethod
      : paymentMethod;
    if (!selectedMethod || (paymentMethod === 'Other' && !customPaymentMethod)) {
      setError('Please select or enter a valid payment method.');
      setLoading(false);
      return;
    }
    if (penaltyAmount < 0) {
      setError('Penalty amount cannot be negative.');
      setLoading(false);
      return;
    }
    if (penaltyAmount > defaultPenalty && !penaltyOverrideConfirmed) {
      setError('You must confirm the penalty override before submitting.');
      setLoading(false);
      return;
    }
    try {
      const api = (await import('../../../utils/api/axiosConfig')).default;
      await api.post(`/payments/${loanId}`, {
        installmentNumber,
        amount: Number(paymentAmount)+Number(penaltyAmount),
        penaltyAmount: Number(penaltyAmount) || 0,
        status: "paid",
        paidDate: new Date().toISOString(),
        dueDate: dueDate,
        paymentMethod: selectedMethod
      });
      setSuccess('Payment recorded successfully! Redirecting...');
      setTimeout(() => navigate(`/payments/${loanId}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'There was an error recording the payment.');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="payment-container flex flex-1 items-center justify-center">
        <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Confirm & Edit Payment</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleConfirm();
            }}
            className="space-y-5"
          >
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Installment #</label>
              <input
                className="border rounded p-2 bg-gray-100 cursor-not-allowed"
                type="text"
                value={installmentNumber}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Payment Amount</label>
              <input
                className="border rounded p-2"
                type="number"
                min={0}
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Penalty Amount</label>
              <input
                className={`border rounded p-2 ${penaltyAmount > defaultPenalty ? 'text-red-600 font-semibold' : ''}`}
                type="text"
                min={0}
                max={defaultPenalty}
                step={1}
                value={penaltyAmount}
                placeholder={defaultPenalty}
                onChange={e => {
                  const val = Number(e.target.value);
                  setPenaltyAmount(val);
                  if (val > defaultPenalty) {
                    setShowPenaltyWarning(true);
                    setPenaltyOverrideConfirmed(false);
                  } else {
                    setShowPenaltyWarning(false);
                    setPenaltyOverrideConfirmed(false);
                  }
                }}
                required
              />
              <span className="text-xs text-gray-500">Default penalty calculated: {formatCurrency(defaultPenalty)}</span>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Due Date</label>
              <input
                className="border rounded p-2 bg-gray-100 cursor-not-allowed"
                type="text"
                value={dueDate ? format(new Date(dueDate), 'dd MMM yyyy') : '-'}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <select
                className="border rounded p-2"
                value={paymentMethod}
                onChange={e => {
                  setPaymentMethod(e.target.value);
                  if (e.target.value !== 'Other') setCustomPaymentMethod('');
                }}
                required
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              {paymentMethod === 'Other' && (
                <input
                  className="border rounded p-2 mt-2"
                  type="text"
                  placeholder="Enter custom payment method"
                  value={customPaymentMethod}
                  onChange={e => setCustomPaymentMethod(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Total Amount</label>
              <input
                className="border rounded p-2 bg-gray-100 cursor-not-allowed"
                type="text"
                value={Number(paymentAmount)+Number(penaltyAmount)}
                readOnly
              />
            </div>

            {showPenaltyWarning ? (
              <div className="mb-2 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded flex items-center gap-2">
                <FaExclamationCircle className="text-yellow-600" />
                <span>
                  Warning: The entered penalty exceeds the default calculated penalty. Please confirm this is intentional.
                </span>
                <label className="ml-2 flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={penaltyOverrideConfirmed}
                    onChange={e => setPenaltyOverrideConfirmed(e.target.checked)}
                  />
                  <span className="text-xs">I confirm the penalty override</span>
                </label>
              </div>
            ) : null}
            {error && (
              <div className="error-message text-center">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded text-center">{success}</div>
            )}
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
