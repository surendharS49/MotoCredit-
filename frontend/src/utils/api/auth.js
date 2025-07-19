import { jwtDecode } from 'jwt-decode';
import api from './axiosConfig';

// Constants
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ADMIN_INFO_KEY = 'adminInfo';

/**
 * Check if user is authenticated and token is valid
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  console.group('🔒 isAuthenticated - Start Check');
  try {
    const token = getToken();
    
    if (!token) {
      console.log('❌ No token found');
      console.groupEnd();
      return false;
    }

    try {
      const decoded = decodeToken(token);
      if (!decoded) {
        console.log('❌ Token is invalid');
        console.groupEnd();
        return false;
      }
      
      const currentTime = Date.now() / 1000;
      const expirationTime = decoded.exp;
      const timeUntilExpiration = expirationTime - currentTime;
      
      console.log('⏰ Token expires at:', new Date(expirationTime * 1000).toISOString());
      console.log('⏰ Time until expiration (minutes):', Math.round(timeUntilExpiration / 60));
      
      // If token is expired by more than 5 minutes, clear auth
      if (timeUntilExpiration < -300) {
        console.log('❌ Token expired more than 5 minutes ago!');
        clearAuth();
        console.groupEnd();
        return false;
      }
      
      // If token is expired but within grace period, still consider it valid
      // The axios interceptor will try to refresh it
      if (timeUntilExpiration < 0) {
        console.log('⚠️ Token expired but within grace period');
        console.groupEnd();
        return true;
      }
      
      console.log('✅ Token is valid');
      console.groupEnd();
      return true;
      
    } catch (error) {
      console.error('❌ Error validating token:', error);
      clearAuth();
      console.groupEnd();
      return false;
    }
  } catch (error) {
    console.error('❌ Error in isAuthenticated:', error);
    clearAuth();
    console.groupEnd();
    return false;
  }
};

/**
 * Get the stored token
 * @returns {string|null} The token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the stored refresh token
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get admin info from localStorage
 * @returns {Object|null} The admin info or null if not found
 */
export const getAdminInfo = () => {
  const adminInfo = localStorage.getItem(ADMIN_INFO_KEY);
  return adminInfo ? JSON.parse(adminInfo) : null;
};

/**
 * Store tokens and admin info
 * @param {string} token - The JWT token
 * @param {string} [refreshToken] - The refresh token (optional)
 * @param {Object} [userData] - User data to store (from login response)
 * @returns {boolean} True if successful, false otherwise
 */
export const setAuthTokens = (token, refreshToken, userData = null) => {
  try {
    // Clean and store token
    if (token) {
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      localStorage.setItem(TOKEN_KEY, cleanToken);
      
      // If we have user data in the token, extract and store it
      if (!userData) {
        try {
          const decoded = jwtDecode(cleanToken);
          if (decoded) {
            userData = {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role
            };
          }
        } catch (e) {
          console.warn('Could not decode token to extract user data:', e);
        }
      }
    }
    
    // Store refresh token if provided
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    
    // Store user data if available
    if (userData) {
      localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(userData));
    }
    
    // Set up axios headers
    return setupAuthHeaders();
  } catch (error) {
    console.error('❌ Error setting auth tokens:', error);
    return false;
  }
};

/**
 * Set up axios headers with current token
 * @returns {boolean} True if headers were set, false otherwise
 */
export const setupAuthHeaders = () => {
  try {
    const token = getToken();
    
    if (token) {
      // Ensure token doesn't have duplicate 'Bearer ' prefix
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      const authHeader = `Bearer ${cleanToken}`;
      
      // Set the header on our api instance
      api.defaults.headers.common['Authorization'] = authHeader;
      return true;
    }
    
    // No token found, clear any existing auth headers
    if (api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error setting up auth headers:', error);
    return false;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  // Clear tokens and user data
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_INFO_KEY);
  
  // Clear axios headers
  if (api.defaults.headers.common['Authorization']) {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Decode a JWT token
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded token or null if invalid
 */
const decodeToken = (token) => {
  try {
    // Remove 'Bearer ' prefix if present
    const tokenToDecode = token.startsWith('Bearer ') ? token.substring(7) : token;
    return jwtDecode(tokenToDecode);
  } catch (error) {
    console.error('❌ Error decoding token:', error);
    return null;
  }
};

/**
 * Get the current user's role from the token
 * @returns {string|null} The user's role or null if not available
 */
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Check if the current user has a specific role
 * @param {string|string[]} roles - Role or array of roles to check against
 * @returns {boolean} True if user has one of the specified roles
 */
export const hasRole = (roles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(userRole);
  }
  
  return userRole === roles;
};