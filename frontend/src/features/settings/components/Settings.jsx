import React, { useState, useEffect } from 'react';
import { Navbar } from '../../../components/layout';
import { FaUser, FaLock, FaUsers, FaUserShield, FaSpinner, FaEdit, FaTrash, FaKey, FaEnvelope } from 'react-icons/fa';
import api from '../../../utils/api/axiosConfig';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Feedback state
  const [feedback, setFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showFeedbackStatusModal, setShowFeedbackStatusModal] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState('');

  useEffect(() => {
    fetchProfileData();
    fetchCustomers();
    fetchAdmins();
    fetchFeedbacks();
  }, []);

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedback/getallfeedback');
      setFeedback(response.data);
    } catch {
      setErrorMessage('Failed to fetch feedbacks');
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/admin/profile');
      const { name, email } = response.data;
      setProfileData(prev => ({ ...prev, name, email }));
    } catch {
      setErrorMessage('Failed to fetch profile data');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('customers/getallcustomers');
      setCustomers(response.data);
    } catch {
      setErrorMessage('Failed to fetch customers');
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admin/getalladmins');
      setAdmins(response.data);
    } catch {
      setErrorMessage('Failed to fetch admins');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.put('/admin/update-password', {
        name: profileData.name,
        email: profileData.email,
        admin:true,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });
      setSuccessMessage('Profile updated successfully!');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (customerId) => {
    try {
      await api.post(`/settings/customers/${customerId}/reset-password`, { password: 'password@12345' });
      setSuccessMessage('Password reset initiated successfully');
      setShowResetPasswordModal(false);
    } catch {
      setErrorMessage('Failed to initiate password reset');
    }
  };

  const handleUpdateAdmin = async (adminId, data) => {
    try {
      await api.put(`settings/updateadmin/${adminId}`, data);
      setSuccessMessage('Admin updated successfully');
      fetchAdmins();
    } catch {
      setErrorMessage('Failed to update admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              className={`flex items-center px-6 py-4 focus:outline-none transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="mr-2" />
              <span className="font-medium">Profile</span>
            </button>
            <button
              className={`flex items-center px-6 py-4 focus:outline-none transition-colors duration-200 ${
                activeTab === 'customers'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('customers')}
            >
              <FaUsers className="mr-2" />
              <span className="font-medium">Customers</span>
            </button>
            <button
              className={`flex items-center px-6 py-4 focus:outline-none transition-colors duration-200 ${
                activeTab === 'admins'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('admins')}
            >
              <FaUserShield className="mr-2" />
              <span className="font-medium">Admins</span>
            </button>
            <button
              className={`flex items-center px-6 py-4 focus:outline-none transition-colors duration-200 ${
                activeTab === 'feedback'
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('feedback')}
            >
              <FaUserShield className="mr-2" />
              <span className="font-medium">Feedback</span>
            </button>
          </div>

          {/* Alert Messages */}
          {(successMessage || errorMessage) && (
            <div className="p-4">
              {successMessage && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FaUser className="mr-2 text-gray-400" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FaLock className="mr-2 text-gray-400" />
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Enter current password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FaKey className="mr-2 text-gray-400" />
                          New Password
                        </label>
                        <input
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FaKey className="mr-2 text-gray-400" />
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaUser className="mr-2" />
                    )}
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'customers' && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowResetPasswordModal(true);
                            }}
                            className="flex items-center text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <FaKey className="mr-2" />
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                          <button
                            onClick={() => handleUpdateAdmin(admin._id, { role: 'Admin' })}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            <FaEdit className="inline mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'feedback' && (
  <div className="overflow-hidden rounded-lg border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {feedback.map((fb) => (
          <tr key={fb._id} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fb.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fb.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fb.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fb.message}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fb.status}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <button
                onClick={() => {
                  setSelectedFeedback(fb);
                  setFeedbackStatus(fb.status || 'Pending');
                  setShowFeedbackStatusModal(true);
                }}
                className="flex items-center text-blue-600 hover:text-blue-900 transition-colors duration-200"
              >
                <FaKey className="mr-2" />
                Change Status
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reset Password</h3>
            <p>Are you sure you want to reset the password for {selectedCustomer?.name}?</p>
            <p className="text-sm text-gray-500 mb-4">An OTP will be sent to their email address.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetPassword(selectedCustomer?._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Status Modal */}
      {showFeedbackStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Update Feedback Status</h3>
            <p className="mb-4">Update status for <strong>{selectedFeedback?.name}</strong> ({selectedFeedback?.email})</p>
            <select
              value={feedbackStatus}
              onChange={e => setFeedbackStatus(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.put(`/feedback/updatefeedback/${selectedFeedback._id}`, {
                      ...selectedFeedback,
                      status: feedbackStatus,
                    });
                    setSuccessMessage('Feedback status updated successfully');
                    setShowFeedbackStatusModal(false);
                    fetchFeedbacks();
                  } catch {
                    setErrorMessage('Failed to update feedback status');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 