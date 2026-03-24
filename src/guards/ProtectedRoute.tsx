import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAuthenticated = true; // luego viene de tu backend Laravel

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}