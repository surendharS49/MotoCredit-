import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaSearch, FaEye, FaEdit } from 'react-icons/fa';

const Vehicle = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample vehicle data - replace with actual data from your backend
  const getvehicles=async()=>{
    const response=await fetch('http://localhost:3000/admin/getvehicles');
    const data=await response.json();
    setVehicles(data);
  }
  useEffect(()=>{
    getvehicles();
  },[]);
  const [vehicles, setVehicles] = useState([]);

  const handleAddVehicle = () => {
    navigate('/admin/vehicles/create');
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
        
        <div className="p-8">
          {/* Page Title and Add Vehicle Button */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-[32px] font-bold leading-tight tracking-light text-[#0e141b]">
              Vehicles
            </h1>
            <button
              onClick={handleAddVehicle}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Add Vehicle
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles by registration number, manufacturer or model..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#d0dbe7] focus:outline-none focus:border-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Vehicles Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">ID</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Registration No.</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">manufacturer</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Model</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Year</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Engine No.</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Chassis No.</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Color</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-[#0e141b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-slate-200">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.vehicleId}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#0e141b]">{vehicle.registrationNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.manufacturer}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.model}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.year}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.engineNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.chassisNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#4e7097]">{vehicle.color}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[vehicle.status]}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/vehicles/edit/${vehicle.id}`)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 px-4" style={{color:'red'}}>No vehicles found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicle; 