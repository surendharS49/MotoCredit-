import React, { useState, useEffect } from 'react';
import api from '../src/utils/api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import '../src/features/customer/components/customers.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const Customers = () => {
  const navigate = useNavigate();
  const customerId = JSON.parse(localStorage.getItem('customerDetails')).customerId;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    dob: '',
    gender: '',
    aadhar: '',
    pan: '',
    drivingLicense: ''
  });
  const [originalCustomer, setOriginalCustomer] = useState(null); // For cancel
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        console.log('Fetching customer with ID:', customerId);
        const response = await api.get(`/customers/getcustomer/${customerId}`);
        const data = response.data;
        const formattedData = {
          ...data,
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : ''
        };
        setCustomer(formattedData);
        setOriginalCustomer(formattedData); // Save original for cancel
      } catch (error) {
        console.error('Error fetching customer:', error);
        setError(error.response?.data?.message || 'Failed to load customer data');
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.put(`/customers/updatecustomer/${customerId}`, customer);
      setIsEditMode(false);
      setOriginalCustomer(customer); // update original
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && originalCustomer) {
      setCustomer(originalCustomer); // revert changes
      setIsEditMode(false);
      setError('');
    } else {
      navigate('/customers');
    }
  };

  const renderField = (label, value, onChange, type = 'text', required = true, options = null) => {
    if (!isEditMode) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-100 text-gray-700">{value || <span className="text-gray-400">N/A</span>}</div>
        </div>
      );
    }
    if (options) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <select
            value={value}
            onChange={onChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required={required}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }
    if (type === 'textarea') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <textarea
            value={value}
            onChange={onChange}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required={required}
          />
        </div>
      );
    }
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required={required}
          disabled={isLoading}
        />
      </div>
    );
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        {/* Main Content */}
        <div className="p-8">
          <div className="mb-8">
            {/* <button
              onClick={handleCancel}
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" /> Back to Customers
            </button> */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
              {!isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-white p-6 shadow">
            <form onSubmit={handleUpdateCustomer} className="space-y-6">
              {/* Personal Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Personal Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {renderField('Name', customer.name, (e) => setCustomer({...customer, name: e.target.value}), 'text')}
                  {renderField('Email', customer.email, (e) => setCustomer({...customer, email: e.target.value}), 'email')}
                  {renderField('Phone', customer.phone, (e) => setCustomer({...customer, phone: e.target.value}), 'tel')}
                  {renderField('Date of Birth', customer.dob, (e) => setCustomer({...customer, dob: e.target.value}), 'date')}
                  {renderField('Gender', customer.gender, (e) => setCustomer({...customer, gender: e.target.value}), 'text', true, [
                    {value: '', label: 'Select Gender'},
                    {value: 'male', label: 'Male'},
                    {value: 'female', label: 'Female'},
                    {value: 'other', label: 'Other'}
                  ])}
                </div>
              </div>

              {/* Address Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Address Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    {renderField('Address', customer.address, (e) => setCustomer({...customer, address: e.target.value}), 'textarea')}
                  </div>
                  {renderField('City', customer.city, (e) => setCustomer({...customer, city: e.target.value}))}
                  {renderField('State', customer.state, (e) => setCustomer({...customer, state: e.target.value}))}
                  {renderField('Zip Code', customer.zip, (e) => setCustomer({...customer, zip: e.target.value}))}
                  {renderField('Country', customer.country, (e) => setCustomer({...customer, country: e.target.value}))}
                </div>
              </div>

              {/* ID Information */}
              <div>
                <h2 className="mb-4 text-lg font-medium text-gray-900">Identification Details</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {renderField('Aadhar Number', customer.aadhar, (e) => setCustomer({...customer, aadhar: e.target.value}))}
                  {renderField('PAN Number', customer.pan, (e) => setCustomer({...customer, pan: e.target.value}))}
                  {renderField('Driving License Number', customer.drivingLicense, (e) => setCustomer({...customer, drivingLicense: e.target.value}))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                {isEditMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;