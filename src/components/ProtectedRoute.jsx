import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner label={location.pathname.startsWith('/admin') ? 'Loading admin dashboard' : 'Loading account'} fullPage />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !role && !timeoutReached) {
    return <LoadingSpinner label="Checking permissions" fullPage />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn('Blocked access - role =', role);
    return <Navigate to="/" replace />;
  }

  return children;
}
