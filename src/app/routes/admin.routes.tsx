import Dashboard from '../../pages/dashboard/Dashboard';
import Users from '../../pages/users/Users';
import AddUser from '../../pages/users/AddUser';
import ShowUser from '../../pages/users/ShowUser';
import Permissions from '../../pages/permissions/Permissions';
import ShowPermission from '../../pages/permissions/ShowPermission';
import AddPermission from '../../pages/permissions/AddPermission';
import Roles from '../../pages/roles/Roles';

export const adminRoutes = [
	{ index: true, element: <Dashboard /> },
	{ path: 'dashboard', element: <Dashboard /> },
	{ path: 'users', element: <Users /> },
	{ path: 'user/add', element: <AddUser /> },
	{ path: 'user/show/:userId', element: <ShowUser /> },
	{ path: 'permissions', element: <Permissions /> },
	{ path: 'permission/add', element: <AddPermission /> },
	{ path: 'permission/show/:permissionId', element: <ShowPermission /> },
	{ path: 'roles', element: <Roles /> },
];