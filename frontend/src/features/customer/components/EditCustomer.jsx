import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../../../components/layout';
import './customers.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import api from '../../../utils/api/axiosConfig'; // Adjust the import path as necessary


const EditCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
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

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/getcustomer/${customerId}`);
        const data = response.data;
        // Format the date to YYYY-MM-DD for the input field
        const formattedData = {
          ...data,
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : ''
        };
        setCustomer(formattedData);
      } catch (error) {
        console.error('Error fetching customer:', error);
        setError(error.response?.data?.message || 'Failed to load customer data');
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.put(`/customers/updatecustomer/${customerId}`, customer);
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/customers');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        {/* Main Content */}
        <div className="p-8">
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" /> Back to Customers
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={customer.dob}
                      onChange={(e) => setCustomer({...customer, dob: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={customer.gender}
                      onChange={(e) => setCustomer({...customer, gender: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Address Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      value={customer.address}
                      onChange={(e) => setCustomer({...customer, address: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({...customer, city: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      value={customer.state}
                      onChange={(e) => setCustomer({...customer, state: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      value={customer.zip}
                      onChange={(e) => setCustomer({...customer, zip: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={customer.country}
                      onChange={(e) => setCustomer({...customer, country: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ID Information */}
              <div>
                <h2 className="mb-4 text-lg font-medium text-gray-900">Identification Details</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                    <input
                      type="text"
                      value={customer.aadhar}
                      onChange={(e) => setCustomer({...customer, aadhar: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                    <input
                      type="text"
                      value={customer.pan}
                      onChange={(e) => setCustomer({...customer, pan: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Driving License Number</label>
                    <input
                      type="text"
                      value={customer.drivingLicense}
                      onChange={(e) => setCustomer({...customer, drivingLicense: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                      Updating...
                    </>
                  ) : (
                    'Update Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer; 