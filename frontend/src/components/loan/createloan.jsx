import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaArrowLeft, FaCalculator, FaSearch, FaSync } from 'react-icons/fa';

const CreateLoan = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [vehicleSearch, setVehicleSearch] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loanData, setLoanData] = useState({
        customerId: '',
        vehicleId: '',
        loanAmount: '',
        marketValue: '',
        processingFee: '',
        interestRate: '',
        tenure: '',
        emiAmount: '',
        startDate: '',
        paymentFrequency: 'Monthly',
        status: 'Pending',
        guarantorName: '',
        guarantorPhone: '',
        guarantorAddress: '',
        guarantorRelation: ''
    });

    useEffect(() => {
        fetchCustomers();
        fetchVehicles();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/customers');
            const data = await response.json();
            setCustomers(data);
            setFilteredCustomers(data); // Initialize filtered customers
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/getvehicles');
            const data = await response.json();
            setVehicles(data);
            setFilteredVehicles(data); // Initialize filtered vehicles
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoanData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log('Submitting loan data:', loanData);
            const response = await fetch('http://localhost:3000/admin/createloan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loanData)
            });

            if (!response.ok) {
                throw new Error('Failed to create loan');
            }

            const data = await response.json();
            console.log('Loan created:', data);
            navigate('/admin/loans');
        } catch (error) {
            console.error('Error creating loan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateEMI = () => {
        const principal = parseFloat(loanData.loanAmount);
        const ratePerMonth = (parseFloat(loanData.interestRate) / 12) / 100;
        const frequency = loanData.paymentFrequency;
        const paymentFrequency = frequency === 'Monthly' ? 1 : frequency === 'Quarterly' ? 4 : 6;
        const numberOfPayments = parseFloat(loanData.tenure) / paymentFrequency;

        if (principal && ratePerMonth && numberOfPayments) {
            const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfPayments)) /
                (Math.pow(1 + ratePerMonth, numberOfPayments) - 1);
            
            setLoanData(prev => ({
                ...prev,
                emiAmount: emi.toFixed(2)
            }));
        }
    };

    // Search handlers
    const handleCustomerSearch = (e) => {
        const searchTerm = e.target.value;
        setCustomerSearch(searchTerm);
        setShowCustomerDropdown(true);

        const filtered = customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm) ||
            customer.customerId.includes(searchTerm)
        );
        setFilteredCustomers(filtered);

    };

    const handleVehicleSearch = (e) => {
        const searchTerm = e.target.value;
        setVehicleSearch(searchTerm);
        setShowVehicleDropdown(true);

        const filtered = vehicles.filter(vehicle => 
            vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVehicles(filtered);
    };

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch(`${customer.name} - ${customer.phone}`);
        setShowCustomerDropdown(false);
        setLoanData(prev => ({
            ...prev,
            customerId: customer.customerId
        }));
    };

    const selectVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setVehicleSearch(`${vehicle.manufacturer} ${vehicle.model} - ${vehicle.registrationNumber}`);
        setShowVehicleDropdown(false);
        setLoanData(prev => ({
            ...prev,
            vehicleId: vehicle.vehicleId
        }));
    };

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <Navbar />
                
                <div className="p-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate('/admin/loans')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <FaArrowLeft className="h-5 w-5" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Loan Application</h1>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Customer Information Section */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Search Customer
                                        </label>
                                        <div className="relative">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={customerSearch}
                                                        onChange={handleCustomerSearch}
                                                        onFocus={() => setShowCustomerDropdown(true)}
                                                        placeholder="Search by name, phone, or ID"
                                                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                                                    />
                                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={fetchCustomers}
                                                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600"
                                                    title="Refresh customers list"
                                                >
                                                    <FaSync className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Customer Search Results Dropdown */}
                                        {showCustomerDropdown && filteredCustomers.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                {filteredCustomers.map(customer => (
                                                    <div
                                                        onClick={() => selectCustomer(customer)}
                                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                    >
                                                        <div className="font-medium">{customer.name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            {customer.phone} | ID: {customer.customerId}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Customer Details */}
                                    {selectedCustomer && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Customer Details</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Name:</p>
                                                    <p className="font-medium">{selectedCustomer.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Phone:</p>
                                                    <p className="font-medium">{selectedCustomer.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Address:</p>
                                                    <p className="font-medium">{selectedCustomer.address}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">ID:</p>
                                                    <p className="font-medium">{selectedCustomer.customerId}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Vehicle Information Section */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Search Vehicle
                                        </label>
                                        <div className="relative">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={vehicleSearch}
                                                        onChange={handleVehicleSearch}
                                                        onFocus={() => setShowVehicleDropdown(true)}
                                                        placeholder="Search by registration number, manufacturer, or model"
                                                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                                                    />
                                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={fetchVehicles}
                                                    className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600"
                                                    title="Refresh vehicles list"
                                                >
                                                    <FaSync className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Vehicle Search Results Dropdown */}
                                        {showVehicleDropdown && filteredVehicles.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                {filteredVehicles.map(vehicle => (
                                                    <div
                                                    key={vehicle.vehicleId}
                                                        onClick={() => selectVehicle(vehicle)}
                                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                    >
                                                        <div className="font-medium">
                                                            {vehicle.manufacturer} {vehicle.model}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Reg: {vehicle.registrationNumber}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Vehicle Details */}
                                    {selectedVehicle && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Vehicle Details</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-600">manufacturer & Model:</p>
                                                    <p className="font-medium">{selectedVehicle.manufacturer} {selectedVehicle.model}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Registration:</p>
                                                    <p className="font-medium">{selectedVehicle.registrationNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Year:</p>
                                                    <p className="font-medium">{selectedVehicle.year}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Color:</p>
                                                    <p className="font-medium">{selectedVehicle.color}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Loan Details Section */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Market Value
                                        </label>
                                        <input
                                            type="number"
                                            name="marketValue"
                                            step="0.0"
                                            value={loanData.marketValue}
                                            min={0}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                            onWheel={e => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                           Loan Amount
                                        </label>
                                        <input
                                            type="number"
                                            name="loanAmount"
                                            step="0.0"
                                            value={loanData.loanAmount}
                                            min={0}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                            onWheel={e => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Processing Fee
                                        </label>
                                        <input
                                            type="number"
                                            name="processingFee"
                                            step="0.0"
                                            value={loanData.processingFee}
                                            min={0}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                            onWheel={e => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Interest Rate (% per annum)
                                        </label>
                                        <input 
                                            type="float"
                                            step="0.0"
                                            name="interestRate"
                                            value={loanData.interestRate}
                                            min={0}
                                            max={100}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                            onWheel={e => e.target.blur()}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Months
                                        </label>
                                        <select
                                            name="tenure"
                                            
                                            value={loanData.tenure}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        >
                                            <option value="">Select Months</option>

                                            {Array.from({ length:12 }, (_, i) => i + 1).map(months => (
                                                <option key={months} value={months}>{months} months</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Payment Frequency
                                        </label>
                                        <select
                                            name="paymentFrequency"
                                            value={loanData.paymentFrequency}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Semi-Annual">Semi-Annual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={loanData.startDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex flex-col md:flex-row items-stretch gap-6">
                                        {/* Loan Amount */}
                                        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg shadow p-4">
                                            <h3 className="text-sm font-medium text-gray-700">Loan Amount</h3>
                                            <p className="text-2xl font-bold text-blue-600">
                                                ₹ {(
                                                    (parseFloat(loanData.loanAmount) || 0) +
                                                    (parseFloat(loanData.processingFee) || 0)
                                                ).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* EMI Calculator Section */}
                                        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg shadow p-4">
                                            <div className="flex flex-col items-center">
                                                <h3 className="text-sm font-medium text-gray-700">EMI Amount</h3>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    ₹ {parseFloat(loanData.emiAmount) ? parseFloat(loanData.emiAmount).toFixed(2) : '0.00'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={calculateEMI}
                                                    className="flex items-center gap-2 mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                                >
                                                    <FaCalculator />
                                                    Calculate EMI
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guarantor Information */}
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Guarantor Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Guarantor Name
                                        </label>
                                        <input
                                            type="text"
                                            name="guarantorName"
                                            value={loanData.guarantorName}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Guarantor Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="guarantorPhone"
                                            value={loanData.guarantorPhone}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Guarantor Address
                                        </label>
                                        <textarea
                                            name="guarantorAddress"
                                            value={loanData.guarantorAddress}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Relation with Applicant
                                        </label>
                                        <input
                                            type="text"
                                            name="guarantorRelation"
                                            value={loanData.guarantorRelation}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/loans')}
                                    className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Create Loan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLoan;