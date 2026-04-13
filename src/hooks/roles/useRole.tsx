import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const useRole  = (roleId: string | undefined) => {
    
    const userQuery = useQuery({
        queryKey: ['roles', roleId],
        queryFn: async () => {
            const res = await api.get(`/api/admin/role/show/${roleId}`);
            return res.data.data;
        },
        enabled: !!roleId,
    });

    const permissionsQuery = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const res = await api.get('/api/admin/role/permissions');
            return res.data.data;
        },
    });

    const permissionsWithChecked = permissionsQuery.data?.map((module: any) => {
        const userPermissions = userQuery.data?.permissions || [];

        return {
            ...module,
            list: (module.list || []).map((permission: any) => ({
                ...permission,
                checked: userPermissions.includes(permission.id)
            }))
        };
    }) || [];

    return {
        role: userQuery.data,
        permissions: permissionsWithChecked,
        isLoading: userQuery.isLoading || permissionsQuery.isLoading,
    };
    
};