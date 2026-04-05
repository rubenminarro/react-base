import Dashboard from '../../pages/dashboard/Dashboard';
import Users from '../../pages/users/Users';
import AddUser from '../../pages/users/AddUser';
import ShowUser from '../../pages/users/ShowUser';
import Permissions from '../../pages/permissions/Permissions';

export const adminRoutes = [
	{ index: true, element: <Dashboard /> },
	{ path: 'dashboard', element: <Dashboard /> },
	{ path: 'users', element: <Users /> },
	{ path: 'user/add', element: <AddUser /> },
	{ path: 'user/show/:userId', element: <ShowUser /> },
	{ path: 'permissions', element: <Permissions /> },
];