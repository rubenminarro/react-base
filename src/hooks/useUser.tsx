import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useUserWithRoles  = (id: string | undefined) => {
    
    const userQuery = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const res = await api.get(`/api/admin/user/show/${id}`);
            return res.data.data;
        },
        enabled: !!id,
    });
    
    const rolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await api.get('/api/admin/roles');
            return res.data.data;
        },
    });

    const rolesWithChecked = rolesQuery.data?.map((role: any) => ({
        ...role,
        checked: userQuery.data?.roles?.includes(role.id) || false
    })) || [];

    return {
        user: userQuery.data,
        roles: rolesWithChecked,
        isLoading: userQuery.isLoading || rolesQuery.isLoading,
    };
    
};