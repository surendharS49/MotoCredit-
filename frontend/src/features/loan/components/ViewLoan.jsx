import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../utils/api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
// import './viewloan.css'; // No longer needed, all styles via Tailwind
import { Navbar } from '../../../components/layout';
import { FaEdit, FaTimes, FaCheck, FaSpinner, FaArrowLeft, FaSave, FaCopy, FaArrowRight } from 'react-icons/fa';

const ViewLoan = () => {
    const { loanId } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedLoan, setEditedLoan] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [isEditingCustomer, setIsEditingCustomer] = useState(false);
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);
    const [editedVehicle, setEditedVehicle] = useState(null);
    const [customerError, setCustomerError] = useState('');
    const [vehicleError, setVehicleError] = useState('');
    const [customerSuccess, setCustomerSuccess] = useState('');
    const [vehicleSuccess, setVehicleSuccess] = useState('');

    const [copiedField, setCopiedField] = useState('');

    const handleCopy = (text, fieldName) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(''), 2000);
        });
    };

    const fetchLoanDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const loanResponse = await api.get(`/loans/getloan/${loanId}`);
            const loanData = loanResponse.data;
            setLoan(loanData);
            setEditedLoan(loanData);

            if (loanData.customerId) {
                const customerResponse = await api.get(`/customers/getcustomer/${loanData.customerId}`);
                setCustomer(customerResponse.data);
                setEditedCustomer(customerResponse.data);
            }

            if (loanData.vehicleId) {
                const vehicleResponse = await api.get(`/vehicles/getvehicle/${loanData.vehicleId}`);
                setVehicle(vehicleResponse.data);
                setEditedVehicle(vehicleResponse.data);
            }
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch loan details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [loanId]);

    useEffect(() => {
        if (loanId) {
            fetchLoanDetails();
        }
    }, [loanId, fetchLoanDetails]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedLoan(loan);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedLoan(loan);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLoan(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await api.put(`/loans/updateloan/${loanId}`, editedLoan);
            setLoan(response.data);
            setIsEditing(false);
            setSuccess('Loan details updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update loan details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditCustomer = () => {
        setIsEditingCustomer(true);
        setEditedCustomer(customer);
    };

    const handleCancelCustomer = () => {
        setIsEditingCustomer(false);
        setEditedCustomer(customer);
    };

    const handleCustomerSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await api.put(`/customers/updatecustomer/${editedCustomer.customerId}`, editedCustomer);
            setCustomer(response.data);
            setIsEditingCustomer(false);
            setCustomerSuccess('Customer details updated successfully!');
            setCustomerError('');
        } catch (err) {
            setCustomerError(err.response?.data?.message || 'Failed to update customer details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditVehicle = () => {
        setIsEditingVehicle(true);
        setEditedVehicle(vehicle);
    };

    const handleCancelVehicle = () => {
        setIsEditingVehicle(false);
        setEditedVehicle(vehicle);
    };

    const handleVehicleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await api.put(`/vehicles/updatevehicle/${editedVehicle.vehicleId}`, editedVehicle);
            setVehicle(response.data);
            setIsEditingVehicle(false);
            setVehicleSuccess('Vehicle details updated successfully!');
            setVehicleError('');
        } catch (err) {
            setVehicleError(err.response?.data?.message || 'Failed to update vehicle details.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600';
            case 'pending': return 'text-yellow-600';
            case 'rejected': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const renderContent = () => {
        if (isLoading && !loan) {
            return (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center my-8">
                    <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-lg shadow">
                        <FaTimes className="mr-2 text-red-500" />
                        <span>{error}</span>
                    </div>
                </div>
            );
        }

        if (!loan) {
            return (
                <div className="flex items-center justify-center my-8">
                    <div className="bg-gray-100 text-gray-500 px-6 py-4 rounded shadow">No loan details found.</div>
                </div>
            );
        }

        return (
            <>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition font-medium shadow-sm"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-blue-900 text-center flex-1">Loan Details</h1>
                    <div className="w-28"></div>
                </div>

                {success && (
                    <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 shadow">
                        <FaCheck className="mr-2 text-green-500" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* Loan Info Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 flex items-center">
                                <span className="mr-2">Loan Information</span>
                            </h2>
                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-medium transition shadow-sm"
                                >
                                    <FaEdit className="mr-1" /> Edit
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {editedLoan && Object.entries(editedLoan).map(([key, value]) => {
                                if (["customerId", "vehicleId", "_id", "__v"].includes(key)) return null;
                                return (
                                    <div key={key} className="py-2 flex flex-col">
                                        <label className="font-medium text-gray-600 capitalize mb-1">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </label>

                                        {isEditing ? (
                                            
                                            (key === 'createdAt' || key === 'updatedAt') ? (
                                                <input
                                                    type="datetime-local"
                                                    name={key}
                                                    value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={value || ''}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            )
                                        ) : ((key === 'createdAt' || key === 'updatedAt') ? (
                                            <input
                                                type="datetime-local"
                                                name={key}
                                                value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                                                onChange={handleChange}
                                                readOnly
                                                disabled
                                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={key.includes('Amount') || key.includes('emi') ? formatCurrency(value) : value}
                                                readOnly
                                                disabled
                                                className={`border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed ${key === 'status' ? getStatusColor(value) : ''}`}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(`/payments/${loanId}`)}
                                className="flex items-center px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded font-medium shadow-sm transition"
                            >
                                View Payments <FaArrowRight className="ml-2" />
                            </button>
                        </div>
                        {isEditing && (
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition"
                                    disabled={isLoading}
                                >
                                    <FaTimes className="mr-1" /> Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition shadow"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-1" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="mr-1" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Customer Card */}
                    {customer && editedCustomer && (
                        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-blue-700 flex items-center">
                                    <span className="mr-2">Customer Details</span>
                                </h2>
                                {!isEditingCustomer && (
                                    <button
                                        type="button"
                                        onClick={handleEditCustomer}
                                        className="flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-medium transition shadow-sm"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                )}
                            </div>
                            {customerError && (
                                <div className="flex items-center bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded mb-3">
                                    <FaTimes className="mr-2 text-red-400" />
                                    <span>{customerError}</span>
                                </div>
                            )}
                            {customerSuccess && (
                                <div className="flex items-center bg-green-50 border border-green-300 text-green-600 px-3 py-2 rounded mb-3">
                                    <FaCheck className="mr-2 text-green-400" />
                                    <span>{customerSuccess}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(editedCustomer).map(([key, value]) => {
                                    if (["_id", "__v"].includes(key)) return null;
                                    return (
                                        <div key={key} className="py-2 flex flex-col">
                                            <label className="font-medium text-gray-600 capitalize mb-1">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </label>
                                            <div className="flex items-center w-full">
                                        {isEditingCustomer ? (
                                            (key === 'createdAt' || key === 'updatedAt') ? (
                                                <input
                                                    type="datetime-local"
                                                    name={key}
                                                    value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={value || ''}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            )
                                        ) : ((key === 'createdAt' || key === 'updatedAt') ? (
                                            <input
                                                type="datetime-local"
                                                name={key}
                                                value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                                                onChange={handleChange}
                                                readOnly
                                                disabled
                                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={key.includes('Amount') || key.includes('emi') ? formatCurrency(value) : value}
                                                readOnly
                                                disabled
                                                className={`border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed ${key === 'status' ? getStatusColor(value) : ''}`}
                                            />
                                        ))}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(value, key)}
                                                    className="ml-2 text-gray-400 hover:text-blue-600 transition"
                                                >
                                                    {copiedField === key ? <FaCheck className="text-green-500" /> : <FaCopy />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {isEditingCustomer && (
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancelCustomer}
                                        className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition"
                                    >
                                        <FaTimes className="mr-1" /> Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCustomerSubmit}
                                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition shadow"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-1" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="mr-1" /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Vehicle Card */}
                    {vehicle && editedVehicle && (
                        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-blue-700 flex items-center">
                                    <span className="mr-2">Vehicle Details</span>
                                </h2>
                                {!isEditingVehicle && (
                                    <button
                                        type="button"
                                        onClick={handleEditVehicle}
                                        className="flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-medium transition shadow-sm"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                )}
                            </div>
                            {vehicleError && (
                                <div className="flex items-center bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded mb-3">
                                    <FaTimes className="mr-2 text-red-400" />
                                    <span>{vehicleError}</span>
                                </div>
                            )}
                            {vehicleSuccess && (
                                <div className="flex items-center bg-green-50 border border-green-300 text-green-600 px-3 py-2 rounded mb-3">
                                    <FaCheck className="mr-2 text-green-400" />
                                    <span>{vehicleSuccess}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(editedVehicle).map(([key, value]) => {
                                    if (["_id", "__v"].includes(key)) return null;
                                    return (
                                        <div key={key} className="py-2 flex flex-col">
                                            <label className="font-medium text-gray-600 capitalize mb-1">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </label>
                                            {isEditingVehicle ? (
                                            (key === 'createdAt' || key === 'updatedAt') ? (
                                                <input
                                                    type="datetime-local"
                                                    name={key}
                                                    value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={value || ''}
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            )
                                        ) : ((key === 'createdAt' || key === 'updatedAt') ? (
                                            <input
                                                type="datetime-local"
                                                name={key}
                                                value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                                                onChange={handleChange}
                                                readOnly
                                                disabled
                                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={key.includes('Amount') || key.includes('emi') ? formatCurrency(value) : value}
                                                readOnly
                                                disabled
                                                className={`border border-gray-300 rounded px-3 py-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed ${key === 'status' ? getStatusColor(value) : ''}`}
                                            />
                                        ))}
                                           
                                        </div>
                                    );
                                })}
                            </div>
                            {isEditingVehicle && (
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancelVehicle}
                                        className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition"
                                    >
                                        <FaTimes className="mr-1" /> Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleVehicleSubmit}
                                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition shadow"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-1" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="mr-1" /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Form Action Buttons */}
                    <div className="flex justify-end gap-4 mt-10">
                        {isEditing && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium transition"
                                    disabled={isLoading}
                                >
                                    <FaTimes className="mr-1" /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition shadow"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-1" /> Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="mr-1" /> Update
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </>
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <header><Navbar /></header>
            <main className="flex-1">
                <div className="max-w-4xl mx-auto w-full px-4 py-8">{renderContent()}</div>
            </main>
        </div>
    );
};

export default ViewLoan;