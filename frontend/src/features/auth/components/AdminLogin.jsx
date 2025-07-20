import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/motocredit.png';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setupAuthHeaders, isAuthenticated } from '../../../utils/api/auth';
import api from '../../../utils/api/axiosConfig';

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔑 Attempting login with:', { email });
      
      // Clear any existing auth state
      localStorage.removeItem('token');
      localStorage.removeItem('adminInfo');
      
      // Make login request without auth header
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'}/admin/login`, 
        { email, password }
      );
      
      console.log('✅ Login response received');
      
      if (!data.token) {
        throw new Error(data.message || 'No token received from server');
      }

      // Save the token to localStorage
      console.log('🔐 Setting auth token in localStorage...');
      localStorage.setItem('token', data.token);
      console.log('✅ Token stored in localStorage');
      
      // Set up axios headers with the new token
      console.log('🔄 Setting up axios headers...');
      const headersSet = setupAuthHeaders();
      if (!headersSet) {
        throw new Error('Failed to set up authentication headers');
      }
      
      // Save admin info
      const adminInfo = {
        email: email,
        lastLogin: new Date().toISOString()
      };
      console.log('💾 Saving admin info:', adminInfo);
      localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
      
      // Force refresh of auth state in other tabs/windows
      console.log('🔄 Dispatching storage event...');
      window.dispatchEvent(new Event('storage'));
      
      // Verify authentication status
      console.log('🔒 Checking authentication status...');
      const authStatus = isAuthenticated();
      console.log('🔑 isAuthenticated() result:', authStatus);
      
      if (!authStatus) {
        throw new Error('Failed to authenticate after login');
      }
      
      // Make a test API call to verify the token works
      try {
        console.log('🔍 Verifying token with test API call...');
        const testResponse = await api.get('/admin/verify');
        console.log('✅ Test API call successful:', testResponse.data);
      } catch (testError) {
        console.error('❌ Test API call failed:', testError);
        throw new Error('Token verification failed');
      }
      
      // Navigate to dashboard
      console.log('🚀 Navigating to:', from);
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      // Clear any partial auth state
      localStorage.removeItem('token');
      localStorage.removeItem('adminInfo');
      delete api.defaults.headers.common['Authorization'];
      
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };


  // Add a function to check token validity
  const checkTokenValidity = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        // Decode the token to check expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token has expired
          handleLogout();
        }
      } catch (error) {
        // Invalid token
        console.error('Token validation error:', error);
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/auth/admin');
  };

  // Check token validity when component mounts
  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="MotoCredit logo" className="w-12 h-12" />
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">MotoCredit</h2>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Please enter your admin credentials to sign in</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center justify-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your admin email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Sign in'}
          </button>
        </form>

        {/* Regular User Login Link */}
        <div className="text-center">
          <span className="text-sm text-gray-500">Not an admin? </span>
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            onClick={() => navigate('/')}
          >
            Sign in as user
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
