import axios from 'axios';
import { clearAuth } from './auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login/refresh endpoints
    const skipAuthPaths = ['/admin/login', '/auth/refresh-token'];
    if (skipAuthPaths.some(path => config.url.includes(path))) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      // Ensure we don't add Bearer prefix if it's already there
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log('🔑 Adding Authorization header to request:', config.url);
    } else {
      console.warn('⚠️ No token found for authenticated request to:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    if (response.config.url.includes('/admin/login')) {
      console.log('✅ Login successful, response data:', response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log all errors for debugging
    console.error('❌ API Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: originalRequest?.method,
        headers: originalRequest?.headers,
        data: originalRequest?.data,
      }
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // If we've already retried, don't loop
      if (originalRequest._retry) {
        console.log('⚠️ Already retried request, logging out...');
        clearAuth();
        window.location.href = '/auth/admin?session=expired';
        return Promise.reject(error);
      }
      
      // Skip retry for login endpoint or if no refresh token
      if (originalRequest.url.includes('/admin/login') || !localStorage.getItem('refreshToken')) {
        console.log('⚠️ Not retrying login request or no refresh token available');
        return Promise.reject(error);
      }
      
      console.log('🔄 Attempting to refresh token...');
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api'}/auth/refresh-token`,
          { refreshToken },
          { 
            withCredentials: true,
            skipAuthRefresh: true // Prevent infinite loop
          }
        );
        
        if (response.data.token) {
          console.log('🔄 Token refreshed successfully');
          // Update stored token and retry original request
          localStorage.setItem('token', response.data.token);
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        clearAuth();
        window.location.href = '/auth/admin?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const { status, data } = error.response;
      
      if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('❌ Access forbidden - insufficient permissions');
      } else if (status === 404) {
        // Not found
        console.error('❌ Resource not found');
      } else if (status >= 500) {
        // Server error
        console.error('❌ Server error occurred');
      }
      
      // Return a more user-friendly error message if available
      if (data && data.message) {
        return Promise.reject(new Error(data.message));
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ No response received from server');
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    } else {
      // Something happened in setting up the request
      console.error('❌ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;