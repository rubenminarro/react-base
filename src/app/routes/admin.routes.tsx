import Dashboard from '../../pages/dashboard/Dashboard';
import Usuarios from '../../pages/usuarios/Usuarios';
import AddUsuario from '../../pages/usuarios/AddUsuario';

export const adminRoutes = [
  { index: true, element: <Dashboard /> },
  { path: 'dashboard', element: <Dashboard /> },
  { path: 'usuarios', element: <Usuarios /> },
  { path: 'usuarios/nuevo', element: <AddUsuario /> },
];