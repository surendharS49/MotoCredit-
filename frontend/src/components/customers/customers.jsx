import React, { useState, useEffect      } from 'react';
import './customers.css';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/admin/customers')
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCreateCustomerClick = () => {
    navigate('/admin/create-customer');
  };

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1>Customers</h1>
        <div className="header-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button
            className="create-button"
            onClick={handleCreateCustomerClick}
          >
            Create Customer
          </button>
        </div>
      </div>

      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <span className={`status ${customer.status.toLowerCase()}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <button className="action-button">View</button>
                  <button className="action-button">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
