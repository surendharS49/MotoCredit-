import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './viewloan.css';
import { Navbar } from '../../../components/layout';
import { FaEdit, FaTimes, FaCheck, FaSpinner, FaArrowLeft, FaSave, FaCopy, FaArrowRight } from 'react-icons/fa';

const ViewLoan = () => {
    // Change this line to use loanId instead of id
    const { loanId } = useParams(); // This matches the :loanId parameter in the route
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedLoan, setEditedLoan] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Add new state for payment history
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [showPaymentHistory, setShowPaymentHistory] = useState(false);

    // Add edit states for customer and vehicle
    const [isEditingCustomer, setIsEditingCustomer] = useState(false);
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);
    const [editedVehicle, setEditedVehicle] = useState(null);
    const [customerError, setCustomerError] = useState('');
    const [vehicleError, setVehicleError] = useState('');
    const [customerSuccess, setCustomerSuccess] = useState('');
    const [vehicleSuccess, setVehicleSuccess] = useState('');

    // Add new state for copy feedback
    const [copiedField, setCopiedField] = useState('');

    // Add copy function
    const handleCopy = (text, fieldName) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            // Reset the copied field indicator after 2 seconds
            setTimeout(() => setCopiedField(''), 2000);
        });
    };

    useEffect(() => {
        if (loanId) { // Add check to ensure loanId exists
            fetchLoanDetails();
        }
    }, [loanId]); // Update dependency array to use loanId

    const fetchLoanDetails = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching loan details for ID:', loanId); // Add logging

            const loanResponse = await fetch(`http://localhost:3000/admin/loans/${loanId}`);
            if (!loanResponse.ok) {
                throw new Error('Failed to fetch loan details');
            }
            const loanData = await loanResponse.json();
            console.log('Loan data received:', loanData); // Add logging
            setLoan(loanData);
            setEditedLoan(loanData);

            // Only fetch customer and vehicle if we have their IDs
            if (loanData.customerId) {
                const customerResponse = await fetch(`http://localhost:3000/admin/customers/${loanData.customerId}`);
                if (!customerResponse.ok) {
                    throw new Error('Failed to fetch customer details');
                }
                const customerData = await customerResponse.json();
                setCustomer(customerData);
                setEditedCustomer(customerData);
            }

            if (loanData.vehicleId) {
                const vehicleResponse = await fetch(`http://localhost:3000/admin/vehicles/${loanData.vehicleId}`);
                if (!vehicleResponse.ok) {
                    throw new Error('Failed to fetch vehicle details');
                }
                const vehicleData = await vehicleResponse.json();
                setVehicle(vehicleData);
                setEditedVehicle(vehicleData);
            }

            setError('');
        } catch (error) {
            console.error('Error in fetchLoanDetails:', error); // Add logging
            setError('Failed to fetch loan details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedLoan(loan);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLoan(prev => ({
            ...prev,
            [name]: name === 'loanAmount' || name === 'marketValue' || 
                    name === 'tenure' || name === 'interestRate' || 
                    name === 'emiAmount' || name === 'processingFee' 
                    ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await axios.put(`http://localhost:3000/admin/loans/${loanId}`, editedLoan);
            setLoan(response.data);
            setIsEditing(false);
            setSuccess('Loan details updated successfully!');
            setError('');
        } catch (error) {
            setError('Failed to update loan details. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Customer edit functions
    const handleEditCustomer = () => {
        setIsEditingCustomer(true);
        setEditedCustomer(customer);
        setCustomerError('');
        setCustomerSuccess('');
    };

    const handleCancelCustomer = () => {
        setIsEditingCustomer(false);
        setEditedCustomer(customer);
        setCustomerError('');
    };

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCustomerSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await axios.put(`http://localhost:3000/admin/updatecustomer/${customer.customerId}`, editedCustomer);
            setCustomer(response.data);
            setIsEditingCustomer(false);
            setCustomerSuccess('Customer details updated successfully!');
            setCustomerError('');
        } catch (error) {
            setCustomerError('Failed to update customer details. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Vehicle edit functions
    const handleEditVehicle = () => {
        setIsEditingVehicle(true);
        setEditedVehicle(vehicle);
        setVehicleError('');
        setVehicleSuccess('');
    };

    const handleCancelVehicle = () => {
        setIsEditingVehicle(false);
        setEditedVehicle(vehicle);
        setVehicleError('');
    };

    const handleVehicleChange = (e) => {
        const { name, value } = e.target;
        setEditedVehicle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVehicleSubmit = async () => {
        try {
            setIsLoading(true);
                const response = await axios.put(`http://localhost:3000/admin/updatevehicle/${vehicle.vehicleId}`, editedVehicle);
            setVehicle(response.data);
            setIsEditingVehicle(false);
            setVehicleSuccess('Vehicle details updated successfully!');
            setVehicleError('');
        } catch (error) {
            setVehicleError('Failed to update vehicle details. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Get status color
    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Approved': 'bg-green-100 text-green-800 border-green-300',
            'Rejected': 'bg-red-100 text-red-800 border-red-300',
            'Closed': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const renderContent = () => {
        if (isLoading) return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
                <span className="ml-3 text-lg text-gray-600">Loading loan details...</span>
            </div>
        );

        if (!loan) return (
            <div className="text-center py-8">
                <div className="text-red-600 text-xl">No loan found</div>
                <button 
                    onClick={() => navigate('/admin/loans')}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <FaArrowLeft className="mr-2" /> Back to Loans
                </button>
            </div>
        );

        return (
            <>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <button 
                        onClick={() => navigate('/admin/loans')}
                        className="inline-flex items-center text-gray-700 hover:text-blue-700 font-medium transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Loans
                    </button>
                    <div className="flex justify-center">
                        <div className={`px-5 py-2 rounded-full border text-base font-semibold shadow-sm ${getStatusColor(loan.status)}`}>
                            {loan.status}
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/admin/payments/${loanId}`)}
                        className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Make Payment
                    </button>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="mb-6 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                        <div className="flex items-center">
                            <FaTimes className="mr-2" />
                            {error}
                        </div>
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                            <FaTimes />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                        <div className="flex items-center">
                            <FaCheck className="mr-2" />
                            {success}
                        </div>
                        <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
                            <FaTimes />
                        </button>
                    </div>
                )}

                {/* Loan Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm text-gray-500">Total Loan Amount</div>
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(loan.loanAmount)}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm text-gray-500">EMI Amount</div>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(loan.emiAmount)}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="text-sm text-gray-500">Tenure</div>
                        <div className="text-2xl font-bold text-purple-600">{loan.tenure} months</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-lg p-4 shadow-md">
                    {/* Loan Details Section */}
                    <div className="loan-card">
                        <h2 className="flex items-center justify-between">
                            <span>Loan Details</span>
                            {!isEditing ? (
                                <button 
                                    onClick={handleEdit}
                                    className="inline-flex items-center text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                            ) : null}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="loan-form">
                            <div className="form-section">
                                <div className="form-section-title">Basic Information</div>
                                <div className="form-group">
                                    <label>Loan ID:</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editedLoan.loanId}
                                            disabled
                                            className="flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(editedLoan.loanId, 'loanId')}
                                            className="copy-btn"
                                            title="Copy Loan ID"
                                        >
                                            {copiedField === 'loanId' ? (
                                                <span className="text-green-600">
                                                    <FaCheck className="h-4 w-4" />
                                                </span>
                                            ) : (
                                                <FaCopy className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Customer ID:</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editedLoan.customerId}
                                            disabled
                                            className="flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(editedLoan.customerId, 'customerId')}
                                            className="copy-btn"
                                            title="Copy Customer ID"
                                        >
                                            {copiedField === 'customerId' ? (
                                                <span className="text-green-600">
                                                    <FaCheck className="h-4 w-4" />
                                                </span>
                                            ) : (
                                                <FaCopy className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Vehicle ID:</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editedLoan.vehicleId}
                                            disabled
                                            className="flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(editedLoan.vehicleId, 'vehicleId')}
                                            className="copy-btn"
                                            title="Copy Vehicle ID"
                                        >
                                            {copiedField === 'vehicleId' ? (
                                                <span className="text-green-600">
                                                    <FaCheck className="h-4 w-4" />
                                                </span>
                                            ) : (
                                                <FaCopy className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="form-section-title">Loan Terms</div>
                                <div className="form-group">
                                    <label>Loan Amount:</label>
                                    <input
                                        type="number"
                                        name="loanAmount"
                                        value={editedLoan.loanAmount}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Market Value:</label>
                                    <input
                                        type="number"
                                        name="marketValue"
                                        value={editedLoan.marketValue}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tenure (months):</label>
                                    <input
                                        type="number"
                                        name="tenure"
                                        value={editedLoan.tenure}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Interest Rate (%):</label>
                                    <input
                                        type="number"
                                        name="interestRate"
                                        value={editedLoan.interestRate}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="form-section-title">Payment Details</div>
                                <div className="form-group">
                                    <label>Payment Frequency:</label>
                                    <select
                                        name="paymentFrequency"
                                        value={editedLoan.paymentFrequency}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Semi-Annual">Semi-Annual</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>EMI Amount:</label>
                                    <input
                                        type="number"
                                        name="emiAmount"
                                        value={editedLoan.emiAmount}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Processing Fee:</label>
                                    <input
                                        type="number"
                                        name="processingFee"
                                        value={editedLoan.processingFee}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="form-section-title">Status</div>
                                <div className="form-group">
                                    <label>Loan Status:</label>
                                    <select
                                        name="status"
                                        value={editedLoan.status}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Customer and Vehicle Details Side Panel */}
                    <div className="space-y-6">
                        {customer && (
                            <div className="loan-card">
                                <h2 className="flex items-center justify-between">
                                    <span>Customer Details</span>
                                    {!isEditingCustomer ? (
                                        <button 
                                            onClick={handleEditCustomer}
                                            className="inline-flex items-center text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                                        >
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                    ) : null}
                                </h2>

                                {customerError && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                                        {customerError}
                                    </div>
                                )}

                                {customerSuccess && (
                                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                                        {customerSuccess}
                                    </div>
                                )}

                                <div className="form-section">
                                    <div className="form-group">
                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={isEditingCustomer ? editedCustomer.name : customer.name || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={isEditingCustomer ? editedCustomer.email : customer.email || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone:</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={isEditingCustomer ? editedCustomer.phone : customer.phone || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Address:</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={isEditingCustomer ? editedCustomer.address : customer.address || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City:</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={isEditingCustomer ? editedCustomer.city : customer.city || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State:</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={isEditingCustomer ? editedCustomer.state : customer.state || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>PIN Code:</label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            value={isEditingCustomer ? editedCustomer.zip : customer.zip || '-'}
                                            onChange={handleCustomerChange}
                                            disabled={!isEditingCustomer}
                                        />
                                    </div>
                                </div>

                                {isEditingCustomer && (
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleCancelCustomer}
                                            className="btn cancel-btn"
                                        >
                                            <FaTimes className="mr-1" /> Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCustomerSubmit}
                                            className="btn save-btn"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FaSpinner className="animate-spin mr-1" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="mr-1" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {vehicle && (
                            <div className="loan-card">
                                <h2 className="flex items-center justify-between">
                                    <span>Vehicle Details</span>
                                    {!isEditingVehicle ? (
                                        <button 
                                            onClick={handleEditVehicle}
                                            className="inline-flex items-center text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                                        >
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                    ) : null}
                                </h2>

                                {vehicleError && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                                        {vehicleError}
                                    </div>
                                )}

                                {vehicleSuccess && (
                                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                                        {vehicleSuccess}
                                    </div>
                                )}

                                <div className="form-section">
                                    <div className="form-group">
                                        <label>Manufacturer:</label>
                                        <input
                                            type="text"
                                            name="manufacturer"
                                            value={isEditingVehicle ? editedVehicle.manufacturer : vehicle.manufacturer || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Model:</label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={isEditingVehicle ? editedVehicle.model : vehicle.model || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Year:</label>
                                        <input
                                            type="number"
                                            name="year"
                                            value={isEditingVehicle ? editedVehicle.year : vehicle.year || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Registration Number:</label>
                                        <input
                                            type="text"
                                            name="registrationNumber"
                                            value={isEditingVehicle ? editedVehicle.registrationNumber : vehicle.registrationNumber || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Chassis Number:</label>
                                        <input
                                            type="text"
                                            name="chassisNumber"
                                            value={isEditingVehicle ? editedVehicle.chassisNumber : vehicle.chassisNumber || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Engine Number:</label>
                                        <input
                                            type="text"
                                            name="engineNumber"
                                            value={isEditingVehicle ? editedVehicle.engineNumber : vehicle.engineNumber || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Color:</label>
                                        <input
                                            type="text"
                                            name="color"
                                            value={isEditingVehicle ? editedVehicle.color : vehicle.color || '-'}
                                            onChange={handleVehicleChange}
                                            disabled={!isEditingVehicle}
                                        />
                                    </div>
                                </div>

                                {isEditingVehicle && (
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleCancelVehicle}
                                            className="btn cancel-btn"
                                        >
                                            <FaTimes className="mr-1" /> Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleVehicleSubmit}
                                            className="btn save-btn"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <FaSpinner className="animate-spin mr-1" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="mr-1" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn cancel-btn"
                                disabled={isLoading}
                            >
                                <FaTimes className="mr-1" /> Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="btn save-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-1" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="mr-1" />
                                        
                                        Update
                                    </>
                                )}
                            </button>
                        </>
                    ) : null}
                </div>
            </>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <header>
                <Navbar />
            </header>
            <main className="flex-1">
                <div className="loan-view-container">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ViewLoan; 