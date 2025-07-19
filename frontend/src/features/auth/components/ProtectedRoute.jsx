import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../../utils/api/auth';

const ProtectedRoute = () => {
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: Checking authentication status');
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      console.log('Auth status:', authStatus);
      setIsAuth(authStatus);
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [location.pathname]);

  if (!authChecked) {
    console.log('Auth check in progress...');
    return null; // or a loading spinner
  }

  console.log('ProtectedRoute: Auth check complete. isAuth:', isAuth);
  
  if (!isAuth) {
    console.log('Not authenticated, redirecting to login');
    // Save the location they were trying to go to
    return <Navigate to="/auth/admin" state={{ from: location }} replace />;
  }

  console.log('User is authenticated, rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute;