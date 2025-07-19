import React, { useState, useEffect } from 'react';
import './customers.css';
import { useNavigate } from 'react-router-dom';
//import logo from '../../../assets/motocredit-logo.png';
import { FaSearch, FaUserPlus, FaEye, FaEdit } from 'react-icons/fa';
import { Navbar } from '../../../components/layout';
import api from '../../../utils/api/axiosConfig';

const Customers = () => {
  const navigate = useNavigate();
  //const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
 // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/customers/getallcustomers')
      .then(response => {
        console.log(response);
        setCustomers(response.data);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleCreateCustomerClickVehicle = () => {
    navigate('/vehicles/add');
  };

  const handleCreateCustomerClick = () => {
    navigate('/customers/create');
  };

  const handleEditCustomer = (customerId) => {
    navigate(`/customers/${customerId}/edit`);
  };

  const statusColors = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-red-100 text-red-700',
    'Pending': 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        {/* Main content */}
        
        <div className="p-8">
          {/* Page Title and Actions */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <div className="flex gap-4"> {/* Added a container div with gap for the buttons */}
              <button
                onClick={handleCreateCustomerClick}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <FaUserPlus />
                Create Customer
              </button>
              <button
                onClick={handleCreateCustomerClickVehicle}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <FaUserPlus />    
                Add Vehicle
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email or phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.customerId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[customer.status] || 'bg-gray-100 text-gray-800'}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <button className="text-blue-600 hover:text-blue-900" title="View Details">
                            <FaEye />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900" 
                            title="Edit"
                            onClick={() => handleEditCustomer(customer.customerId)}
                          >
                            <FaEdit />
                          </button>
                        </div>
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
  );
};

export default Customers;
