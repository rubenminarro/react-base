import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../guards/ProtectedRoute';
import { routes } from './routes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {routes.admin.map((route, i) => (
              <Route key={i} {...route} />
            ))}
          </Route>
        </Route>

        {/* 🔓 Rutas públicas */}
        <Route element={<AuthLayout />}>
          {routes.auth.map((route, i) => (
            <Route key={i} {...route} />
          ))}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}