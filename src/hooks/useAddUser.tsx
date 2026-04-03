import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useRoles  = () => {
    
    const rolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await api.get('/api/admin/roles');
            return res.data.data;
        },
    });

    return {
        roles: rolesQuery.data,
        isLoading: rolesQuery.isLoading,
    };
    
};