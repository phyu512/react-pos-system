import { Navigate, Outlet } from 'react-router-dom';
import { PATHS } from '../paths';
import { ROLES,ROLESGROUP } from '../constants/roles';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to={PATHS.LOGIN} replace />;

  if (allowedRoles) {
      const userRole = user?.role?.trim(); // Keep original casing
      
      // Check if user is Admin using the constant
      const isITAdmin = userRole === ROLES.ADMINISTRATOR;
      
      // Check if role is in the allowed list (No normalization needed if constants match DB)
      const hasPermission = allowedRoles.includes(userRole) || isITAdmin;

      if (!hasPermission) {
          console.warn(`Access Denied. DB Role: "${userRole}" vs Allowed:`, allowedRoles);
          return <Navigate to={PATHS.DASHBOARD} replace />;
      }
  }

  return <Outlet />;
};

export default ProtectedRoute;