import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem('adminInfo');
  return adminInfo ? JSON.parse(adminInfo) : null;
};

export const setAuthToken = (token) => {
  const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  localStorage.setItem('adminToken', bearerToken);
  axios.defaults.headers.common['Authorization'] = bearerToken;
};

export const setupAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] = bearerToken;
  }
};

export const clearAuth = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  delete axios.defaults.headers.common['Authorization'];
}; 