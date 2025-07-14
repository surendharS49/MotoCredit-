import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './customers.css';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [newCustomer, setNewCustomer] = useState({
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

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/admin/createcustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.message || 'Failed to create customer');
      }

      // Customer created successfully
      navigate('/admin/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate('/admin/customers');
  };

  return (
    <div className="create-customer-container">
      <div className="create-customer-header">
        <h1>Create New Customer</h1>
      </div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <div className="create-customer-form">
        <form onSubmit={handleCreateCustomer}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              value={newCustomer.city}
              onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              value={newCustomer.state}
              onChange={(e) => setNewCustomer({...newCustomer, state: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Zip Code:</label>
            <input
              type="text"
              value={newCustomer.zip}
              onChange={(e) => setNewCustomer({...newCustomer, zip: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              value={newCustomer.country}
              onChange={(e) => setNewCustomer({...newCustomer, country: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={newCustomer.dob}
              onChange={(e) => setNewCustomer({...newCustomer, dob: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select
              value={newCustomer.gender}
              onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value})}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Aadhar Number:</label>
            <input
              type="text"
              value={newCustomer.aadhar}
              onChange={(e) => setNewCustomer({...newCustomer, aadhar: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Pan Number:</label>
            <input
              type="text"
              value={newCustomer.pan}
              onChange={(e) => setNewCustomer({...newCustomer, pan: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Driving License Number:</label>
            <input
              type="text"
              value={newCustomer.drivingLicense}
              onChange={(e) => setNewCustomer({...newCustomer, drivingLicense: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer; 