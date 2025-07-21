import React, { useState, useEffect } from 'react';
import api from '../src/utils/api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import '../src/features/customer/components/customers.css';
import { FaSearch, FaEye, FaEdit, FaPlus } from 'react-icons/fa';


const CustomerVehicles = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const customerId = JSON.parse(localStorage.getItem('customerDetails')).customerId;

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
      const getvehicles = async () => {
        try {
          const response = await api.get(`/vehicles/getvehicles/${customerId}`);
          setVehicles(response.data);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
        getvehicles();
      }, [customerId]);
    // const [loans, setLoans] = useState([]);

    // useEffect(()=>{
    //     const getvehiclefortheusersloan=async()=>{
    //         try {
    //             const response = await api.get(`/loans/getloansbycustomerid/${customerId}`);
    //             setLoans(response.data);
    //         } catch (error) {
    //             console.error('Error fetching loans:', error);
    //         }
    //     }
    //     getvehiclefortheusersloan();
    // },[])
  
    // const handleAddVehicle = () => {
    //   navigate('/vehicles/add');
    // };
  
    const handleEditVehicle = (vehicleId) => {
      navigate(`/customers/vehicles/edit/${vehicleId}`);
    };
  
    const filteredVehicles = vehicles.filter(vehicle =>
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
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
              <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
              {/* <button
                onClick={handleAddVehicle}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                <FaPlus />
                Add Vehicle
              </button> */}
            </div>
  
            {/* Search Bar */}
            <div className="mb-6 relative">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vehicles by registration number, manufacturer or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
  
            {/* Vehicles Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No vehicles found.
                      </td>
                    </tr>
                  ) : (
                    filteredVehicles.map(vehicle => (
                      <tr key={vehicle._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.registrationNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.manufacturer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[vehicle.status] || 'bg-gray-100 text-gray-800'}`}>
                            {vehicle.status}
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
                              onClick={() => handleEditVehicle(vehicle.vehicleId)}
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
  
  export default CustomerVehicles; 