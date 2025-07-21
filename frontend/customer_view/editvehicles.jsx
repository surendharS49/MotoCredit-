import React, { useState, useEffect } from 'react';
import api from '../src/utils/api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import '../src/features/customer/components/customers.css';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const EditCustomerVehicle = () => {
    const navigate = useNavigate();
    const { vehicleId } = useParams();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [vehicle, setVehicle] = useState(null); // Initialize as null

    useEffect(() => {
      const fetchVehicle = async () => {
        try {
          const response = await api.get(`/vehicles/getvehicle/${vehicleId}`);
          const data = response.data;
          
          
          if (!data) {
            throw new Error('Vehicle not found');
          }
  
          setVehicle(data);
        } catch (error) {
          console.error('Error fetching vehicle:', error);
          setError(error.response?.data?.message || error.message || 'Failed to load vehicle data');
        } finally {
          setIsLoading(false);
        }
      };
  
        fetchVehicle();
    }, [vehicleId]);
  
    const handleUpdateVehicle = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
  
      try {
        await api.put(`/vehicles/updatevehicle/${vehicleId}`, vehicle);
        navigate('/customers/vehicles');
      } catch (error) {
        console.error('Error updating vehicle:', error);
        setError(error.response?.data?.message || error.message || 'Failed to update vehicle');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCancel = () => {
      navigate('/customers/vehicles');
    };
  
    if (isLoading) {
      return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Navbar />
            <div className="flex items-center justify-center p-8">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Navbar />
            <div className="p-8">
              <div className="mb-8">
                <button
                  onClick={handleCancel}
                  className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <FaArrowLeft className="mr-2" /> Back to Vehicles
                </button>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    // Add check for vehicle data
    if (!vehicle) {
      return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Navbar />
            <div className="p-8">
              <div className="mb-8">
                <button
                  onClick={handleCancel}
                  className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <FaArrowLeft className="mr-2" /> Back to Vehicles
                </button>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
                No vehicle data found.
              </div>
            </div>
          </div>
        </div>
      );
    }
  
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
                <FaArrowLeft className="mr-2" /> Back to Vehicles
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            </div>
  
            <div className="rounded-lg bg-white p-6 shadow">
              <form onSubmit={handleUpdateVehicle} className="space-y-6">
                {/* Vehicle Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                    <input
                      type="text"
                      value={vehicle.registrationNumber}
                      onChange={(e) => setVehicle({...vehicle, registrationNumber: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <input
                      type="text"
                      value={vehicle.manufacturer}
                      onChange={(e) => setVehicle({...vehicle, manufacturer: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      value={vehicle.model}
                      onChange={(e) => setVehicle({...vehicle, model: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="number"
                      value={vehicle.year}
                      onChange={(e) => setVehicle({...vehicle, year: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Engine Number</label>
                    <input
                      type="text"
                      value={vehicle.engineNumber}
                      onChange={(e) => setVehicle({...vehicle, engineNumber: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chassis Number</label>
                    <input
                      type="text"
                      value={vehicle.chassisNumber}
                      onChange={(e) => setVehicle({...vehicle, chassisNumber: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="text"
                      value={vehicle.color}
                      onChange={(e) => setVehicle({...vehicle, color: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={vehicle.status}
                      onChange={(e) => setVehicle({...vehicle, status: e.target.value})}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
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
                      'Update Vehicle'
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

export default EditCustomerVehicle;